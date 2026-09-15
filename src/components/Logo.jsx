import React from "react";
import logoIcon from "../assets/logo-icon.png";
import { useTheme } from "../context/ThemeContext";

/**
 * FinGuard AI Official Brand Logo Component
 * 
 * Features:
 * - High-contrast responsive typography (pure crisp white in Dark Mode, deep navy in Light Mode)
 * - Isolated 3D growth & invoice emblem with ambient glow
 * - Custom cyan leaf accent on the 'i' of FinGuard
 * - Electric royal blue to cyan gradient for 'AI'
 * - Modern wide-tracked "INVOICES TO INSIGHTS" subtitle
 * - Compact mode for collapsed sidebars & mobile headers
 * 
 * Props:
 * - compact: boolean (shows 3D emblem icon only)
 * - variant: "horizontal" | "icon" | "full"
 * - size: "sm" | "md" | "lg" | "xl"
 * - showTagline: boolean (defaults to true on horizontal unless compact)
 * - dark: boolean (optional override; otherwise uses ThemeContext)
 * - className: string
 */
export default function Logo({
  compact = false,
  variant = "horizontal",
  size = "md",
  showTagline = true,
  dark,
  className = "",
}) {
  const themeContext = useTheme();
  // If `dark` prop is explicitly provided, use it; otherwise fallback to theme context
  const isEffectiveDark = typeof dark === "boolean" ? dark : (themeContext?.isDark ?? true);

  // Sizing definitions for icon and typography
  const sizeConfig = {
    sm: {
      icon: "h-7 w-7",
      brandText: "text-[16px]",
      aiText: "text-[16.5px]",
      tagline: "text-[7px] tracking-[0.2em]",
      leaf: "w-2.5 h-2.5 -top-1 -right-0.5",
      gap: "gap-2",
    },
    md: {
      icon: "h-9 w-9",
      brandText: "text-[19px]",
      aiText: "text-[20px]",
      tagline: "text-[8px] tracking-[0.22em]",
      leaf: "w-3 h-3 -top-1.5 -right-0.5",
      gap: "gap-2.5",
    },
    lg: {
      icon: "h-11 w-11",
      brandText: "text-[24px]",
      aiText: "text-[25px]",
      tagline: "text-[9.5px] tracking-[0.24em]",
      leaf: "w-3.5 h-3.5 -top-2 -right-0.5",
      gap: "gap-3",
    },
    xl: {
      icon: "h-14 w-14",
      brandText: "text-[28px]",
      aiText: "text-[30px]",
      tagline: "text-[11px] tracking-[0.25em]",
      leaf: "w-4 h-4 -top-2.5 -right-1",
      gap: "gap-3.5",
    },
  };

  const cfg = sizeConfig[size] || sizeConfig.md;

  // Compact / icon-only variant: display isolated 3D emblem
  if (compact || variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoIcon}
          alt="FinGuard AI"
          className={`${cfg.icon} object-contain transition-transform duration-200 hover:scale-105 ${
            isEffectiveDark
              ? "drop-shadow-[0_4px_14px_rgba(56,189,248,0.3)]"
              : "drop-shadow-[0_4px_12px_rgba(37,99,235,0.22)]"
          }`}
        />
      </div>
    );
  }

  // Full horizontal brand lockup
  return (
    <div
      className={`group inline-flex items-center ${cfg.gap} select-none cursor-pointer ${className}`}
    >
      {/* 3D Growth & Invoice Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={logoIcon}
          alt="FinGuard AI Emblem"
          className={`${cfg.icon} object-contain transition-all duration-300 group-hover:scale-105 ${
            isEffectiveDark
              ? "drop-shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
              : "drop-shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
          }`}
        />
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        {/* Main Brand Title Row */}
        <div className="flex items-center leading-tight">
          {/* "FinGuard" - High Contrast White in Dark Mode, Deep Navy in Light Mode */}
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] ${cfg.brandText} font-extrabold tracking-tight transition-colors duration-200 ${
              isEffectiveDark
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                : "text-[#0F2B5C]"
            }`}
          >
            F
            {/* 'i' with signature leaf accent */}
            <span className="relative inline-block">
              i
              <svg
                className={`absolute ${cfg.leaf} pointer-events-none fill-current transition-transform duration-200 group-hover:rotate-6 ${
                  isEffectiveDark
                    ? "text-[#38BDF8] drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]"
                    : "text-[#0284C7] drop-shadow-[0_1px_3px_rgba(2,132,199,0.4)]"
                }`}
                viewBox="0 0 24 24"
              >
                {/* Organic curved sprout leaf */}
                <path d="M17.5 3C10.5 4.5 7 10 7 16.5C12 16.5 17.5 13.5 19 5.5C19 5 18.2 4 17.5 3Z" />
              </svg>
            </span>
            nGuard
          </span>

          {/* "AI" - Vibrant Electric Royal Blue & Cyan Gradient */}
          <span
            className={`ml-1 font-['Plus_Jakarta_Sans',sans-serif] ${cfg.aiText} font-extrabold bg-gradient-to-r ${
              isEffectiveDark
                ? "from-blue-400 via-cyan-400 to-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                : "from-blue-600 via-blue-500 to-cyan-500"
            } bg-clip-text text-transparent`}
          >
            AI
          </span>
        </div>

        {/* Subtitle Tagline: "INVOICES TO INSIGHTS" */}
        {showTagline && (
          <span
            className={`mt-0.5 font-['Plus_Jakarta_Sans',sans-serif] ${cfg.tagline} font-bold uppercase transition-colors duration-200 ${
              isEffectiveDark
                ? "text-slate-300/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                : "text-slate-500"
            }`}
          >
            Invoices to Insights
          </span>
        )}
      </div>
    </div>
  );
}
