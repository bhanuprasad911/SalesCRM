import express from "express";
import {
  cancelUploadTempFile,
  getAllLeadFiles,
  getClosedChatsLast10Days,
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
LeadRouter.get("/getClosedInLast10Days", getClosedChatsLast10Days);
LeadRouter.get("/", getLeadFiles);
LeadRouter.get("/all", getAllLeadFiles);
LeadRouter.patch("/updateAvailable", updateNextAvavilable);
LeadRouter.patch("/updateStatus", updateLeadStatus);
LeadRouter.patch("/updateType", updateLeadType);

export default LeadRouter;
