import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventActive,
} from "../controllers/eventController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]),
  createEvent
);

router.put(
  "/:id",
  adminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]),
  updateEvent
);

router.delete("/:id", adminAuth, deleteEvent);
router.patch("/:id/toggle", adminAuth, toggleEventActive);

export default router;
