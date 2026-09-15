import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { useToast } from "../components/ui";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Edit3, Shield, LogOut, Database, Globe, Check, Sun, Moon, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, updateProfile, initials, openProfile } = useUser();
  const { logout, usersDb } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState(user);
  const [notifs, setNotifs] = useState({ invoiceDue: true, weeklySummary: true, creditAlerts: false });
  const push = useToast();

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(form);
    push(t("profileSavedMsg", "Business & profile changes saved."), "success");
  };

  const handleLogout = () => {
    logout();
    push(t("signedOutMsg", "You have been signed out."), "info");
    navigate("/login");
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    const selected = supportedLanguages.find((l) => l.code === langCode);
    push(`${t("languageChangedTo", "Language changed to")} ${selected?.nativeName || selected?.name}`, "info");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2
          className={`font-display text-xl font-bold transition-colors duration-200 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {t("settings", "Settings")}
        </h2>
        <p
          className={`text-sm font-medium transition-colors duration-200 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t(
            "settingsDesc",
            "Manage your personal profile, business information, language preferences, and notifications."
          )}
        </p>
      </div>

      {/* Appearance & Background Theme Card */}
      <Card title={t("appearanceTheme", "Appearance & Background Theme")}>
        <div className="space-y-3">
          <p
            className={`text-xs font-medium transition-colors duration-200 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t(
              "themeDescription",
              "Choose between the Deep Obsidian animated dark canvas or the crisp Finzo daylight aesthetic."
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dark Mode Option */}
            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                push("Switched to Deep Obsidian animated dark mode!", "info");
              }}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isDark
                  ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-colors duration-200 ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-amber-400"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <Moon size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-bold transition-colors duration-200 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Deep Obsidian (Black)
                  </p>
                  <p
                    className={`text-xs transition-colors duration-200 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Luminous aurora & cyber constellation
                  </p>
                </div>
              </div>
              {isDark && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Light Mode Option */}
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                push("Switched to Finzo daylight clean mode!", "info");
              }}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                !isDark
                  ? "border-blue-500 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/40 shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-colors duration-200 ${
                    !isDark
                      ? "bg-amber-100/70 border-amber-200 text-amber-600"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <Sun size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-bold transition-colors duration-200 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Finzo Clean (Daylight)
                  </p>
                  <p
                    className={`text-xs transition-colors duration-200 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Crisp off-white canvas & soft glow
                  </p>
                </div>
              </div>
              {!isDark && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Language Preferences Card */}
      <Card title={t("languageSettings", "Language & Regional Settings")}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Globe size={15} className="text-blue-600 dark:text-blue-400" />
            <span>{t("languageDescription", "Choose your preferred language. All financial analytics, navigation, and invoice tools will immediately update.")}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold shadow-sm ring-1 ring-blue-400"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <div>
                      <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{lang.nativeName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{lang.name}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* User Profile Card */}
      <Card title={t("userProfile", "User profile")}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-14 w-14 rounded-2xl object-cover shadow-md ring-2 ring-blue-500/20 border-2 border-white dark:border-slate-800"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={openProfile}
                title="Change profile photo"
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm border border-white dark:border-slate-900 hover:bg-blue-500 transition-transform hover:scale-110 cursor-pointer"
              >
                <Camera size={11} />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">{user.name}</h4>
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.businessName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openProfile}
            className="focus-ring flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm cursor-pointer"
          >
            <Edit3 size={14} className="text-blue-600 dark:text-blue-400" />
            {t("editProfileDetails", "Edit profile details")}
          </button>
        </div>
      </Card>

      {/* Business Profile Card */}
      <Card title={t("businessAccountDetails", "Business & Account Details")}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{t("yourFullName", "Your full name")}</label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{t("roleDesignation", "Role / Designation")}</label>
              <input
                type="text"
                value={form.role || ""}
                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{t("businessName", "Business name")}</label>
              <input
                type="text"
                value={form.businessName || ""}
                onChange={(e) => setForm((s) => ({ ...s, businessName: e.target.value }))}
                className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{t("contactEmail", "Contact email")}</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="focus-ring rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            {t("saveChanges", "Save changes")}
          </button>
        </form>
      </Card>

      {/* Notifications Card */}
      <Card title={t("notifications", "Notifications")}>
        <div className="space-y-3">
          {[
            { key: "invoiceDue", labelKey: "notifInvoiceDue", label: "Alert me when invoices are due soon" },
            { key: "weeklySummary", labelKey: "notifWeeklySummary", label: "Send a weekly financial summary" },
            { key: "creditAlerts", labelKey: "notifCreditAlerts", label: "Notify me of credit utilization changes" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 px-3.5 py-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t(n.labelKey, n.label)}</span>
              <button
                type="button"
                role="switch"
                aria-checked={notifs[n.key]}
                onClick={() => setNotifs((s) => ({ ...s, [n.key]: !s[n.key] }))}
                className={`focus-ring relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  notifs[n.key] ? "bg-blue-600 shadow-sm" : "bg-slate-200 dark:bg-slate-800 border dark:border-slate-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    notifs[n.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security & Database Status Card */}
      <Card title={t("securityAndDatabase", "Security & Dummy Database")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400">
                <Database size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t("persistentDatabase", "Persistent Local Database")}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{usersDb?.length || 0} {t("registeredAccountsStored", "registered user account(s) stored in database")}</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
              {t("activeStorage", "Active Storage")}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("registeredAccountsInDb", "Registered Accounts in Dummy Database:")}</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {usersDb?.map((u) => {
                const isCurrent = u.email.toLowerCase() === user.email.toLowerCase();
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs border ${
                      isCurrent
                        ? "border-blue-300 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold"
                        : "border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${isCurrent ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" : "bg-slate-300 dark:bg-slate-600"}`} />
                      <span className={isCurrent ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200"}>{u.name} ({u.role})</span>
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">· {u.email}</span>
                    </div>
                    {isCurrent && (
                      <span className="rounded bg-blue-200/80 dark:bg-blue-900/60 px-1.5 py-0.5 text-[10px] text-blue-800 dark:text-blue-200 font-bold">
                        {t("current", "Current")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Shield size={14} className="text-blue-600 dark:text-blue-400" />
              <span>{t("sessionActiveFor", "Session active for")} <strong className="text-slate-900 dark:text-white font-bold">{user.email}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              {t("logout", "Sign out")}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
