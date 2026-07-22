import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    image: { type: String, default: "" },
    fee: { type: Number, required: true, min: 0 },
    duration: { type: String, default: "1 Day" },
    mode: { type: String, default: "Live" },
    isTeamEvent: { type: Boolean, default: false },
    maxTeamSize: { type: Number, default: 1 },
    languageChoice: { type: [String], default: [] },
    hasThemeReveal: { type: Boolean, default: false },
    themeRevealNote: { type: String, default: "" },
    extraNote: { type: String, default: "" },
    accent: { type: String, default: "#6C5CE7" },
    qrCode: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
