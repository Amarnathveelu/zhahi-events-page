import { Mail, Phone, MapPin, ExternalLink, Heart, Shield } from "lucide-react";
import logo from "../assets/logo.png";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Courses", href: "#events" },
  { label: "Contact Us", href: "#contact" },
];

const COURSES = [
  "MERN Stack Development",
  "AI & Machine Learning",
  "Digital Marketing",
  "UI/UX Design",
  "Software Testing",
];

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#111827] overflow-hidden">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-12 text-[#1a1f35]">
          <path d="M0,0 L1440,0 L1440,20 Q1080,60 720,30 Q360,0 0,40 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Zhahi Tech Logo"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
              />
              <div>
                <p className="font-body font-bold text-white text-[15px]">ZHAHI TECH</p>
                <p className="text-[9px] text-white/50 font-medium tracking-widest uppercase">Training Institute</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Unlock your tech potential by mastering today's skills at Zhahi Tech Training.
            </p>
            <div className="flex items-center gap-3">
              {["Instagram", "LinkedIn", "YouTube"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-indigo-600 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  title={name}
                >
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/50 hover:text-indigo-400 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-bold text-white text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Courses
            </h4>
            <ul className="space-y-3">
              {COURSES.map((c) => (
                <li key={c}>
                  <a
                    href="#events"
                    className="text-sm text-white/50 hover:text-indigo-400 transition-colors"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Connect With Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/50 leading-relaxed">
                  Zhahi Tech Training, Bungalowmedu, Theni, Tamil Nadu 625531
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-indigo-400 shrink-0" />
                <a href="tel:+918122811818" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">
                  +91 81228 11818
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-400 shrink-0" />
                <a href="mailto:info@zhahi.in" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">
                  info@zhahi.in
                </a>
              </li>
              <li className="text-xs text-white/40 mt-2">
                Business Hours: 9:30 AM to 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Zhahi Tech Training. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/40">
            Made with <Heart size={10} className="text-red-400 mx-0.5" fill="currentColor" /> in Theni
            <span className="mx-2">•</span>
            <a href="/admin" className="hover:text-white/40 transition-colors inline-flex items-center gap-1">
              <Shield size={10} /> Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
