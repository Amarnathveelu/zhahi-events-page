import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Shield, GraduationCap } from "lucide-react";
import logo from "../assets/logo.jpg";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Events", href: "#events" },
  { label: "Contact Us", href: "#contact" },
];

function scrollToSection(href) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToSection(href), 100);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1a1f35]/95 backdrop-blur-xl shadow-lg shadow-black/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Zhahi Tech Logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-indigo-400/30 transition-all"
          />
          <div className="flex flex-col">
            <span className="font-body font-bold text-[15px] tracking-wide text-white leading-tight">
              ZHAHI TECH
            </span>
            <span className="text-[9px] text-white/50 font-medium tracking-widest uppercase">
              Training Institute
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-body text-[14px]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className="text-white/70 hover:text-white font-medium transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 rounded-full group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href="tel:+918122811818"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Phone size={14} />
            Contact
          </a>
          <a
            href="/student"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            title="Student Login"
          >
            <GraduationCap size={16} />
          </a>
          <a
            href="/admin"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            title="Admin Panel"
          >
            <Shield size={16} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#1a1f35]/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="py-3 border-b border-white/5 text-white/70 hover:text-white font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="tel:+918122811818"
                onClick={() => setOpen(false)}
                className="mt-4 text-center text-sm font-semibold px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20"
              >
                <Phone size={14} className="inline mr-2" />
                Contact Us
              </a>
              <a
                href="/student"
                onClick={() => setOpen(false)}
                className="text-center text-xs text-white/50 hover:text-white/70 py-2 transition-colors"
              >
                Student Portal
              </a>
              <a
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-center text-xs text-white/50 hover:text-white/70 py-2 transition-colors"
              >
                Admin Panel
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
