import { motion } from "framer-motion";
import CompetitionCard from "./CompetitionCard";
import { Loader2 } from "lucide-react";

export default function Competitions({ events, loading, onEnroll }) {
  if (loading) {
    return (
      <section id="events" className="relative px-6 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f35] via-[#1e2440] to-[#111827]" />
        <div className="max-w-6xl mx-auto relative z-10 text-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-400 mx-auto" />
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events" className="relative px-6 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f35] via-[#1e2440] to-[#111827]" />
        <div className="max-w-6xl mx-auto relative z-10 text-center py-20">
          <p className="text-white/40 text-sm">No events available yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="relative px-6 py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f35] via-[#1e2440] to-[#111827]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Our Events</span>
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl uppercase tracking-normal sm:tracking-wider text-white mb-4">
            Trending Competitions
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Compete, learn, and win — join our live tech competitions designed to sharpen your skills.
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {events.map((event, i) => (
            <CompetitionCard key={event._id} competition={event} index={i} onEnroll={onEnroll} />
          ))}
        </div>
      </div>
    </section>
  );
}
