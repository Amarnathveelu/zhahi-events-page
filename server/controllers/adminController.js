import Admin from "../models/Admin.js";
import { generateToken } from "../middleware/adminAuth.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(admin._id);

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const admin = await Admin.create({ username, password });

    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating admin." });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
