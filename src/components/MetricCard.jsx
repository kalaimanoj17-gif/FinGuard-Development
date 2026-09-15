import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { formatINR } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function MetricCard({ metric }) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const isUp = metric.direction === "up";
  const good = metric.id === "outstanding" ? !isUp : isUp;
  const data = metric.spark.map((v, i) => ({ i, v }));

  const labelMapping = {
    "Total revenue": "totalRevenue",
    "Operating expenses": "operatingExpenses",
    "Net cash flow": "netCashFlow",
    "Monthly inflow": "monthlyInflow",
    "Outstanding invoices": "invoices",
  };

  const keyToUse = labelMapping[metric.label] || metric.label;
  const translatedLabel = t(keyToUse, metric.label);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl p-5 border transition-all hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-glow ${isDark
          ? "bg-[#0C1322]/95 border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
        }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[13px] font-semibold transition-colors duration-200 ${isDark ? "text-slate-400" : "text-slate-500"
              }`}
          >
            {translatedLabel}
          </p>
          <p
            className={`mt-1.5 font-display text-2xl font-extrabold tabular transition-colors duration-200 ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            {formatINR(metric.value)}
          </p>
        </div>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-bold border ${good
              ? isDark
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
              : isDark
                ? "bg-amber-950/40 text-amber-400 border-amber-800/60"
                : "bg-amber-50 text-amber-700 border-amber-200/80"
            }`}
        >
          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(metric.change)}%
        </span>
      </div>
      <p
        className={`mt-1 text-xs font-medium transition-colors duration-200 ${isDark ? "text-slate-500" : "text-slate-400"
          }`}
      >
        {metric.compare}
      </p>
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#2563EB"
              strokeWidth={2}
              fill={`url(#spark-${metric.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
