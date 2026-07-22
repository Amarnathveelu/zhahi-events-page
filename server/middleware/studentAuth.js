import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "zhahi-tech-admin-secret-key-2024";

export const studentAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.studentId = decoded.studentId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const generateStudentToken = (studentId) => {
  return jwt.sign({ studentId, role: "student" }, JWT_SECRET, { expiresIn: "30d" });
};
