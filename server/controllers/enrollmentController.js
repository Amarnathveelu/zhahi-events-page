import Enrollment from "../models/Enrollment.js";

export const createEnrollment = async (req, res) => {
  try {
    const {
      competitionId,
      competitionTitle,
      fee,
      name,
      teamName,
      teamMembers,
      phone,
      email,
      collegeName,
      year,
      language,
    } = req.body;

    if (!competitionId || !competitionTitle || !fee) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!phone || !email || !collegeName || !year) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const enrollment = await Enrollment.create({
      competitionId,
      competitionTitle,
      fee,
      paymentMethod: "qr",
      paymentStatus: "pending",
      name: name || undefined,
      teamName: teamName || undefined,
      teamMembers: teamMembers
        ? teamMembers.filter((m) => m?.name?.trim()).map((m) => ({ name: m.name.trim() }))
        : undefined,
      phone,
      email,
      collegeName,
      year,
      language: language || null,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(err.errors)[0]?.message || "Validation failed." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error while creating enrollment." });
  }
};

export const uploadPaymentScreenshot = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a payment screenshot." });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        paymentScreenshot: `/uploads/${req.file.filename}`,
        paymentStatus: "verification_pending",
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.json({ message: "Screenshot uploaded. Awaiting verification.", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while uploading screenshot." });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const { competitionId, status } = req.query;
    const filter = {};
    if (competitionId) filter.competitionId = competitionId;
    if (status) filter.paymentStatus = status;
    const enrollments = await Enrollment.find(filter).sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching enrollments." });
  }
};

export const verifyEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'." });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        paymentStatus: action === "approve" ? "paid" : "failed",
        adminVerified: action === "approve",
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.json({ message: `Enrollment ${action === "approve" ? "approved" : "rejected"}.`, enrollment });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
