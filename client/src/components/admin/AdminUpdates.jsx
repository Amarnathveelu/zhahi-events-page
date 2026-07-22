import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, Loader2, Send } from "lucide-react";
import { getUpdates, createUpdate, deleteUpdate } from "../../utils/api";

export default function AdminUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", message: "", type: "general" });
  const [submitting, setSubmitting] = useState(false);

  const fetchUpdates = async () => {
    try {
      const { data } = await getUpdates();
      setUpdates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await createUpdate(form);
      setForm({ title: "", message: "", type: "general" });
      fetchUpdates();
    } catch (err) {
      alert("Failed to post update.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this update?")) return;
    try {
      await deleteUpdate(id);
      fetchUpdates();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const typeLabels = { general: "General", event: "Event", payment: "Payment" };
  const typeColors = {
    general: "bg-indigo-100 text-indigo-700",
    event: "bg-green-100 text-green-700",
    payment: "bg-amber-100 text-amber-700",
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
      {/* Post form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
          <Send size={16} className="text-indigo-500" />
          Post an Update
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-[#111827]"
              placeholder="Update title"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-[#111827]"
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="payment">Payment</option>
            </select>
          </div>
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none text-[#111827]"
            placeholder="Write your update message..."
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Post Update
          </button>
        </form>
      </div>

      {/* Updates list */}
      {updates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Bell size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No updates posted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <motion.div
              key={update._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-gray-900">{update.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[update.type]}`}>
                      {typeLabels[update.type]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{update.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(update.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(update._id)}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-3 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
