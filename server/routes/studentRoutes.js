import { Router } from "express";
import {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentEnrollments,
  getStudentUpdates,
} from "../controllers/studentController.js";
import { studentAuth } from "../middleware/studentAuth.js";

const router = Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", studentAuth, getStudentProfile);
router.get("/enrollments", studentAuth, getStudentEnrollments);
router.get("/updates", studentAuth, getStudentUpdates);

export default router;
