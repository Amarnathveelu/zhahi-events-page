import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff, X, Upload, QrCode, Save, Loader2 } from "lucide-react";
import { getEvents, createEvent, updateEvent, deleteEvent, toggleEventActive } from "../../utils/api";

const ACCENT_COLORS = ["#6C5CE7", "#A29BFE", "#FF6B6B", "#4FD1C5", "#F6C453", "#FF8A65", "#B892FF", "#6C8CFF"];

const EMPTY_EVENT = {
  title: "",
  description: "",
  tagline: "",
  fee: "",
  duration: "1 Day",
  mode: "Live",
  isTeamEvent: false,
  maxTeamSize: 1,
  languageChoice: "",
  hasThemeReveal: false,
  themeRevealNote: "",
  extraNote: "",
  accent: "#6C5CE7",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_EVENT });
  const [imageFile, setImageFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const imageRef = useRef(null);
  const qrRef = useRef(null);

  const fetchEvents = async () => {
    try {
      const { data } = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openForm = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setForm({
        title: event.title || "",
        description: event.description || "",
        tagline: event.tagline || "",
        fee: event.fee || "",
        duration: event.duration || "1 Day",
        mode: event.mode || "Live",
        isTeamEvent: event.isTeamEvent || false,
        maxTeamSize: event.maxTeamSize || 1,
        languageChoice: Array.isArray(event.languageChoice) ? event.languageChoice.join(", ") : "",
        hasThemeReveal: event.hasThemeReveal || false,
        themeRevealNote: event.themeRevealNote || "",
        extraNote: event.extraNote || "",
        accent: event.accent || "#6C5CE7",
      });
      setImagePreview(event.image ? `http://localhost:5000${event.image}` : null);
      setQrPreview(event.qrCode ? `http://localhost:5000${event.qrCode}` : null);
    } else {
      setEditingEvent(null);
      setForm({ ...EMPTY_EVENT });
      setImagePreview(null);
      setQrPreview(null);
    }
    setImageFile(null);
    setQrFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "languageChoice") {
          fd.append(key, JSON.stringify(val.split(",").map((s) => s.trim()).filter(Boolean)));
        } else {
          fd.append(key, String(val));
        }
      });
      if (imageFile) fd.append("image", imageFile);
      if (qrFile) fd.append("qrCode", qrFile);

      if (editingEvent) {
        await updateEvent(editingEvent._id, fd);
      } else {
        await createEvent(fd);
      }
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleEventActive(id);
      fetchEvents();
    } catch (err) {
      alert("Failed to toggle.");
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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{events.length} events total</p>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {event.image ? (
                <img src={`http://localhost:5000${event.image}`} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: event.accent }} />
                <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${event.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {event.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1">{event.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500 font-medium">₹{event.fee}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-500">{event.duration}</span>
                {event.qrCode && (
                  <>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-green-600 flex items-center gap-1"><QrCode size={10} /> QR</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggle(event._id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${event.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                title={event.isActive ? "Deactivate" : "Activate"}
              >
                {event.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => openForm(event)}
                className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <EventForm
          form={form}
          setForm={setForm}
          editingEvent={editingEvent}
          saving={saving}
          imagePreview={imagePreview}
          qrPreview={qrPreview}
          imageRef={imageRef}
          qrRef={qrRef}
          onImageChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
          onQrChange={(file) => { setQrFile(file); setQrPreview(URL.createObjectURL(file)); }}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function EventForm({ form, setForm, editingEvent, saving, imagePreview, qrPreview, imageRef, qrRef, onImageChange, onQrChange, onSave, onClose }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="font-bold text-lg text-gray-900">{editingEvent ? "Edit Event" : "New Event"}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Web Designing"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                placeholder="Event description..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. One Day Challenge"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Fee (₹) *</label>
              <input
                type="number"
                value={form.fee}
                onChange={(e) => handleChange("fee", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="199"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="1 Day"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Mode</label>
              <select
                value={form.mode}
                onChange={(e) => handleChange("mode", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Live">Live</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Accent Color</label>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleChange("accent", c)}
                    className={`w-8 h-8 rounded-lg transition-all ${form.accent === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Language Choice (comma-separated)</label>
              <input
                type="text"
                value={form.languageChoice}
                onChange={(e) => handleChange("languageChoice", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Python, Java"
              />
            </div>

            <div className="sm:col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isTeamEvent}
                  onChange={(e) => handleChange("isTeamEvent", e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-sm font-semibold text-gray-700">Team Event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.hasThemeReveal}
                  onChange={(e) => handleChange("hasThemeReveal", e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-sm font-semibold text-gray-700">Theme Reveal</span>
              </label>
            </div>

            {form.isTeamEvent && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Max Team Size</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={form.maxTeamSize}
                  onChange={(e) => handleChange("maxTeamSize", e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}

            {form.hasThemeReveal && (
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Theme Reveal Note</label>
                <input
                  type="text"
                  value={form.themeRevealNote}
                  onChange={(e) => handleChange("themeRevealNote", e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Theme is released 3 days before..."
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Extra Note</label>
              <input
                type="text"
                value={form.extraNote}
                onChange={(e) => handleChange("extraNote", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Additional info..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Event Image</label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="py-4">
                      <Upload size={20} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Click to upload</p>
                    </div>
                  )}
                </div>
                <input ref={imageRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) onImageChange(e.target.files[0]); }} />
              </label>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Payment QR Code</label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors">
                  {qrPreview ? (
                    <img src={qrPreview} alt="QR Preview" className="w-full h-24 object-contain rounded-lg" />
                  ) : (
                    <div className="py-4">
                      <QrCode size={20} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Click to upload QR</p>
                    </div>
                  )}
                </div>
                <input ref={qrRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) onQrChange(e.target.files[0]); }} />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !form.title || !form.description || !form.fee}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingEvent ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
