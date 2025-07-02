import express from "express";
import {
  cancelUploadTempFile,
  getLeadFiles,
  saveToDb,
  updateLeadStatus,
  updateLeadType,
  updateNextAvavilable,
  upload,
  uploadTempFile,
} from "../controllers/LeadControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const LeadRouter = express.Router();
LeadRouter.post("/upload-temp", upload.single("file"), uploadTempFile);
LeadRouter.post("/cancel-upload", cancelUploadTempFile);
LeadRouter.post("/save-to-db", saveToDb);
LeadRouter.get("/", getLeadFiles);
LeadRouter.patch("/updateAvailable", updateNextAvavilable);
LeadRouter.patch("/updateStatus", updateLeadStatus);
LeadRouter.patch("/updateType", updateLeadType);

export default LeadRouter;
