import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Megaphone, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { getEvents, getOffers, getEnrollments } from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, offers: 0, enrollments: 0, pending: 0, paid: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, offersRes, enrollRes] = await Promise.all([
          getEvents(),
          getOffers(),
          getEnrollments(),
        ]);
        const enrollments = enrollRes.data;
        setStats({
          events: eventsRes.data.length,
          offers: offersRes.data.length,
          enrollments: enrollments.length,
          pending: enrollments.filter((e) => e.paymentStatus === "verification_pending").length,
          paid: enrollments.filter((e) => e.paymentStatus === "paid").length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Events", value: stats.events, icon: Calendar, color: "#6C5CE7" },
    { label: "Active Offers", value: stats.offers, icon: Megaphone, color: "#F59E0B" },
    { label: "Total Enrollments", value: stats.enrollments, icon: Users, color: "#10B981" },
    { label: "Pending Verification", value: stats.pending, icon: Clock, color: "#EF4444" },
    { label: "Verified Payments", value: stats.paid, icon: CheckCircle2, color: "#22C55E" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}12` }}
              >
                <card.icon size={20} style={{ color: card.color }} />
              </div>
            </div>
            <p className="font-bold text-2xl text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
