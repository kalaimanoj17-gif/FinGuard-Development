import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Card({ title, subtitle, action, className = "", children }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl transition-colors duration-200 backdrop-blur-xl p-5 border ${isDark
          ? "bg-[#0C1322]/95 border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
        } ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3
                className={`font-display text-[16px] font-bold tracking-tight transition-colors duration-200 ${isDark ? "text-white" : "text-slate-900"
                  }`}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={`mt-0.5 text-xs font-medium transition-colors duration-200 ${isDark ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
