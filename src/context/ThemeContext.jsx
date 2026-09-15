import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
});

function applyThemeToDOM(currentTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  const isDarkMode = currentTheme === "dark";

  if (isDarkMode) {
    root.classList.add("dark");
    body?.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    body?.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  }
}

export function ThemeProvider({ children }) {
  // Read saved theme from localStorage or default to "dark"
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem("finguard_theme");
      if (saved === "light" || saved === "dark") {
        applyThemeToDOM(saved);
        return saved;
      }
    } catch {
      // fallback
    }
    applyThemeToDOM("dark");
    return "dark"; // Default to dark mode per user request
  });

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem("finguard_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
