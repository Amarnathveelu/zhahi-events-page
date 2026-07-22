import mongoose from "mongoose";

const eventUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    type: { type: String, enum: ["general", "event", "payment"], default: "general" },
  },
  { timestamps: true }
);

export default mongoose.model("EventUpdate", eventUpdateSchema);
