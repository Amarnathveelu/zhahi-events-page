import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X, Upload, Save, Loader2, Megaphone } from "lucide-react";
import { getOffers, createOffer, updateOffer, deleteOffer, toggleOfferActive } from "../../utils/api";

const EMPTY_OFFER = {
  title: "",
  description: "",
  link: "",
  discount: "",
  sortOrder: 0,
};

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_OFFER });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);

  const fetchOffers = async () => {
    try {
      const { data } = await getOffers();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const openForm = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        link: offer.link || "",
        discount: offer.discount || "",
        sortOrder: offer.sortOrder || 0,
      });
      setImagePreview(offer.image || null);
    } else {
      setEditingOffer(null);
      setForm({ ...EMPTY_OFFER });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, String(val)));
      if (imageFile) fd.append("image", imageFile);

      if (editingOffer) {
        await updateOffer(editingOffer._id, fd);
      } else {
        await createOffer(fd);
      }
      setShowForm(false);
      fetchOffers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save offer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      fetchOffers();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleOfferActive(id);
      fetchOffers();
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
        <p className="text-sm text-gray-500">{offers.length} offers total</p>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus size={16} />
          New Offer / Ad
        </button>
      </div>

      <div className="space-y-3">
        {offers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Megaphone size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No offers yet. Create one to show mini ads on the site.</p>
          </div>
        )}
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {offer.image ? (
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Megaphone size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">{offer.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${offer.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {offer.isActive ? "Visible" : "Hidden"}
                </span>
                {offer.discount && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {offer.discount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{offer.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggle(offer._id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${offer.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
              >
                {offer.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => openForm(offer)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(offer._id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <OfferForm
          form={form}
          setForm={setForm}
          editingOffer={editingOffer}
          saving={saving}
          imagePreview={imagePreview}
          imageRef={imageRef}
          onImageChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function OfferForm({ form, setForm, editingOffer, saving, imagePreview, imageRef, onImageChange, onSave, onClose }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="font-bold text-lg text-gray-900">{editingOffer ? "Edit Offer" : "New Offer / Ad"}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. 30% Off on MERN Stack"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              placeholder="Offer description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Discount Tag</label>
              <input
                type="text"
                value={form.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. 30% OFF"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Link (optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Image</label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div className="py-6">
                    <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Click to upload</p>
                  </div>
                )}
              </div>
              <input ref={imageRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) onImageChange(e.target.files[0]); }} />
            </label>
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
              disabled={saving || !form.title || !form.description}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingOffer ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
