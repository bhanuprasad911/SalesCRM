import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
import cors from "cors";
import path from "path";
dotenv.config();
import empRouter from "./routes/EmployeeRoutes.js";
import LeadRouter from "./routes/LeadRoutes.js";
import cookieParser from "cookie-parser";
import adminrouter from "./routes/AdminRoutes.js";

const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URL;
const __dirname = path.resolve();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.0.18:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/employee", empRouter);
app.use("/api/lead", LeadRouter);
app.use("/api/admin", adminrouter);
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.use(
  "/admin",
  express.static(path.join(__dirname, "../frontend-admin/dist"))
);
app.use("/ex", express.static(path.join(__dirname, "../frontend-client/dist")));

app.get("/admin/*path", (req, res, next) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../frontend-admin/dist/index.html"));
  } else {
    next();
  }
});

app.get("/ex/*path", (req, res, next) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../frontend-client/dist/index.html"));
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`server started at http://localhost:${port}`);
  dbConnection(url);
});
