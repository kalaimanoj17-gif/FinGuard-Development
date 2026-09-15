import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { useTheme } from "../context/ThemeContext";

export default function AppShell({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className={`relative flex h-screen transition-colors duration-300 ${
        isDark ? "bg-[#050811] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      } selection:bg-blue-600 selection:text-white overflow-hidden`}
    >
      {/* Dynamic Ambient Animated Background */}
      <AnimatedBackground />

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-y-auto bg-transparent">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-7 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
