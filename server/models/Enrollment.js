import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true } },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    competitionId: {
      type: String,
      required: true,
    },
    competitionTitle: { type: String, required: true },

    name: { type: String, trim: true },
    teamName: { type: String, trim: true },
    teamMembers: { type: [teamMemberSchema], default: undefined },

    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    collegeName: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    language: { type: String, default: null },

    fee: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "verification_pending"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["qr"],
      default: "qr",
    },
    paymentScreenshot: { type: String, default: "" },
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
