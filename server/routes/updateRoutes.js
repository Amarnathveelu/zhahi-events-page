import { Router } from "express";
import EventUpdate from "../models/EventUpdate.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const updates = await EventUpdate.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, message, eventId, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required." });
    }
    const update = await EventUpdate.create({ title, message, eventId, type });
    res.status(201).json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await EventUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: "Update deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
