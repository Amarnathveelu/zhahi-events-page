import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  Image,
} from "lucide-react";
import { getEnrollments, verifyEnrollment } from "../../utils/api";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-gray-100 text-gray-500",
  verification_pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
};

const STATUS_LABELS = {
  paid: "Verified",
  pending: "Pending",
  verification_pending: "Awaiting Review",
  failed: "Rejected",
};

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [verifying, setVerifying] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchEnrollments = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await getEnrollments(params);
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, [filter]);

  const handleVerify = async (enrollmentId, action) => {
    setVerifying(enrollmentId);
    try {
      await verifyEnrollment(enrollmentId, action);
      fetchEnrollments();
    } catch (err) {
      alert("Failed to update.");
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
        <Filter size={16} className="text-gray-400 shrink-0" />
        {["all", "verification_pending", "paid", "pending", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f] || f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{enrollments.length} results</span>
      </div>

      {enrollments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <CheckCircle2 size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No enrollments found.</p>
        </div>
      )}

      <div className="space-y-3">
        {enrollments.map((enroll) => (
          <div key={enroll._id} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {enroll.name || enroll.teamName || "N/A"}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[enroll.paymentStatus]}`}>
                    {STATUS_LABELS[enroll.paymentStatus]}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-500">
                  <p><span className="text-gray-300">Event:</span> {enroll.competitionTitle}</p>
                  <p><span className="text-gray-300">Phone:</span> {enroll.phone}</p>
                  <p><span className="text-gray-300">Email:</span> {enroll.email}</p>
                  <p><span className="text-gray-300">College:</span> {enroll.collegeName}</p>
                  <p><span className="text-gray-300">Year:</span> {enroll.year}</p>
                  <p><span className="text-gray-300">Fee:</span> ₹{enroll.fee}</p>
                  {enroll.language && <p><span className="text-gray-300">Language:</span> {enroll.language}</p>}
                  {enroll.teamMembers?.length > 0 && (
                    <p><span className="text-gray-300">Team:</span> {enroll.teamMembers.map((m) => m.name).join(", ")}</p>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">ID: {enroll._id}</p>
              </div>

              {/* Screenshot & actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                {enroll.paymentScreenshot && (
                  <button
                    onClick={() => setPreviewImage(enroll.paymentScreenshot)}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Image size={14} />
                    View Screenshot
                  </button>
                )}

                {enroll.paymentStatus === "verification_pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerify(enroll._id, "approve")}
                      disabled={verifying === enroll._id}
                      className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {verifying === enroll._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(enroll._id, "reject")}
                      disabled={verifying === enroll._id}
                      className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900">Payment Screenshot</h4>
              <button onClick={() => setPreviewImage(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-4">
              <img src={previewImage} alt="Payment Screenshot" className="w-full max-h-[50vh] object-contain rounded-xl" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
