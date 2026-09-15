import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * AnimatedBackground
 * High-performance, GPU-accelerated background that dynamically morphs between
 * deep obsidian black (cyber dark mode) and clean daylight canvas (light mode).
 * Features floating aurora orbs, dynamic financial flow lines, and an interactive
 * neon constellation network.
 */
export default function AnimatedBackground({ interactive = true }) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for subtle interactive magnetism
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Financial Network Nodes
    const PARTICLE_COUNT = Math.min(36, Math.max(18, Math.floor(width / 45)));
    let particles = [];

    // Colors tailored for dark mode (neon glow) vs light mode (subtle pastel)
    const darkColors = [
      "rgba(56, 189, 248, ",   // Neon Sky/Cyan
      "rgba(96, 165, 250, ",  // Electric Blue
      "rgba(165, 180, 252, ", // Luminous Indigo
      "rgba(52, 211, 153, ",  // Mint Emerald
    ];

    const lightColors = [
      "rgba(37, 99, 235, ",   // Royal Blue
      "rgba(14, 165, 233, ",  // Cyan
      "rgba(99, 102, 241, ",  // Indigo
      "rgba(16, 185, 129, ",  // Emerald
    ];

    const palette = isDark ? darkColors : lightColors;

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * (isDark ? 2.2 : 1.8) + 1.2,
          baseAlpha: Math.random() * (isDark ? 0.35 : 0.25) + (isDark ? 0.25 : 0.15),
          colorBase: palette[Math.floor(Math.random() * palette.length)],
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    initParticles();

    // Tab visibility handling
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update & Draw Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off bounds smoothly
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Mouse reaction (subtle push)
        if (interactive && mouse.x > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 1.3;
            p.y += (dy / dist) * force * 1.3;
          }
        }

        // Subtle alpha pulsation
        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        if (isDark) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${p.colorBase}0.7)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `${p.colorBase}${Math.max(0.08, currentAlpha)})`;
        ctx.fill();

        // Connect nearby nodes with delicate lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const lineAlpha = (1 - distance / 120) * (isDark ? 0.2 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${lineAlpha})`
              : `rgba(37, 99, 235, ${lineAlpha})`;
            ctx.lineWidth = isDark ? 0.9 : 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [interactive, isDark]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden z-0 select-none transition-colors duration-500 ${
        isDark ? "bg-[#050811]" : "bg-[#F8FAFC]"
      }`}
    >
      {/* 1. Base Aurora Mesh Orbs */}
      <div
        className={`absolute -top-[15%] -left-[10%] h-[740px] w-[740px] rounded-full blur-[130px] animate-aurora-1 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-blue-600/38 via-blue-500/22 to-transparent"
            : "bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"
        }`}
      />
      <div
        className={`absolute -bottom-[20%] -right-[10%] h-[760px] w-[760px] rounded-full blur-[135px] animate-aurora-2 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-tl from-cyan-400/32 via-blue-600/20 to-transparent"
            : "bg-gradient-to-tl from-cyan-400/22 via-blue-500/12 to-transparent"
        }`}
      />
      <div
        className={`absolute top-[25%] right-[10%] h-[580px] w-[580px] rounded-full blur-[120px] animate-aurora-3 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-bl from-indigo-500/28 via-purple-500/18 to-transparent"
            : "bg-gradient-to-bl from-indigo-400/18 via-purple-300/10 to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-[20%] left-[12%] h-[540px] w-[540px] rounded-full blur-[115px] animate-aurora-4 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-tr from-emerald-400/24 via-teal-400/15 to-transparent"
            : "bg-gradient-to-tr from-emerald-400/16 via-teal-300/10 to-transparent"
        }`}
      />

      {/* 2. Delicate Dynamic Flow Streams (SVG Bezier curves) */}
      <svg
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          isDark ? "opacity-75" : "opacity-60"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="finzoStream1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="#2563EB"
              stopOpacity={isDark ? "0.04" : "0.02"}
            />
            <stop
              offset="50%"
              stopColor="#0EA5E9"
              stopOpacity={isDark ? "0.3" : "0.14"}
            />
            <stop
              offset="100%"
              stopColor="#3B82F6"
              stopOpacity={isDark ? "0.05" : "0.03"}
            />
          </linearGradient>
          <linearGradient id="finzoStream2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="#6366F1"
              stopOpacity={isDark ? "0.04" : "0.02"}
            />
            <stop
              offset="50%"
              stopColor="#10B981"
              stopOpacity={isDark ? "0.26" : "0.12"}
            />
            <stop
              offset="100%"
              stopColor="#0284C7"
              stopOpacity={isDark ? "0.04" : "0.02"}
            />
          </linearGradient>
        </defs>

        <path
          d="M-100,250 C300,100 650,420 1100,220 C1300,140 1480,260 1600,240"
          fill="none"
          stroke="url(#finzoStream1)"
          strokeWidth={isDark ? "3" : "2.5"}
          strokeDasharray="8 12"
          className="animate-stream-flow"
        />
        <path
          d="M-80,680 C320,520 700,780 1120,600 C1320,510 1460,670 1600,640"
          fill="none"
          stroke="url(#finzoStream2)"
          strokeWidth={isDark ? "2.5" : "2"}
          strokeDasharray="6 14"
          className="animate-stream-flow"
          style={{ animationDelay: "-6s" }}
        />
      </svg>

      {/* 3. Tech Dot Lattice Overlay with Center-Weighted Vignette */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? "opacity-35" : "opacity-45"
        }`}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)"
            : "radial-gradient(#94A3B8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, rgba(0,0,0,0.5) 65%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, rgba(0,0,0,0.5) 65%, transparent 95%)",
        }}
      />

      {/* 4. Canvas for Real-Time Financial Node Constellations */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
