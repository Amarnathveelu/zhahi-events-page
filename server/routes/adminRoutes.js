import { Router } from "express";
import { loginAdmin, createAdmin, getAdminProfile } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/profile", adminAuth, getAdminProfile);

export default router;
