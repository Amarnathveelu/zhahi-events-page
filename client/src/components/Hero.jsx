import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Award, BookOpen } from "lucide-react";
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
    <section id="home" className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[92vh] flex items-center">
      {/* Storyset-style background blobs */}
      <StorysetBlob className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-60" color="#6C5CE7" />
      <StorysetBlob className="absolute -bottom-32 -right-32 w-[600px] h-[600px] opacity-40" color="#A29BFE" />
      <StorysetBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20" color="#DFE6E9" />

      {/* Floating decorative elements */}
      <FloatingShape
        className="absolute top-32 left-[15%] w-3 h-3 rounded-full bg-indigo-400/30"
        delay={0}
      />
      <FloatingShape
        className="absolute top-48 right-[20%] w-2 h-2 rounded-full bg-purple-400/40"
        delay={1}
      />
      <FloatingShape
        className="absolute bottom-32 left-[25%] w-4 h-4 rounded-full bg-indigo-300/20"
        delay={2}
      />
      <FloatingShape
        className="absolute top-60 left-[8%] w-6 h-6 rounded-lg bg-indigo-400/10 rotate-45"
        delay={1.5}
      />
      <FloatingShape
        className="absolute bottom-48 right-[12%] w-5 h-5 rounded-full bg-purple-300/20"
        delay={0.5}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle, #6C5CE7 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/50 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Be in trend</span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.08] mb-6 uppercase text-white">
            Boost Up Your Career through{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Enlightening Education
            </span>
          </h1>

          <p className="text-white/60 text-[15px] max-w-md mb-10 leading-relaxed font-body">
            Personalize your education with diverse courses and flexible schedules to align with your goals. Boost your career by acquiring sought-after software skills.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#events"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-body font-semibold text-sm px-7 py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/25"
            >
              Get Started
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={14} />
              </span>
            </a>
            <a
              href="#events"
              className="inline-flex items-center gap-2.5 border border-white/20 text-white/80 font-body font-medium text-sm px-6 py-3.5 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <Play size={14} fill="currentColor" />
              Explore Events
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Users size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">500+</p>
                <p className="text-[11px] text-white/50 font-medium">Students Trained</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Award size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">200+</p>
                <p className="text-[11px] text-white/50 font-medium">Placed Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <BookOpen size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">50+</p>
                <p className="text-[11px] text-white/50 font-medium">Workshops</p>
              </div>
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
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl" />
          <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-indigo-400/20 rounded-2xl rotate-12" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 border-2 border-purple-400/20 rounded-2xl -rotate-12" />

          <div className="relative bg-white rounded-[2rem] p-4 shadow-2xl overflow-hidden border border-white/10">
            <img
              src={heroImage}
              alt="Tech Education"
              className="w-full h-auto rounded-[1.5rem] object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-4 rounded-[1.5rem] bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Award size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">100%</p>
              <p className="text-[10px] text-gray-400">Placement Support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
