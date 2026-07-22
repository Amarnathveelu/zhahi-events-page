import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      tagline: req.body.tagline || "",
      fee: Number(req.body.fee),
      duration: req.body.duration || "1 Day",
      mode: req.body.mode || "Live",
      isTeamEvent: req.body.isTeamEvent === "true" || req.body.isTeamEvent === true,
      maxTeamSize: Number(req.body.maxTeamSize) || 1,
      languageChoice: req.body.languageChoice ? JSON.parse(req.body.languageChoice) : [],
      hasThemeReveal: req.body.hasThemeReveal === "true" || req.body.hasThemeReveal === true,
      themeRevealNote: req.body.themeRevealNote || "",
      extraNote: req.body.extraNote || "",
      accent: req.body.accent || "#6C5CE7",
    };

    if (req.files?.image) {
      eventData.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.qrCode) {
      eventData.qrCode = `/uploads/${req.files.qrCode[0].filename}`;
    }

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating event." });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching events." });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files?.image) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.qrCode) {
      updateData.qrCode = `/uploads/${req.files.qrCode[0].filename}`;
    }

    if (updateData.isTeamEvent !== undefined) {
      updateData.isTeamEvent = updateData.isTeamEvent === "true" || updateData.isTeamEvent === true;
    }
    if (updateData.hasThemeReveal !== undefined) {
      updateData.hasThemeReveal = updateData.hasThemeReveal === "true" || updateData.hasThemeReveal === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === "true" || updateData.isActive === true;
    }
    if (updateData.fee) {
      updateData.fee = Number(updateData.fee);
    }
    if (updateData.maxTeamSize) {
      updateData.maxTeamSize = Number(updateData.maxTeamSize);
    }
    if (updateData.languageChoice && typeof updateData.languageChoice === "string") {
      updateData.languageChoice = JSON.parse(updateData.languageChoice);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating event." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting event." });
  }
};

export const toggleEventActive = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    event.isActive = !event.isActive;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
