import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ---------------- Status badge ---------------- */
const STATUS_STYLES = {
  Completed: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm",
  Paid: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm",
  Active: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm",
  Pending: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  "Due soon": "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  Sent: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
  Draft: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  Failed: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
  Overdue: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

/* ---------------- Progress ring ---------------- */
export function ProgressRing({ value, max = 100, size = 96, stroke = 9, color = "#2563EB", trackColor, label, sublabel }) {
  const { isDark } = useTheme();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value / max));
  const dash = circumference * pct;
  const computedTrackColor = trackColor || (isDark ? "rgba(255, 255, 255, 0.09)" : "#EFF6FF");

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={computedTrackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          className="transition-[stroke-dasharray] duration-700 ease-out drop-shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white tabular">{label}</span>
        {sublabel && <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm">
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="font-display text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

/* ---------------- Tooltip ---------------- */
export function Tip({ children, label }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg animate-[fadeIn_.18s_ease-out] rounded-2xl bg-white dark:bg-[#0C1322] border border-slate-100 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-900/80">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="focus-ring rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white cursor-pointer transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 text-slate-700 dark:text-slate-200">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/60">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Confirm dialog ---------------- */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm" }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button onClick={onClose} className="focus-ring rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="focus-ring rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </Modal>
  );
}

/* ---------------- Toast system ---------------- */
const ToastContext = createContext(null);

const TOAST_ICON = { success: CheckCircle2, info: Info, warning: TriangleAlert };
const TOAST_COLOR = { success: "text-emerald-500", info: "text-blue-600", warning: "text-amber-500" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = TOAST_ICON[t.kind];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-xl shadow-slate-900/10 animate-[fadeIn_.18s_ease-out]"
            >
              <Icon size={16} className={TOAST_COLOR[t.kind]} />
              <span className="font-semibold text-slate-800">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
