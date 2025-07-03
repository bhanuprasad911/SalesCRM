import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Warm",
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    closedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      required: true,
    },
    NextAvailable: {
      type: Date,
      default: Date.now,
    },
    AssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Automatically set closedAt when status changes to "Closed"
LeadSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Closed") {
    this.closedAt = new Date();
  }
  next();
});

const Lead = mongoose.model("Leads", LeadSchema);
export default Lead;
