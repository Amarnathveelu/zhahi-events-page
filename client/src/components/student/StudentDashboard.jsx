import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut, Clock, CheckCircle2, XCircle, AlertCircle, Bell, CreditCard, User
} from "lucide-react";
import { getStudentProfile, getStudentEnrollments, getStudentUpdates } from "../../utils/api";

const STATUS_CONFIG = {
  paid: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Verified" },
  pending: { color: "bg-gray-100 text-gray-500 border-gray-200", icon: Clock, label: "Pending" },
  verification_pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle, label: "Under Review" },
  failed: { color: "bg-red-100 text-red-600 border-red-200", icon: XCircle, label: "Rejected" },
};

export default function StudentDashboard({ student, onLogout }) {
  const [activeTab, setActiveTab] = useState("enrollments");
  const [enrollments, setEnrollments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, updatesRes] = await Promise.all([
          getStudentEnrollments(),
          getStudentUpdates(),
        ]);
        setEnrollments(enrollRes.data);
        setUpdates(updatesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "enrollments", label: "My Enrollments", icon: CreditCard },
    { id: "updates", label: "Updates", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#111827] text-white px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <User size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-sm">{student.name}</p>
              <p className="text-[10px] text-white/50">{student.studentId || student.email}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-white/5">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-4xl mx-auto flex gap-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              <tab.icon size={16} />
              {tab.label}
              {tab.id === "updates" && updates.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {updates.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-4">Loading...</p>
          </div>
        ) : activeTab === "enrollments" ? (
          <EnrollmentsTab enrollments={enrollments} />
        ) : (
          <UpdatesTab updates={updates} />
        )}
      </div>
    </div>
  );
}

function EnrollmentsTab({ enrollments }) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <CreditCard size={40} className="text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No enrollments yet.</p>
        <p className="text-xs text-gray-300 mt-1">Enroll in an event to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enroll) => {
        const config = STATUS_CONFIG[enroll.paymentStatus] || STATUS_CONFIG.pending;
        const StatusIcon = config.icon;
        return (
          <motion.div
            key={enroll._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{enroll.competitionTitle}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Enrolled on {new Date(enroll.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${config.color}`}>
                <StatusIcon size={12} />
                {config.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Fee</p>
                <p className="font-bold text-gray-900">₹{enroll.fee}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Payment</p>
                <p className="font-bold text-gray-900 capitalize">{enroll.paymentStatus.replace("_", " ")}</p>
              </div>
              {enroll.paymentScreenshot && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 mb-0.5">Screenshot</p>
                  <p className="font-bold text-green-600">Uploaded</p>
                </div>
              )}
            </div>

            {enroll.paymentStatus === "pending" && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mt-3">
                Please scan the QR code and upload your payment screenshot to proceed.
              </p>
            )}
            {enroll.paymentStatus === "verification_pending" && (
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mt-3">
                Your payment is being reviewed by our team. We'll update you soon.
              </p>
            )}
            {enroll.paymentStatus === "paid" && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mt-3">
                Your payment has been verified! You're all set.
              </p>
            )}
            {enroll.paymentStatus === "failed" && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mt-3">
                Your payment was not verified. Please contact support or try again.
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function UpdatesTab({ updates }) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <Bell size={40} className="text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No updates yet.</p>
      </div>
    );
  }

  const typeColors = {
    general: "border-l-indigo-500 bg-indigo-50/50",
    event: "border-l-green-500 bg-green-50/50",
    payment: "border-l-amber-500 bg-amber-50/50",
  };

  return (
    <div className="space-y-3">
      {updates.map((update) => (
        <motion.div
          key={update._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl border border-gray-200 border-l-4 p-5 ${typeColors[update.type] || typeColors.general}`}
        >
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm text-gray-900">{update.title}</h3>
            <span className="text-[10px] text-gray-400 shrink-0 ml-2">{new Date(update.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{update.message}</p>
        </motion.div>
      ))}
    </div>
  );
}
