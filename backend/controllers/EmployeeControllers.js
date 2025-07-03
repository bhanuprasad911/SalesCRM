import Employee from "../models/Employee.model.js";
import Lead from "../models/Lead.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const secret = process.env.SECRET;

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, location, language } = req.body;
    if (!firstName || !lastName || !email || !location || !language)
      return res
        .status(404)
        .json({ message: "Please fill all the required fields" });
    const exist = await Employee.findOne({ email });
    if (exist)
      return res
        .status(400)
        .json({ message: "Employee with the given mail already exists" });
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password: lastName,
      language,
      location,
    });
    const result = await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee created successfully", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




// controllers/authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await Employee.findOne({ email });

    if (!exist) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const matched = await bcrypt.compare(password, exist.password);
    if (!matched) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedToday = `${day}-${month}-${year}`;
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Check last history
    const lastHistory = exist.history[exist.history.length - 1];

    // If last history exists and has an open break
    if (lastHistory) {
      const lastBreak = lastHistory.breaks[lastHistory.breaks.length - 1];
      if (lastBreak && !lastBreak.breakEndTime) {
        if (lastBreak.date !== formattedToday) {
          // Step 1: Close previous break at 11:59 PM
          lastBreak.breakEndTime = "11:59 PM";

          // Step 2: Add new history for today
          const newHistory = {
            date: formattedToday,
            checkedInTime: currentTime,
            checkedOutTime: "--:--",
            breaks: [
              {
                date: formattedToday,
                breakStartTime: "12:00 AM",
                breakEndTime: currentTime,
              },
            ],
          };
          exist.history.push(newHistory);
        } else {
          // Same day break, just close it
          lastBreak.breakEndTime = currentTime;

          // Ensure today's history has checkedInTime set
          if (!lastHistory.checkedInTime || lastHistory.checkedInTime === "--:--") {
            lastHistory.checkedInTime = currentTime;
          }
        }
      }
    }

    // If today’s history doesn’t exist at all
    let todayHistory = exist.history.find((h) => h.date === formattedToday);
    if (!todayHistory) {
      todayHistory = {
        date: formattedToday,
        checkedInTime: currentTime,
        checkedOutTime: "--:--",
        breaks: [],
      };
      exist.history.push(todayHistory);
    }

    // Update status and save
    exist.status = "Active";

    // Generate tokens
    const payload = {
      id: exist._id,
      email: exist.email,
      name: exist.name || exist.firstName,
    };

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    // Save refresh token in DB
    exist.refreshToken = refreshToken;
    await exist.save();

    // Send cookies
    res.cookie("emptoken", accessToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("emprefreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", data: exist });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};






// controllers/userController.js
export const getMe = async (req, res) => {
  try {
    console.log("visited me")
    // req.user is attached by authMiddleware after token verification
    const { id, email, name } = req.user;
    const user = await Employee.findById(id);
    console.log(user)
    res.status(200).json({
      user: user, // send only safe, non-sensitive fields
    });
  } catch (error) {
    console.error("Error in /me controller:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateCheckStatus = async (req, res) => {
  try {
    const { checkedIn, shift } = req.body;
    console.log(req.body);
    const user = req.user;
    const emp = await Employee.findById(user.id);
    const shiftIndex = emp.history.findIndex(
      (hist) => hist.date === shift.date
    );
    if (!emp) {
      return res
        .status(400)
        .json({ message: "Could not find the user with the given id" });
    }
    if (checkedIn) {
      if (shiftIndex !== -1 && emp.history[shiftIndex].checkedOutTime) {
        return res
          .status(400)
          .json({ message: "Your shift for today is already completed" });
      }

      emp.status = "Active";

      if (shiftIndex === -1) {
        emp.history.push({ ...shift });
      } else {
        emp.history[shiftIndex].checkedInTime = shift.checkedInTime;
      }

      const result = await emp.save();
      return res
        .status(200)
        .json({ message: "Check-in successful", data: result });
    }
    emp.status = "Inactive";
    if (shiftIndex === -1) {
      return res.status(404).json({ message: "Shift not found" });
    }
    emp.history[shiftIndex].checkedOutTime = shift.checkedOutTime;
    const result = await emp.save();
    res.status(200).json({ message: "Check-out successfull", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const employees = await Employee.find().skip(skip).limit(limit);
    const total = await Employee.countDocuments();

    res.json({
      data: employees,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error });
  }
};
export const getEmployeeDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.findById(id).select("-password");
    if (!id)
      return res.status(400).json({ message: "Employee id is required" });
    if (!result)
      return res
        .status(404)
        .json({ message: "No employee found with the given id" });
    return res
      .status(200)
      .json({ message: "Employee details fetched successfully", data: result });
  } catch (error) {
    console.log("error while fetching emp details with id", error);
    return res.status(500).json({ message: error.message });
  }
};
export const updateEmpDetails = async (req, res) => {
  try {
    const { id, firstName, lastName } = req.body;

    if (!id || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await Employee.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "No employee exists with the given ID" });
    }

    res
      .status(200)
      .json({ message: "Employee details updated successfully", data: result });
  } catch (error) {
    console.error("Error while updating emp details:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmp = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const deletedEmp = await Employee.findByIdAndDelete(id);

    if (!deletedEmp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log("Error while deleting employee", error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  console.log("Triggered logout");
  try {
    const { id } = req.user;
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedToday = `${day}-${month}-${year}`;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const history = employee.history;
    const lastHistory = history[history.length - 1];

    let updatedHistory = [...history];

    if (!lastHistory) {
      // No history — create new entry for today
      updatedHistory.push({
        date: formattedToday,
        checkedInTime: "--:--",
        checkedOutTime: currentTime,
        breaks: [
          {
            date: formattedToday,
            breakStartTime: currentTime,
            breakEndTime: null,
          },
        ],
      });
    } else if (lastHistory.date !== formattedToday) {
      // Cross-day logout
      lastHistory.breaks.push({
        date: lastHistory.date,
        breakStartTime: currentTime,
        breakEndTime: "11:59 PM",
      });

      updatedHistory[updatedHistory.length - 1] = lastHistory;

      // New entry for today
      updatedHistory.push({
        date: formattedToday,
        checkedInTime: "--:--",
        checkedOutTime: currentTime,
        breaks: [
          {
            date: formattedToday,
            breakStartTime: "12:00 AM",
            breakEndTime: null,
          },
        ],
      });
    } else {
      // Same-day logout
      lastHistory.breaks.push({
        date: formattedToday,
        breakStartTime: currentTime,
        breakEndTime: null,
      });
      lastHistory.checkedOutTime = currentTime;
      updatedHistory[updatedHistory.length - 1] = lastHistory;
    }

    // Now update employee atomically
    await Employee.findByIdAndUpdate(id, {
      $set: {
        history: updatedHistory,
        status: "Inactive",
        refreshToken: "",
      },
    });

    // Clear cookies
    res.clearCookie("emptoken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.clearCookie("emprefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    console.log("Logout successful");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};





export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(req.body);
    const user = req.user;
    const exist = await Employee.findById(user.id);
    exist.password = password;
    await exist.save();
    res.status(201).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("error in updating password", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAssignedleads = async (req, res) => {
  try {
    console.log("Decoded User from Token:", req.user);

    // ✅ FIX: use `new` when creating ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log(userId);

    const leads = await Lead.find({ AssignedTo: userId });

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error in getting assigned leads:", error);
    res.status(500).json({ message: error.message });
  }
};
