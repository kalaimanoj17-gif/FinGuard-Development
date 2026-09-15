/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Electric Royal Blue (Finzo Primary)
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        // Finzo Blue & Cyan Accent Scales
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#0F2B5C", // Deep Midnight Blue from Launch Banner
        },
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        // Finzo Growth & Savings Mint / Emerald Palette
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        // High-Contrast Crisp Slate Typography on Clean Canvas
        ink: {
          900: "#0F172A", // Deep Navy / Slate for bold headings
          800: "#1E293B", // High contrast body
          700: "#334155", // Neutral text
          600: "#475569", // Secondary text
          500: "#64748B", // Muted labels
          400: "#94A3B8", // Subtle placeholders
          300: "#CBD5E1", // Hairline borders
          200: "#E2E8F0", // Card borders
          100: "#F1F5F9", // Soft background elements
          50: "#F8FAFC",  // Canvas off-white
        },
        // Clean White Surfaces & Soft Card Elevation
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          card: "#FFFFFF",
          line: "#F1F5F9",
          border: "#E2E8F0",
        },
        // Semantic Accents
        success: "#10B981",
        danger: "#F43F5E",
        warning: "#F59E0B",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 14px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
        glow: "0 0 0 1px rgba(37, 99, 235, 0.15), 0 8px 25px -4px rgba(37, 99, 235, 0.12)",
        pop: "0 20px 40px -12px rgba(15, 23, 42, 0.12)",
        blueGlow: "0 8px 24px -4px rgba(37, 99, 235, 0.28)",
        deepBlue: "0 20px 45px -12px rgba(15, 43, 92, 0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 0.85, transform: "scale(1.03)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "float-slow": "floatSlow 5s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
