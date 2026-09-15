import React, { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Sparkles,
  Check,
  FileBadge,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useUser, getInitials } from "../context/UserContext";
import { useToast } from "./ui";

const GRADIENT_OPTIONS = [
  { id: "electric-blue", label: "Electric Blue", class: "from-blue-600 via-blue-500 to-cyan-400" },
  { id: "deep-navy", label: "Deep Navy", class: "from-blue-950 via-blue-800 to-blue-600" },
  { id: "emerald-mint", label: "Emerald Mint", class: "from-emerald-600 via-teal-500 to-cyan-400" },
  { id: "royal-indigo", label: "Royal Indigo", class: "from-indigo-700 via-blue-600 to-cyan-400" },
  { id: "ocean-breeze", label: "Ocean Breeze", class: "from-cyan-500 via-blue-500 to-blue-700" },
];

export default function ProfileModal() {
  const { user, updateProfile, isProfileOpen, closeProfile } = useUser();
  const push = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(user);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (isProfileOpen) {
      setFormData(user);
    }
  }, [isProfileOpen, user]);

  if (!isProfileOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      push("Please select an image file (PNG, JPG, or WEBP)", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      push("Image size should be under 5MB", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setFormData((prev) => ({ ...prev, avatarUrl: base64Url }));
        push("Profile photo selected! Save changes to apply across the app.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    push("Custom photo removed. Initials will be used as avatar.", "info");
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!formData.name?.trim()) {
      push("Name cannot be empty", "warning");
      return;
    }
    updateProfile(formData);
    push("Profile updated successfully! Avatar applied.", "success");
    closeProfile();
  };

  const previewInitials = getInitials(formData.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
      onClick={closeProfile}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-[#0C1322] border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Input for PC upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Header with deep blue Finzo banner */}
        <div className="relative bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 px-6 py-6 text-white border-b border-blue-700/50">
          <button
            onClick={closeProfile}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative group">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name || "User Avatar"}
                  className="h-16 w-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/50 border-2 border-white/20"
                />
              ) : (
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${formData.gradient || "from-blue-600 to-cyan-400"} text-xl font-bold text-white shadow-lg ring-2 ring-white/30`}
                >
                  {previewInitials}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("avatar");
                  fileInputRef.current?.click();
                }}
                title="Upload photo from PC"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md border-2 border-white dark:border-slate-900 hover:bg-blue-500 transition-transform hover:scale-110 cursor-pointer"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {formData.name || "Your Name"}
                </h3>
                <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white border border-white/30">
                  {formData.role || "Owner"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-blue-100">{formData.email || "email@domain.com"}</p>
              <p className="text-xs text-blue-200 font-medium mt-0.5">{formData.businessName}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "personal"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <User size={15} />
            Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("business")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "business"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Building size={15} />
            Business Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("avatar")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "avatar"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Camera size={15} />
            Profile Photo & Theme
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="max-h-[52vh] overflow-y-auto px-6 py-5 space-y-4">
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <User size={14} className="text-blue-600 dark:text-blue-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Phone size={14} className="text-blue-600 dark:text-blue-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Briefcase size={14} className="text-blue-600 dark:text-blue-400" />
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      value={formData.role || ""}
                      onChange={(e) => handleChange("role", e.target.value)}
                      placeholder="e.g. Founder & CFO"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Building size={14} className="text-blue-600 dark:text-blue-400" />
                    Business / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName || ""}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    placeholder="e.g. Riya Handloom Exports"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <FileBadge size={14} className="text-blue-600 dark:text-blue-400" />
                    GSTIN / Tax Identification Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstin || ""}
                    onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
                    placeholder="27AABCR1234F1Z5"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 font-mono px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white uppercase transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                    Registered Business Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra, India"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {activeTab === "avatar" && (
              <div className="space-y-5">
                {/* Custom Photo Upload from PC Section */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4.5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Camera size={14} className="text-blue-600 dark:text-blue-400" />
                        Custom Profile Photo
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Upload an image from your PC to use across the entire application interface.
                      </p>
                    </div>
                    {formData.avatarUrl && (
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                        Photo Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Active Preview */}
                    <div className="relative shrink-0">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar Preview"
                          className="h-20 w-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md ring-4 ring-blue-500/10"
                        />
                      ) : (
                        <div
                          className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${formData.gradient || "from-blue-600 to-cyan-400"} text-2xl font-bold text-white shadow-md ring-4 ring-slate-200 dark:ring-slate-800`}
                        >
                          {previewInitials}
                        </div>
                      )}
                    </div>

                    {/* Upload & Action Buttons */}
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
                        >
                          <Upload size={13} />
                          {formData.avatarUrl ? "Change Photo from PC" : "Upload Photo from PC"}
                        </button>

                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Supports PNG, JPG, or WEBP (Max 5MB). Automatically synchronized with Topbar and Settings.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Gradient Presets for Initials */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Or select an avatar theme preset (used when no photo is uploaded):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GRADIENT_OPTIONS.map((opt) => {
                      const isSelected = (formData.gradient || "from-blue-600 to-cyan-400") === opt.class;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleChange("gradient", opt.class)}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/60 shadow-sm ring-1 ring-blue-400/80"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${opt.class} text-xs font-bold text-white shadow-sm`}
                          >
                            {previewInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{opt.label}</p>
                          </div>
                          {isSelected && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
            <button
              type="button"
              onClick={closeProfile}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-xs font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Check size={14} />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
