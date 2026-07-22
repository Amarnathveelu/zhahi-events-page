import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

dotenv.config();

const DEFAULT_EVENTS = [
  {
    title: "Web Designing",
    description: "Create a stunning professional website, compete with limited seats, and become the champion. Register Today!",
    tagline: "One Day • Live Web Design Challenge",
    fee: 199,
    duration: "1 Day",
    mode: "Live",
    isTeamEvent: false,
    accent: "#6C8CFF",
    extraNote: "Unique, original design only — duplicate/template layouts will be disqualified.",
  },
  {
    title: "Debugging Competition",
    description: "Show your debugging skills, find and fix bugs faster than everyone else. Compete and win prizes!",
    tagline: "One Day • Live Debugging Challenge",
    fee: 149,
    duration: "1 Day",
    mode: "Live",
    isTeamEvent: false,
    accent: "#B892FF",
    languageChoice: ["Python", "Java"],
  },
  {
    title: "Video Editing",
    description: "We hand you the raw footage on the spot. You bring the storytelling, pacing and polish. Best cut wins.",
    tagline: "Live Edit • Raw Clips Provided",
    fee: 199,
    duration: "1 Day",
    mode: "Live",
    isTeamEvent: false,
    accent: "#FF8A65",
    extraNote: "Editing software must be installed on your own laptop before the event.",
  },
  {
    title: "Content Creation",
    description: "Register as a squad of up to 4. Your theme drops 3 days before the event — enough time to plan, not enough to overthink.",
    tagline: "Team Event • Max 4 Members",
    fee: 299,
    duration: "3-Day Prep + Live",
    mode: "Hybrid",
    isTeamEvent: true,
    maxTeamSize: 4,
    accent: "#4FD1C5",
    hasThemeReveal: true,
    themeRevealNote: "Theme is released 3 days before the event to your registered email.",
  },
  {
    title: "Graphic Design",
    description: "Theme drops 3 days early. Design it, bring it, present it live — 100% human-made. AI-generated art is not allowed and will be disqualified.",
    tagline: "Poster Challenge • No AI Tools",
    fee: 199,
    duration: "3-Day Prep + Live",
    mode: "Hybrid",
    isTeamEvent: false,
    accent: "#F6C453",
    hasThemeReveal: true,
    themeRevealNote: "Poster theme is released 3 days before the event to your registered email.",
    extraNote: "AI design tools are strictly not allowed — hand/software design only.",
  },
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingCount = await Event.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} events already exist. Skipping seed.`);
      process.exit(0);
    }

    await Event.insertMany(DEFAULT_EVENTS);
    console.log(`${DEFAULT_EVENTS.length} default events seeded successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedEvents();
