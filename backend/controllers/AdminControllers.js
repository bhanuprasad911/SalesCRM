import { Admin, Activity } from "../models/Admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const exist = await Admin.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ message: "Admin with the given mail already exists" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password,
    });
    await newAdmin.save();
    return res.status(201).json({ message: "Signin succcessfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Admin with the given mail does not exist" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.cookie("admintoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set true in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Login Succcessfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const adminMe = async (req, res) => {
  const id = req.user.id;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin found", admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const id = req.user.id;
  console.log(req.body);
  const { password } = req.body;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.password = password;
    await admin.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getRecentAcctivity = async (req, res) => {
  try {
    const response = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
