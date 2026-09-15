import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Calendar,
  User,
  Settings as SettingsIcon,
  Sparkles,
  LogOut,
  Globe,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui";
import { useUser } from "../context/UserContext";
import { useFinance, PERIOD_OPTIONS } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function Topbar({ title, onMenuClick }) {
  const { period, setPeriod, periodOptions } = useFinance();
  const { language, setLanguage, t, currentLangObj, supportedLanguages } =
    useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const [periodOpen, setPeriodOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const push = useToast();
  const { user, initials, openProfile } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    push("Logged out successfully.", "info");
    navigate("/login");
  };

  const handleSelectLanguage = (langCode, langName) => {
    setLanguage(langCode);
    setLangOpen(false);
    push(`Language updated to ${langName}`, "success");
  };

  return (
    <header
      className={`sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b transition-colors duration-200 ${isDark
          ? "bg-[#090E1A]/90 border-slate-800/80 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "bg-white/95 border-slate-200/80 text-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.03)]"
        } px-4 backdrop-blur-md lg:px-8`}
    >
      <button
        onClick={onMenuClick}
        className={`focus-ring rounded-lg p-2 lg:hidden cursor-pointer transition-colors ${isDark
            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <h1
        className={`hidden font-display text-xl font-extrabold tracking-tight md:block transition-colors duration-200 ${isDark ? "text-white" : "text-slate-900"
          }`}
      >
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden items-center sm:flex">
          <Search size={16} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder", "Search transactions, invoices…")}
            className="focus-ring w-52 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:w-64 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all lg:w-60 shadow-sm"
          />
        </div>

        {/* 🌓 Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-amber-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm group"
          title={isDark ? "Switch to Light Mode" : "Switch to Deep Dark Animated Background"}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={15} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon size={15} className="text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* 🌐 Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setLangOpen((o) => !o);
              setPeriodOpen(false);
              setNotifOpen(false);
              setProfileMenuOpen(false);
            }}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            title="Translate Web (Language Selector)"
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span className="font-medium text-xs text-slate-700 dark:text-slate-300 hidden sm:inline">
              {currentLangObj.nativeName}
            </span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.12)] animate-[fadeIn_.15s_ease-out]">
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={13} className="text-blue-600" />
                  {t("selectLanguage", "Select Language")}
                </span>
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-200/80 dark:border-blue-700/60">
                  6 Langs
                </span>
              </div>
              <div className="p-1.5 space-y-0.5">
                {supportedLanguages.map((lang) => {
                  const isSelected = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleSelectLanguage(lang.code, lang.nativeName)
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${isSelected
                          ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-700/60"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-blue-600 dark:text-blue-400 font-bold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setPeriodOpen((o) => !o);
              setLangOpen(false);
              setNotifOpen(false);
              setProfileMenuOpen(false);
            }}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800 cursor-pointer transition-all shadow-sm"
          >
            <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">{t(period, period)}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {periodOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.12)] animate-[fadeIn_.15s_ease-out]">
              {(periodOptions || PERIOD_OPTIONS).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setPeriodOpen(false);
                    push(`Showing data for ${p.toLowerCase()}`, "info");
                  }}
                  className={`block w-full px-3.5 py-2.5 text-left text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors ${p === period
                      ? "text-blue-700 dark:text-blue-400 font-bold bg-blue-50/70 dark:bg-blue-900/30"
                      : "text-slate-700 dark:text-slate-300"
                    }`}
                >
                  {t(p, p)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setLangOpen(false);
              setPeriodOpen(false);
              setProfileMenuOpen(false);
            }}
            className="focus-ring relative rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.12)] animate-[fadeIn_.15s_ease-out]">
              <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/80">
                {t("notifications", "Notifications")}
              </div>
              {[
                "Invoice FM-2026-0047 (Manoj Kumar) reminder scheduled.",
                "Payment of ₹57,800 received from Kiran Wholesale.",
                "Credit utilization crossed 45%.",
              ].map((n, i) => (
                <div
                  key={i}
                  className="border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 text-[13px] text-slate-600 dark:text-slate-300 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Button and Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileMenuOpen((o) => !o);
              setLangOpen(false);
              setPeriodOpen(false);
              setNotifOpen(false);
            }}
            className="focus-ring flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-1 pr-2.5 py-1 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            title="Account & Profile"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-7 w-7 rounded-full object-cover shadow-sm ring-1 ring-white/30"
              />
            ) : (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-sm"
              >
                {initials}
              </span>
            )}
            <span className="hidden text-sm font-semibold text-slate-800 dark:text-slate-200 sm:inline truncate max-w-[120px]">
              {user.name}
            </span>
            <ChevronDown
              size={14}
              className={`hidden text-slate-400 sm:inline transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.12)] animate-[fadeIn_.15s_ease-out]">
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-white/30"
                    />
                  ) : (
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-sm"
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200/80 dark:border-blue-700/60 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                  <Sparkles size={11} className="text-blue-600 dark:text-blue-400" />
                  {user.role}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    openProfile();
                  }}
                  className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-slate-400" />
                  <span>{t("editProfile", "Edit Profile")}</span>
                </button>

                <Link
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <SettingsIcon size={16} className="text-slate-400" />
                  <span>{t("settings", "Settings")}</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>{t("logOut", "Sign out")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
