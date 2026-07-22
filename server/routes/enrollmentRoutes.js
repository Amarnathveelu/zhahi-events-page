import { Router } from "express";
import {
  createEnrollment,
  getEnrollments,
  uploadPaymentScreenshot,
  verifyEnrollment,
} from "../controllers/enrollmentController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", createEnrollment);
router.get("/", getEnrollments);
router.post("/:enrollmentId/screenshot", upload.single("screenshot"), uploadPaymentScreenshot);
router.patch("/:enrollmentId/verify", adminAuth, verifyEnrollment);

export default router;
