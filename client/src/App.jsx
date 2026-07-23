import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Award, BookOpen, Building2, Megaphone, X, ExternalLink } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import EnrollModal from "./components/EnrollModal";
import Competitions from "./components/Competitions";
import AdminPanel from "./components/admin/AdminPanel";
import StudentPortal from "./components/student/StudentPortal";
import { getEvents, getOffers } from "./utils/api";

const STATS = [
  { icon: Users, value: "500+", label: "Trained Students", color: "#6C5CE7" },
  { icon: Award, value: "200+", label: "Placed Students", color: "#A29BFE" },
  { icon: BookOpen, value: "50+", label: "Workshops Conducted", color: "#818CF8" },
  { icon: Building2, value: "30+", label: "Partner Companies", color: "#6366F1" },
];

function StatsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-10 sm:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f35] via-[#1e2440] to-[#1a1f35]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle, #6C5CE7 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <p className="font-display text-3xl sm:text-4xl text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/50 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OffersBanner({ offers }) {
  const [dismissed, setDismissed] = useState(new Set());
  const [selectedOffer, setSelectedOffer] = useState(null);
  const visibleOffers = offers.filter((o) => !dismissed.has(o._id));

  if (visibleOffers.length === 0) return null;

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {visibleOffers.map((offer) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/25 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group"
              onClick={() => setSelectedOffer(offer)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed((prev) => new Set([...prev, offer._id]));
                }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>

              {offer.image && (
                <div className="w-full h-52 sm:h-56 lg:h-72 bg-black/30 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone size={16} className="text-amber-500" />
                  <h4 className="font-bold text-base sm:text-lg lg:text-xl text-white">{offer.title}</h4>
                  {offer.discount && (
                    <span className="text-xs lg:text-sm font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                      {offer.discount}
                    </span>
                  )}
                </div>
                {offer.description && (
                  <p className="text-sm lg:text-base text-white/60 line-clamp-2 leading-relaxed">{offer.description}</p>
                )}
                {offer.link && (
                  <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors mt-3"
                  >
                    Learn More
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Offer detail modal */}
      {selectedOffer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-[#1e2443] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedOffer.image && (
              <div className="relative bg-black">
                <img
                  src={selectedOffer.image}
                  alt={selectedOffer.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone size={16} className="text-amber-500" />
                <h3 className="font-bold text-lg text-white">{selectedOffer.title}</h3>
                {selectedOffer.discount && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                    {selectedOffer.discount}
                  </span>
                )}
              </div>
              {selectedOffer.description && (
                <p className="text-sm text-white/60 leading-relaxed mb-4">{selectedOffer.description}</p>
              )}
              <div className="flex items-center gap-3">
                {selectedOffer.link && (
                  <a
                    href={selectedOffer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    Learn More
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default function App() {
  const [activeCompetition, setActiveCompetition] = useState(null);
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const path = window.location.pathname;
  const isAdminRoute = path === "/admin";
  const isStudentRoute = path === "/student";

  useEffect(() => {
    if (isAdminRoute || isStudentRoute) return;

    const fetchData = async () => {
      try {
        const [eventsRes, offersRes] = await Promise.all([
          getEvents(true),
          getOffers(true),
        ]);
        setEvents(eventsRes.data);
        setOffers(offersRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdminRoute, isStudentRoute]);

  if (isAdminRoute) {
    return <AdminPanel />;
  }

  if (isStudentRoute) {
    return <StudentPortal onBack={() => (window.location.href = "/")} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <OffersBanner offers={offers} />
      <Competitions events={events} loading={loading} onEnroll={setActiveCompetition} />
      <Footer />

      {activeCompetition && (
        <EnrollModal
          competition={activeCompetition}
          onClose={() => setActiveCompetition(null)}
        />
      )}
    </div>
  );
}
