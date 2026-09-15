import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Receipt,
  ArrowLeftRight,
  Users,
  Wallet,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Logo from "../components/Logo";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { to: "/", key: "dashboard", defaultLabel: "Dashboard", icon: LayoutGrid },
  { to: "/invoices", key: "invoices", defaultLabel: "Invoices", icon: FileText },
  { to: "/expenses", key: "expenses", defaultLabel: "Expenses", icon: Receipt },
  { to: "/transactions", key: "transactions", defaultLabel: "Transactions", icon: ArrowLeftRight },
  { to: "/customers", key: "customers", defaultLabel: "Customers", icon: Users },
  { to: "/payments", key: "payments", defaultLabel: "Payments", icon: Wallet },
  { to: "/credit", key: "credit", defaultLabel: "Credit", icon: ShieldCheck },
  { to: "/advisor", key: "advisor", defaultLabel: "AI Advisor", icon: Sparkles },
  { to: "/reports", key: "reports", defaultLabel: "Reports", icon: BarChart3 },
  { to: "/settings", key: "settings", defaultLabel: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed z-40 flex h-full flex-col ${
          isDark
            ? "bg-[#070D1A]/95 border-slate-800/80 shadow-[2px_0_24px_rgba(0,0,0,0.5)]"
            : "bg-white border-slate-200/90 shadow-[2px_0_16px_rgba(15,23,42,0.04)]"
        } border-r backdrop-blur-xl transition-[width,transform] duration-200 lg:static
        ${collapsed ? "w-[76px]" : "w-[236px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header with Brand Logo */}
        <div
          className={`flex h-[72px] items-center border-b ${
            isDark ? "border-slate-800/80" : "border-slate-100"
          } ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}
        >
          <Logo compact={collapsed} dark={isDark} />
        </div>

        {/* Navigation links */}
        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map(({ to, key, defaultLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all
                ${
                  isActive
                    ? isDark
                      ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 shadow-sm shadow-blue-500/10"
                      : "bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-sm shadow-blue-500/10"
                    : isDark
                    ? "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]"
                      style={{ width: 3.5 }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? isDark
                          ? "text-blue-400"
                          : "text-blue-600"
                        : isDark
                        ? "text-slate-400 group-hover:text-slate-200 transition-colors"
                        : "text-slate-400 group-hover:text-slate-700 transition-colors"
                    }
                  />
                  {!collapsed && (
                    <span
                      className={
                        isActive
                          ? isDark
                            ? "font-bold text-blue-300"
                            : "font-bold text-blue-900"
                          : ""
                      }
                    >
                      {t(key, defaultLabel)}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Collapse Toggle */}
        <div
          className={`p-3 border-t ${
            isDark ? "border-slate-800/80" : "border-slate-100"
          }`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`focus-ring group w-full flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium hidden lg:flex cursor-pointer transition-colors ${
              isDark
                ? "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {collapsed ? (
              <ChevronsRight
                size={18}
                className={
                  isDark
                    ? "text-slate-400 group-hover:text-slate-200 transition-colors"
                    : "text-slate-400 group-hover:text-slate-700 transition-colors"
                }
              />
            ) : (
              <ChevronsLeft
                size={18}
                className={
                  isDark
                    ? "text-slate-400 group-hover:text-slate-200 transition-colors"
                    : "text-slate-400 group-hover:text-slate-700 transition-colors"
                }
              />
            )}
            {!collapsed && <span>{t("collapse", "Collapse")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
