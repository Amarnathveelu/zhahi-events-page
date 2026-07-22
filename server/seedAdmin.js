import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const SEED_USERNAME = "zhahiadmin";
const SEED_PASSWORD = "zhahiadmin123";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ username: SEED_USERNAME });
    if (existing) {
      existing.password = SEED_PASSWORD;
      await existing.save();
      console.log(`Admin "${SEED_USERNAME}" already exists. Password updated.`);
      process.exit(0);
    }

    await Admin.create({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });

    console.log("Admin user created successfully!");
    console.log(`Username: ${SEED_USERNAME}`);
    console.log(`Password: ${SEED_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedAdmin();
