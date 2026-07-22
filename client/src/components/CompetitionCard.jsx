import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, Users } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://zhahi-events-page.onrender.com";

export default function CompetitionCard({ competition, index, onEnroll }) {
  const {
    title,
    description,
    image,
    accent = "#6C5CE7",
    tagline,
    fee,
    duration,
    mode,
    isTeamEvent,
  } = competition;

  const adaptedCompetition = {
    ...competition,
    id: competition._id || competition.id,
    icon: competition.icon || "Sparkles",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group relative bg-[#1e2440]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 p-5 sm:p-6">
        <div className="shrink-0 w-full sm:w-[240px] h-[170px] sm:h-[180px] rounded-xl overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.startsWith("/") ? `${API_BASE}${image}` : image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/40 text-sm">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between sm:pl-6">
          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl uppercase italic tracking-wide text-white mb-2">
              {title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-lg">{description}</p>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {duration && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 font-medium">
                  <Clock size={12} />
                  {duration}
                </span>
              )}
              {mode && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 font-medium">
                  <Zap size={12} />
                  {mode}
                </span>
              )}
              {isTeamEvent && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 font-medium">
                  <Users size={12} />
                  Team Event
                </span>
              )}
              {tagline && (
                <span
                  className="rounded-lg px-3 py-1.5 text-[11px] font-semibold"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  {tagline}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => onEnroll(adaptedCompetition)}
              className="group/btn inline-flex items-center gap-3 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/20"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
            >
              Enroll Now
              <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={13} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
