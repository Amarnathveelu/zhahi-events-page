import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin, Zap, Users, Trophy, Award } from "lucide-react";
import heroImage from "../assets/hero.png";

function StorysetBlob({ className, color = "#6C5CE7" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        fillOpacity="0.08"
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.1,-1.1C86.2,14.1,79.8,28.2,71.2,40.1C62.6,52,51.8,61.7,39.4,68.8C27,75.9,13,80.4,-1.2,82.4C-15.3,84.4,-30.7,83.9,-43.5,77.1C-56.3,70.3,-66.5,57.2,-73.8,42.6C-81.1,28,-85.5,11.9,-83.7,-3.5C-81.9,-18.9,-73.9,-33.6,-63.5,-44.7C-53.1,-55.8,-40.3,-63.3,-27.2,-70.8C-14.1,-78.3,-0.7,-85.8,12.4,-84.5C25.5,-83.2,30.6,-83.6,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

function FloatingShape({ className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden min-h-[92vh] flex items-center">
      {/* Storyset-style background blobs */}
      <StorysetBlob className="absolute -top-20 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-60" color="#6C5CE7" />
      <StorysetBlob className="absolute -bottom-32 -right-32 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] opacity-40" color="#A29BFE" />
      <StorysetBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] opacity-20" color="#DFE6E9" />

      {/* Floating decorative elements */}
      <FloatingShape className="absolute top-32 left-[15%] w-3 h-3 rounded-full bg-indigo-400/30" delay={0} />
      <FloatingShape className="absolute top-48 right-[20%] w-2 h-2 rounded-full bg-purple-400/40" delay={1} />
      <FloatingShape className="absolute bottom-32 left-[25%] w-4 h-4 rounded-full bg-indigo-300/20" delay={2} />
      <FloatingShape className="absolute top-60 left-[8%] w-6 h-6 rounded-lg bg-indigo-400/10 rotate-45" delay={1.5} />
      <FloatingShape className="absolute bottom-48 right-[12%] w-5 h-5 rounded-full bg-purple-300/20" delay={0.5} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle, #6C5CE7 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 w-full">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-4 sm:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold text-red-400 tracking-wide uppercase">Upcoming Events — Register Now</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[3.6rem] leading-tight lg:leading-[1.08] mb-4 sm:mb-5 uppercase text-white">
            Live Tech{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Competitions
            </span>{" "}
            & Workshops
          </h1>

          {/* Description — event-focused */}
          <p className="text-white/60 text-sm max-w-md mb-5 sm:mb-8 leading-relaxed font-body">
            Join hands-on coding battles, design challenges & skill workshops conducted by industry experts.
            Build real projects, compete with peers, and earn certificates — all at an affordable fee.
          </p>

          {/* Event details card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Next Event</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40">Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-white">Aug 2, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40">Time</p>
                  <p className="text-xs sm:text-sm font-semibold text-white">10:00 AM – 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <MapPin size={14} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40">Venue</p>
                  <p className="text-xs sm:text-sm font-semibold text-white">Zhahi Tech Training, Theni</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#events"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-body font-semibold text-sm px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/25"
            >
              Register Now
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={14} />
              </span>
            </a>
            <a
              href="#events"
              className="inline-flex items-center gap-2.5 border border-white/20 text-white/80 font-body font-medium text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
            >
              View All Events
            </a>
          </div>

          {/* Why attend — quick reasons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Trophy size={13} className="text-indigo-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-white/50 font-medium">Win Prizes</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Zap size={13} className="text-purple-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-white/50 font-medium">Real Projects</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Users size={13} className="text-green-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-white/50 font-medium">Network & Learn</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Hero image with storyset-style frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Decorative frame behind image */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl" />
          <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-16 sm:w-24 h-16 sm:h-24 border-2 border-indigo-400/20 rounded-xl sm:rounded-2xl rotate-12" />
          <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-14 sm:w-20 h-14 sm:h-20 border-2 border-purple-400/20 rounded-xl sm:rounded-2xl -rotate-12" />

          <div className="relative bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 shadow-2xl overflow-hidden border border-white/10">
            <img
              src={heroImage}
              alt="Live Tech Competition"
              className="w-full h-auto rounded-[1rem] sm:rounded-[1.5rem] object-cover"
            />
            <div className="absolute inset-3 sm:inset-4 rounded-[1rem] sm:rounded-[1.5rem] bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Award size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Win Prizes & Certificates</p>
              <p className="text-[10px] text-gray-400">For All Attendees</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
