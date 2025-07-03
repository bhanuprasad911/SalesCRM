import Lead from "../models/Lead.model.js";
import LeadFile from "../models/LeadFile.model.js";
import Employee from "../models/Employee.model.js";
import { Activity as AdminActivity } from "../models/Admin.model.js"; // ✅ For admin activity logs

import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import csvParser from "csv-parser";


export const saveToDb = async (req, res) => {
  const { tempId, fileName } = req.body;

  if (!tempId) {
    return res.status(400).json({ message: "Temp ID is required" });
  }

  const filePath = path.join(process.cwd(), "uploads", "temp", String(tempId));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const existingFile = await LeadFile.findOne({ name: fileName });
  if (existingFile) {
    return res.status(409).json({ message: "File with this name already exists" });
  }

  const rawLeads = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rawLeads.push(row))
      .on("end", async () => {
        const requiredFields = ["name", "email", "phone", "location", "language", "source", "NextAvailable"];
        const invalid = rawLeads.find((lead) => requiredFields.some((f) => !lead[f]));
        if (invalid) {
          return res.status(400).json({ message: "Missing fields in CSV data" });
        }

        const employees = await Employee.find();
        const employeeMap = new Map(); // empId => lead[]
        const assignedLeads = [];
        const remainingLeads = [];

        // Case 1: No employees
        if (employees.length === 0) {
          const unassignedLeads = rawLeads.map((lead) => ({ ...lead, AssignedTo: null, fileName }));
          await Lead.insertMany(unassignedLeads);
          await LeadFile.create({
            name: fileName,
            total: unassignedLeads.length,
            assigned: 0,
            unAssigned: unassignedLeads.length,
            closed: 0,
          });
          fs.unlinkSync(filePath);
          return res.status(200).json({ message: "No employees found. All leads saved as unassigned." });
        }

        // Step 1: Match by language + location
        for (const lead of rawLeads) {
          const match = employees.find(emp => emp.language === lead.language && emp.location === lead.location);
          if (match) {
            const empId = match._id.toString();
            if (!employeeMap.has(empId)) employeeMap.set(empId, []);
            const doc = { ...lead, AssignedTo: match._id, fileName };
            employeeMap.get(empId).push(doc);
            assignedLeads.push(doc);
          } else {
            remainingLeads.push(lead);
          }
        }

        // Step 2: Match by language OR location
        const stillRemainingLeads = [];
        for (const lead of remainingLeads) {
          const matchingEmps = employees.filter(emp =>
            emp.language === lead.language || emp.location === lead.location
          );
          if (matchingEmps.length > 0) {
            const empAssignments = Array.from(employeeMap.entries()).map(([id, leads]) => ({
              empId: id,
              count: leads.length,
            }));

            const empCounts = employees.map((emp) => {
              const entry = empAssignments.find((e) => e.empId === emp._id.toString());
              return { emp, count: entry ? entry.count : 0 };
            });

            const leastAssignedEmp = empCounts.sort((a, b) => a.count - b.count)[0].emp;
            const empId = leastAssignedEmp._id.toString();
            if (!employeeMap.has(empId)) employeeMap.set(empId, []);
            const doc = { ...lead, AssignedTo: leastAssignedEmp._id, fileName };
            employeeMap.get(empId).push(doc);
            assignedLeads.push(doc);
          } else {
            stillRemainingLeads.push(lead);
          }
        }

        // Step 3: Distribute leftover leads round-robin based on least assignments
        for (const lead of stillRemainingLeads) {
          const empAssignments = Array.from(employeeMap.entries()).map(([id, leads]) => ({
            empId: id,
            count: leads.length,
          }));

          const empCounts = employees.map((emp) => {
            const entry = empAssignments.find((e) => e.empId === emp._id.toString());
            return { emp, count: entry ? entry.count : 0 };
          });

          const leastAssignedEmp = empCounts.sort((a, b) => a.count - b.count)[0].emp;
          const empId = leastAssignedEmp._id.toString();
          if (!employeeMap.has(empId)) employeeMap.set(empId, []);
          const doc = { ...lead, AssignedTo: leastAssignedEmp._id, fileName };
          employeeMap.get(empId).push(doc);
          assignedLeads.push(doc);
        }

        // Insert all leads
        const insertedLeads = await Lead.insertMany(assignedLeads);

        // Update employees
        for (const [empId, leads] of employeeMap.entries()) {
          const leadIds = leads
            .map((l) => insertedLeads.find((ins) => ins.email === l.email)?._id)
            .filter(Boolean);

          if (leadIds.length > 0) {
            const employee = await Employee.findById(empId);

            await Employee.findByIdAndUpdate(empId, {
              $push: {
                assignedChats: { $each: leadIds },
                recentActivities: {
                  $each: [
                    {
                      message: `You were assigned ${leadIds.length} new lead(s)`,
                      timestamp: new Date(),
                    },
                  ],
                  $slice: -10,
                },
              },
            });

            await AdminActivity.create({
              message: `You have assigned ${leadIds.length} new lead(s) to ${employee.firstName} ${employee.lastName}`,
            });
          }
        }

        // Create LeadFile summary
        await LeadFile.create({
          name: fileName,
          total: insertedLeads.length,
          assigned: insertedLeads.filter((l) => l.AssignedTo).length,
          unAssigned: insertedLeads.filter((l) => !l.AssignedTo).length,
          closed: 0,
        });

        fs.unlinkSync(filePath);
        return res.status(200).json({ message: `${insertedLeads.length} leads saved successfully.` });
      });
  } catch (error) {
    console.error("saveToDb Error:", error);
    return res.status(500).json({ message: "Failed to save leads to DB." });
  }
};




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/temp");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage: tempStorage });

