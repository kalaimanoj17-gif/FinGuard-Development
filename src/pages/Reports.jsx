import React, { useState } from "react";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../components/Card";
import { useToast } from "../components/ui";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { formatINR } from "../data/mockData";

const TABS = ["Revenue", "Expense", "Profit", "Cash flow"];

export default function Reports() {
  const [tab, setTab] = useState("Revenue");
  const { period, data } = useFinance();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const push = useToast();

  const { revenueReport, expenseReport, cashFlow, sublabel } = data;

  const profitReport = revenueReport.map((r, i) => ({
    category: r.category,
    amount: Math.max(r.amount - (expenseReport[i]?.amount || 0), 0),
  }));

  const dataByTab = {
    Revenue: revenueReport,
    Expense: expenseReport,
    Profit: profitReport,
    "Cash flow": cashFlow.map((c) => ({ category: c.month, amount: c.net * 1000 })),
  };

  const rows = dataByTab[tab] || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Export-ready financial summaries for <span className="font-bold text-slate-900 dark:text-white">{period}</span>.</p>
        </div>
        <button
          onClick={() => push(`${tab} report (${period}) exported as PDF.`, "success")}
          className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
        >
          <Download size={16} /> Export report
        </button>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              tab === t
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card title={`${tab} report`} subtitle={`${sublabel || "Category breakdown"}`}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid horizontal={false} stroke={isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Math.round(v / 1000)}K`)}
              />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: isDark ? "#CBD5E1" : "#334155" }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0C1322" : "#FFFFFF",
                  borderColor: isDark ? "#1E293B" : "#E2E8F0",
                  borderRadius: "0.75rem",
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                }}
                formatter={(v) => [formatINR(v), "Amount"]}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} fill="#2563EB" maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</span>
          <span className="font-display text-lg font-bold tabular text-slate-900 dark:text-white">
            {formatINR(rows.reduce((s, r) => s + r.amount, 0))}
          </span>
        </div>
      </Card>
    </div>
  );
}
