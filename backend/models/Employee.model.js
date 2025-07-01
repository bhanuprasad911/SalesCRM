// models/Employee.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BreakSchema = new mongoose.Schema(
  {
    breakStartTime: String, // e.g., "1:00 PM"
    breakEndTime: String, // e.g., "1:30 PM"
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema(
  {
    date: String,
    checkedInTime: String,
    checkedOutTime: String,
    breaks: [BreakSchema],
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    location: String,
    language: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    assignedChats: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leads" }],
      default: [],
    },
    closedChats: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leads" }],
      default: [],
    },
    history: [HistorySchema],
  },
  { timestamps: true }
);
EmployeeSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Employee = mongoose.model("employees", EmployeeSchema);
export default Employee;