export const uploadTempFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const tempId = file.filename;

    res.status(200).json({
      message: "File uploaded to temp successfully",
      tempId,
    });
    console.log("file uploaded");
  } catch (error) {
    console.error("Temp Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
export const cancelUploadTempFile = async (req, res) => {
  try {
    const { tempId } = req.body;

    if (!tempId) {
      return res.status(400).json({ message: "Missing tempId" });
    }

    const filePath = path.join(__dirname, "../uploads/temp", tempId);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res
        .status(200)
        .json({ message: "Temp file deleted successfully" });
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (err) {
    console.error("Cancel Upload Error:", err);
    return res.status(500).json({ message: "Server error during file cancel" });
  }
};
export const getAllLeadFiles = async (req, res) =>{
  try {
    const result = await LeadFile.find()
    res.status(200).json(result)
    
  }catch(error){
    console.log(error)
    return res.status(500).json({ message: "Server error while getting all lead files" });
  }
}
export const getLeadFiles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const leads = await LeadFile.find().skip(skip).limit(limit);
  const total = await LeadFile.countDocuments();

  res.json({
    data: leads,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
};

export const updateNextAvavilable = async (req, res) => {
  try {
    const {id, time } = req.body;
   
    console.log(req.body)
    const lead = await Lead.findById(id);
    console.log(lead)
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    lead.NextAvailable = time;
    await lead.save();
    return res
      .status(200)
      .json({ message: "Next available time updated successfully" });
  } catch (error) {
    console.error("Error updating next available time:", error);
    return res
      .status(500)
      .json({ message: "Server error updating next available time" });
  }
};

export const updateLeadType = async (req, res) => {
  try {
    const { id, type } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    lead.type = type;
    await lead.save();
    return res.status(200).json({ message: "Lead type updated successfully" });
  } catch (error) {
    console.error("Error updating lead type:", error);
    return res.status(500).json({ message: "Server error updating lead type" });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update lead status
    lead.status = "Closed";
    await lead.save();

    // Update closed count in LeadFile
    const file = await LeadFile.findOne({ name: lead.fileName });
    if (file) {
      file.closed = (file.closed || 0) + 1;
      await file.save();
    }

    // If the lead was assigned, update employee's closedChats and activity
    if (lead.AssignedTo) {
      const employee = await Employee.findById(lead.AssignedTo);
      if (employee) {
        // Add to closedChats
        employee.closedChats.push(lead._id);

        // Push recent activity
        employee.recentActivities.push({
          message: "You have closed a lead",
          timestamp: new Date(),
        });

        // Limit recent activities to last 10
        if (employee.recentActivities.length > 10) {
          employee.recentActivities = employee.recentActivities.slice(
            -10
          );
        }

        await employee.save();

        // Log admin activity (with employee name)
        const empName = `${employee.firstName} ${employee.lastName}`;
        await AdminActivity.create({
          message: `${empName} has closed a lead`,
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Lead status updated successfully" });
  } catch (error) {
    console.error("Error updating lead status:", error);
    return res
      .status(500)
      .json({ message: "Server error updating lead status" });
  }
};



export const getClosedChatsLast10Days = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 9); // last 10 days including today

    const closedLeads = await Lead.aggregate([
      {
        $match: {
          status: "Closed",
          closedAt: { $gte: startDate, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$closedAt" },
          },
          closedCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Convert to map for easy lookup
    const closedMap = new Map();
    closedLeads.forEach((entry) => {
      closedMap.set(entry._id, entry.closedCount);
    });

    const result = [];
    for (let i = 9; i >= 0; i--) {
      const dateObj = new Date();
      dateObj.setDate(today.getDate() - i);

      const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayStr = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, etc.

      result.push({
        date: dateStr,
        day: dayStr,
        closedCount: closedMap.get(dateStr) || 0,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getRecentClosedLeads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

