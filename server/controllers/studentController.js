import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import EventUpdate from "../models/EventUpdate.js";
import { generateStudentToken } from "../middleware/studentAuth.js";

export const registerStudent = async (req, res) => {
  try {
    const { name, email, phone, password, collegeName, year } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required." });
    }
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Account already exists with this email." });
    }
    const student = await Student.create({ name, email, phone, password, collegeName, year });
    const token = generateStudentToken(student._id);
    res.status(201).json({
      message: "Account created successfully",
      token,
      student: { id: student._id, name: student.name, email: student.email, studentId: student.studentId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = generateStudentToken(student._id);
    res.json({
      message: "Login successful",
      token,
      student: { id: student._id, name: student.name, email: student.email, studentId: student.studentId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select("email phone");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    const enrollments = await Enrollment.find({
      $or: [{ email: student.email }, { phone: student.phone }],
    }).sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getStudentUpdates = async (req, res) => {
  try {
    const updates = await EventUpdate.find().sort({ createdAt: -1 }).limit(20);
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
