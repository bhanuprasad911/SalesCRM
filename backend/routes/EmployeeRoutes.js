import express from "express";
import {
  deleteEmp,
  getEmployeeDetails,
  getEmployeeDetailsById,
  signup,
} from "../controllers/EmployeeControllers.js";

const empRouter = express.Router();

empRouter.post("/signup", signup);
empRouter.get("/", getEmployeeDetails);
empRouter.delete("/:id", deleteEmp);
empRouter.get("/:id", getEmployeeDetailsById);

export default empRouter;
