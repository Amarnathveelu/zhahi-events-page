import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admins = await Admin.find().select("-password");
    console.log("\nAll admin users in DB:");
    admins.forEach((a) => console.log(`  - ${a.username} (${a._id})`));

    const stale = await Admin.deleteMany({ username: { $ne: "zhahiadmin" } });
    console.log(`\nRemoved ${stale.deletedCount} stale admin(s).`);

    const target = await Admin.findOne({ username: "zhahiadmin" });
    if (target) {
      target.password = "zhahiadmin123";
      await target.save();
      console.log(`Reset password for "zhahiadmin" to "zhahiadmin123".`);
    } else {
      await Admin.create({ username: "zhahiadmin", password: "zhahiadmin123" });
      console.log(`Created "zhahiadmin" / "zhahiadmin123".`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
};

cleanup();
