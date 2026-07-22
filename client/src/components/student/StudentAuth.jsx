import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Building2, GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { studentLogin, studentRegister } from "../../utils/api";

export default function StudentAuth({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    collegeName: "",
    year: "",
  });

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await studentLogin({ email: form.email, password: form.password });
      } else {
        res = await studentRegister(form);
      }
      localStorage.setItem("student_token", res.data.token);
      localStorage.setItem("student_user", JSON.stringify(res.data.student));
      onLogin(res.data.student);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-10 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-[#111827] placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1f35] to-[#1e2440] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle, #6C5CE7 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to home
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} className="text-indigo-500" />
            </div>
            <h1 className="font-bold text-2xl text-gray-900">{isLogin ? "Student Login" : "Create Account"}</h1>
            <p className="text-sm text-gray-400 mt-1">{isLogin ? "Track your enrollments" : "Join Zhahi Tech Training"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" /> Full Name
                  </label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                    className={inputClass} placeholder="Enter your name" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" /> Phone
                  </label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className={inputClass} placeholder="10-digit mobile number" required />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-gray-400" /> Email
              </label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className={inputClass} placeholder="Enter your email" required />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-gray-400" /> Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)}
                  className={inputClass} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-400" /> College Name
                  </label>
                  <input type="text" value={form.collegeName} onChange={(e) => update("collegeName", e.target.value)}
                    className={inputClass} placeholder="Enter college name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-gray-400" /> Year
                  </label>
                  <select value={form.year} onChange={(e) => update("year", e.target.value)}
                    className={inputClass}>
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Passed Out">Passed Out</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60">
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-indigo-600 font-semibold hover:underline">
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
