import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"] },
    password: { type: String, required: true },
    collegeName: { type: String, default: "" },
    year: { type: String, default: "" },
    studentId: { type: String, unique: true },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.pre("save", async function () {
  if (!this.isNew) return;
  const count = await mongoose.model("Student").countDocuments();
  this.studentId = `ZTT-${String(count + 1).padStart(4, "0")}`;
});

export default mongoose.model("Student", studentSchema);
