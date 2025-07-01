import express from "express";
import {
  deleteEmp,
  getEmployeeDetails,
  getEmployeeDetailsById,
  getMe,
  login,
  logout,
  signup,
  updateCheckStatus,
  updateEmpDetails,
  updatePassword,
} from "../controllers/EmployeeControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const empRouter = express.Router();

empRouter.post("/signup", signup);
empRouter.post("/login", login);
empRouter.post("/logout", logout);


empRouter.get("/me", authMiddleware, getMe);
empRouter.post("/updatePassword", authMiddleware, updatePassword);
empRouter.patch("/updateStatus", authMiddleware, updateCheckStatus);


empRouter.get("/", getEmployeeDetails);
empRouter.delete("/:id", deleteEmp);
empRouter.get("/:id", getEmployeeDetailsById);
empRouter.patch("/", updateEmpDetails);

export default empRouter;
