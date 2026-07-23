import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  Shield,
  Bell,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AdminEvents from "./AdminEvents";
import AdminOffers from "./AdminOffers";
import AdminEnrollments from "./AdminEnrollments";
import AdminUpdates from "./AdminUpdates";
import AdminLogin from "./AdminLogin";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: Calendar },
  { id: "offers", label: "Offers / Ads", icon: Megaphone },
  { id: "enrollments", label: "Enrollments", icon: Users },
  { id: "updates", label: "Updates", icon: Bell },
];

export default function AdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    if (token && user) {
      setAdmin(JSON.parse(user));
    }
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
  };

  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111827] flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Shield size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Admin Panel</p>
            <p className="text-[10px] text-white/50">Zhahi Tech</p>
          </div>
        </div>

        <nav className="px-4 py-4 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={22} />
          </button>
          <h2 className="font-bold text-lg text-gray-900 capitalize">{activeTab}</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">{admin.username?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-600 font-medium hidden sm:block">{admin.username}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "events" && <AdminEvents />}
          {activeTab === "offers" && <AdminOffers />}
          {activeTab === "enrollments" && <AdminEnrollments />}
          {activeTab === "updates" && <AdminUpdates />}
        </main>
      </div>
    </div>
  );
}
