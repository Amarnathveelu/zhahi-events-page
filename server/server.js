import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
   origin: function (origin, cb) {
     const allowed = [
       process.env.CLIENT_URL,
       process.env.FRONTEND_URL,
       "https://zhahi-events-page.vercel.app",
       "https://zhahi-events-page-j2aw.vercel.app",
       "http://localhost:5173",
     ].filter(Boolean);
     if (!origin || allowed.includes(origin)) {
       cb(null, true);
     } else {
       cb(null, true);
     }
   },
   credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/updates", updateRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
