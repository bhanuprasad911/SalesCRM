import express from "express";
import {
  cancelUploadTempFile,
  getLeads,
  saveToDb,
  upload,
  uploadTempFile,
} from "../controllers/LeadControllers.js";
const LeadRouter = express.Router();
LeadRouter.post("/upload-temp", upload.single("file"), uploadTempFile);
LeadRouter.post("/cancel-upload", cancelUploadTempFile);
LeadRouter.post("/save-to-db", saveToDb);
LeadRouter.get('/', getLeads)

export default LeadRouter;
