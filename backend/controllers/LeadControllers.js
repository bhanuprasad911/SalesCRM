import Lead from "../models/Lead.model.js";
import LeadFile from "../models/LeadFile.model.js";
import Employee from "../models/Employee.model.js";
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

  const filePath = path.join(process.cwd(), "uploads", "temp", tempId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const rawLeads = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rawLeads.push(row))
      .on("end", async () => {
        const requiredFields = [
          "name",
          "email",
          "phone",
          "location",
          "language",
          "type",
          "status",
          "source",
          "NextAvailable",
        ];

        const invalid = rawLeads.find((lead) =>
          requiredFields.some((f) => !lead[f])
        );
        if (invalid) {
          return res
            .status(400)
            .json({ message: "Missing fields in CSV data" });
        }

        const employees = await Employee.find();
        const employeeMap = new Map(); // empId => lead[]
        const leadsStep1 = [];
        const leadsUnassigned = [];

        // Step 1: Assign leads based on both language and location match
        for (const lead of rawLeads) {
          const match = employees.find(
            (emp) =>
              emp.language === lead.language && emp.location === lead.location
          );

          if (match) {
            const empId = match._id.toString();
            if (!employeeMap.has(empId)) {
              employeeMap.set(empId, []);
            }
            const leadDoc = { ...lead, AssignedTo: match._id };
            employeeMap.get(empId).push(leadDoc);
            leadsStep1.push(leadDoc);
          } else {
            leadsUnassigned.push(lead); // Save for next step
          }
        }

        // Step 2: Find employees with no assignments from step 1
        const assignedEmpIds = new Set([...employeeMap.keys()]);
        const employeesWithNoStep1Assignments = employees.filter(
          (emp) => !assignedEmpIds.has(emp._id.toString())
        );

        // Step 3: Match by either language OR location & distribute equally
        const eligibleEmpLeadsMap = new Map(); // empId => []
        for (const emp of employeesWithNoStep1Assignments) {
          eligibleEmpLeadsMap.set(emp._id.toString(), []);
        }

        for (const lead of leadsUnassigned) {
          const matchingEmps = employeesWithNoStep1Assignments.filter(
            (emp) =>
              emp.language === lead.language || emp.location === lead.location
          );

          if (matchingEmps.length > 0) {
            const leastAssignedEmp = [...matchingEmps].sort(
              (a, b) =>
                (eligibleEmpLeadsMap.get(a._id.toString())?.length ?? 0) -
                (eligibleEmpLeadsMap.get(b._id.toString())?.length ?? 0)
            )[0];

            const empId = leastAssignedEmp._id.toString();
            const leadDoc = { ...lead, AssignedTo: leastAssignedEmp._id };
            eligibleEmpLeadsMap.get(empId).push(leadDoc);
          }
        }

        // Merge both employee maps
        for (const [empId, leads] of eligibleEmpLeadsMap.entries()) {
          if (!employeeMap.has(empId)) {
            employeeMap.set(empId, []);
          }
          employeeMap.get(empId).push(...leads);
        }

        const finalLeads = [...leadsStep1];
        for (const leads of eligibleEmpLeadsMap.values()) {
          finalLeads.push(...leads);
        }

        // Handle totally unassigned leads (no match even in Step 3)
        const totalAssignedEmails = new Set(finalLeads.map((l) => l.email));
        const completelyUnassigned = rawLeads
          .filter((l) => !totalAssignedEmails.has(l.email))
          .map((l) => ({ ...l, AssignedTo: null }));
        finalLeads.push(...completelyUnassigned);

        // Save all leads
        const insertedLeads = await Lead.insertMany(finalLeads);

        // Update assignedChats for each employee
        for (const [empId, leads] of employeeMap.entries()) {
          const leadIds = leads
            .map((l) => insertedLeads.find((ins) => ins.email === l.email)?._id)
            .filter(Boolean);

          if (leadIds.length > 0) {
            await Employee.findByIdAndUpdate(empId, {
              $push: { assignedChats: { $each: leadIds } },
            });
          }
        }

        // Create LeadFile record
        await LeadFile.create({
          name: fileName,
          total: insertedLeads.length,
          assigned: insertedLeads.filter((l) => l.AssignedTo).length,
          unAssigned: insertedLeads.filter((l) => !l.AssignedTo).length,
        });

        fs.unlinkSync(filePath);
        res.status(200).json({
          message: `${insertedLeads.length} leads saved successfully.`,
        });
      });
  } catch (error) {
    console.error("saveToDb Error:", error);
    res.status(500).json({ message: "Failed to save leads to DB." });
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
export const getLeads = async (req, res) => {
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
