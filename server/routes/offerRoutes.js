import { Router } from "express";
import {
  createOffer,
  getOffers,
  updateOffer,
  deleteOffer,
  toggleOfferActive,
} from "../controllers/offerController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getOffers);

router.post("/", adminAuth, upload.fields([{ name: "image", maxCount: 1 }]), createOffer);
router.put("/:id", adminAuth, upload.fields([{ name: "image", maxCount: 1 }]), updateOffer);
router.delete("/:id", adminAuth, deleteOffer);
router.patch("/:id/toggle", adminAuth, toggleOfferActive);

export default router;
