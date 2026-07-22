import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import {
  X,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  GraduationCap,
  QrCode,
  Upload,
  Sparkles,
  Camera,
  ArrowRight,
  Clock,
} from "lucide-react";
import BlobIcon from "./BlobIcon";
import { createEnrollment, uploadScreenshot } from "../utils/api";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "PG"];
const API_BASE = import.meta.env.VITE_API_URL || "https://zhahi-events-page.onrender.com";

export default function EnrollModal({ competition, onClose }) {
  const [step, setStep] = useState("form"); // form | qr | screenshot | processing | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [enrollment, setEnrollment] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamName: "",
      teamMembers: competition.isTeamEvent ? [{ name: "" }] : [],
      language: competition.languageChoice?.[0] || undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "teamMembers" });

  if (!competition) return null;

  const onFormSubmit = async (data) => {
    setStep("processing");
    setErrorMsg("");
    try {
      const enrollPayload = {
        competitionId: competition.id,
        competitionTitle: competition.title,
        fee: competition.fee,
        ...data,
      };
      const { data: enrollment } = await createEnrollment(enrollPayload);
      setEnrollment(enrollment);
      setStep("qr");
    } catch (err) {
      setStep("form");
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = async () => {
    if (!screenshotFile || !enrollment) return;
    setStep("processing");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("screenshot", screenshotFile);
      await uploadScreenshot(enrollment._id, formData);
      setStep("success");
    } catch (err) {
      setStep("screenshot");
      setErrorMsg(err?.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md px-0 sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white text-gray-900 w-full sm:max-w-[540px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        >
          {/* Top accent bar */}
          <div
            className="h-1.5 w-full rounded-t-3xl sm:rounded-t-3xl"
            style={{ background: `linear-gradient(90deg, ${competition.accent}, ${competition.accent}88)` }}
          />

          <button
            onClick={onClose}
            className="absolute top-6 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <X size={16} className="text-gray-500" />
          </button>

          <div className="p-7 sm:p-8">
            {/* STEP: Form */}
            {step === "form" && (
              <FormStep
                competition={competition}
                errors={errors}
                register={register}
                control={control}
                fields={fields}
                append={append}
                remove={remove}
                onSubmit={handleSubmit(onFormSubmit)}
                errorMsg={errorMsg}
              />
            )}

            {/* STEP: QR Code Payment */}
            {step === "qr" && (
              <QRStep
                competition={competition}
                enrollment={enrollment}
                onContinue={() => setStep("screenshot")}
                onBack={() => setStep("form")}
              />
            )}

            {/* STEP: Screenshot Upload */}
            {step === "screenshot" && (
              <ScreenshotStep
                competition={competition}
                enrollment={enrollment}
                screenshotPreview={screenshotPreview}
                onFileChange={handleScreenshotChange}
                onUpload={handleScreenshotUpload}
                onBack={() => setStep("qr")}
                errorMsg={errorMsg}
              />
            )}

            {/* STEP: Processing */}
            {step === "processing" && (
              <div className="text-center py-12">
                <Loader2 size={40} className="animate-spin text-indigo-500 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">Processing...</p>
              </div>
            )}

            {/* STEP: Success */}
            {step === "success" && (
              <SuccessStep competition={competition} onClose={onClose} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormStep({ competition, errors, register, fields, append, remove, onSubmit, errorMsg }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${competition.accent}15` }}
        >
          <BlobIcon icon={competition.icon} accent={competition.accent} size={48} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{competition.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{competition.tagline}</p>
        </div>
      </div>

      {competition.hasThemeReveal && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 mb-5">
          <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">{competition.themeRevealNote}</p>
        </div>
      )}
      {competition.extraNote && (
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200/60 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-blue-600 leading-relaxed">{competition.extraNote}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {competition.isTeamEvent ? (
          <>
            <Field label="Team Name" error={errors.teamName} icon={<Sparkles size={15} />}>
              <input
                {...register("teamName", { required: "Team name is required" })}
                className={inputCls(errors.teamName)}
                placeholder="e.g. Byte Bandits"
              />
            </Field>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  Team Members (up to {competition.maxTeamSize})
                </label>
                {fields.length < competition.maxTeamSize && (
                  <button
                    type="button"
                    onClick={() => append({ name: "" })}
                    className="text-xs font-semibold text-indigo-600 inline-flex items-center gap-1 hover:text-indigo-700 transition-colors"
                  >
                    <Plus size={14} /> Add member
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs font-medium">
                        {idx + 1}.
                      </span>
                      <input
                        {...register(`teamMembers.${idx}.name`, {
                          required: idx === 0 ? "At least one member is required" : false,
                        })}
                        className={`${inputCls(errors.teamMembers?.[idx]?.name)} pl-8`}
                        placeholder={`Member ${idx + 1} name`}
                      />
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="w-9 h-9 shrink-0 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Field label="Full Name" error={errors.name} icon={<User size={15} />}>
            <input
              {...register("name", { required: "Name is required" })}
              className={inputCls(errors.name)}
              placeholder="Your full name"
            />
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number" error={errors.phone} icon={<Phone size={15} />}>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" },
              })}
              className={inputCls(errors.phone)}
              placeholder="10-digit number"
              inputMode="numeric"
              maxLength={10}
            />
          </Field>
          <Field label="Email" error={errors.email} icon={<Mail size={15} />}>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className={inputCls(errors.email)}
              placeholder="you@example.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="College Name" error={errors.collegeName} icon={<GraduationCap size={15} />}>
            <input
              {...register("collegeName", { required: "Required" })}
              className={inputCls(errors.collegeName)}
              placeholder="Your college"
            />
          </Field>
          <Field label="Year" error={errors.year} icon={<GraduationCap size={15} />}>
            <select
              {...register("year", { required: "Required" })}
              className={inputCls(errors.year)}
              defaultValue=""
            >
              <option value="" disabled>Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </Field>
        </div>

        {competition.languageChoice?.length > 0 && (
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">Choose Language</label>
            <div className="flex gap-3">
              {competition.languageChoice.map((lang) => (
                <label
                  key={lang}
                  className="flex-1 cursor-pointer border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-center font-semibold text-gray-500 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 transition-all"
                >
                  <input type="radio" value={lang} {...register("language")} className="sr-only" />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/80 border border-gray-200/60 px-5 py-4">
          <span className="text-sm text-gray-500 font-medium">Registration Fee</span>
          <span className="font-bold text-xl text-gray-900">₹{competition.fee}</span>
        </div>

        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {errorMsg}
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20"
        >
          <ArrowRight size={16} />
          Continue to Payment
        </button>
      </form>
    </>
  );
}

function QRStep({ competition, enrollment, onContinue, onBack }) {
  const qrUrl = competition.qrCode
    ? `${API_BASE}${competition.qrCode}`
    : null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
        <QrCode size={28} className="text-indigo-500" />
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-2">Scan & Pay</h3>
      <p className="text-sm text-gray-500 mb-6">
        Scan the QR code below and pay <strong>₹{competition.fee}</strong>
      </p>

      {qrUrl ? (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 inline-block mb-6">
          <img src={qrUrl} alt="Payment QR Code" className="w-56 h-56 object-contain rounded-xl" />
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 inline-block mb-6">
          <QrCode size={48} className="text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">QR code not available yet</p>
          <p className="text-xs text-gray-400">Contact admin for payment details</p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 mb-6 text-left">
        <p className="text-xs text-amber-700 leading-relaxed flex items-start gap-2">
          <Clock size={14} className="mt-0.5 shrink-0" />
          After payment, take a screenshot and click below to upload it for verification.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm px-5 py-3.5 rounded-xl hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Upload size={16} />
          Upload Screenshot
        </button>
      </div>
    </motion.div>
  );
}

function ScreenshotStep({ competition, enrollment, screenshotPreview, onFileChange, onUpload, onBack, errorMsg }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
        <Camera size={28} className="text-green-500" />
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-2 text-center">Upload Payment Proof</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Upload a screenshot of your payment of <strong>₹{competition.fee}</strong>
      </p>

      <div className="space-y-4">
        {/* File input */}
        <label className="block cursor-pointer">
          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            screenshotPreview
              ? "border-green-300 bg-green-50/50"
              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}>
            {screenshotPreview ? (
              <div className="space-y-3">
                <img src={screenshotPreview} alt="Screenshot preview" className="w-40 h-40 object-contain mx-auto rounded-xl border border-gray-200" />
                <p className="text-xs text-green-600 font-medium">Screenshot selected</p>
                <p className="text-xs text-gray-400">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={32} className="text-gray-300 mx-auto" />
                <p className="text-sm font-medium text-gray-600">Click to upload screenshot</p>
                <p className="text-xs text-gray-400">JPEG, PNG or WebP (max 5MB)</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onFileChange}
            className="sr-only"
          />
        </label>

        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {errorMsg}
          </motion.div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm px-5 py-3.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={onUpload}
            disabled={!screenshotPreview}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={16} />
            Submit & Verify
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessStep({ competition, onClose }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
        <div className="relative w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-2">Enrollment Submitted!</h3>
      <p className="text-sm text-gray-500 mb-1">
        Your registration for <strong>{competition.title}</strong> is submitted.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 mt-4 text-left">
        <p className="text-xs text-amber-700 leading-relaxed">
          Your payment screenshot is under verification. You will receive a confirmation once the admin verifies your payment.
        </p>
      </div>
      <button
        onClick={onClose}
        className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-10 py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/20"
      >
        Done
      </button>
    </motion.div>
  );
}

function Field({ label, error, children, icon }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5 font-medium">
          {error.message}
        </motion.p>
      )}
    </div>
  );
}

function inputCls(error) {
  return `w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400 text-[#111827] ${
    error ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100" : "border-gray-200 hover:border-gray-300"
  }`;
}
