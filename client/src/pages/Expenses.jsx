import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Card from "../components/Card";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { transactions, formatINR } from "../data/mockData";

export default function Expenses() {
  const { period, data } = useFinance();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { expenseBreakdown, cashFlow, expenses } = data;
  const expenseTx = transactions.filter((t) => t.type === "debit");
  const total = expenseBreakdown.reduce((s, e) => s + e.value, 0);

  const FINZO_EXPENSE_PALETTE = ["#2563EB", "#0EA5E9", "#10B981", "#3B82F6", "#F59E0B"];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Expenses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Track where your money is going for <span className="font-bold text-slate-900 dark:text-white">{period}</span> ({formatINR(expenses)} total spend).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {expenseBreakdown.map((e, idx) => {
          const color = FINZO_EXPENSE_PALETTE[idx % FINZO_EXPENSE_PALETTE.length];
          return (
            <div key={e.name} className="rounded-2xl bg-white dark:bg-[#0C1322]/95 border border-slate-100 dark:border-slate-800/80 p-4 shadow-card hover:border-blue-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: color }} />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{e.name}</p>
              </div>
              <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">{e.value}%</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-1.5 rounded-full" style={{ width: `${(e.value / total) * 100}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Monthly expenses" subtitle="In ₹ thousands">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow.map((c) => ({ month: c.month, expense: Math.round(c.net * 0.9) }))}>
                <CartesianGrid vertical={false} stroke={isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0C1322" : "#FFFFFF",
                    borderColor: isDark ? "#1E293B" : "#E2E8F0",
                    borderRadius: "0.75rem",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  }}
                  formatter={(val) => [`₹${val}K`, "Expense"]}
                />
                <Bar dataKey="expense" radius={[6, 6, 0, 0]} fill="#2563EB" maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Spending trend" subtitle="6-month rolling view">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow}>
                <defs>
                  <linearGradient id="expTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: isDark ? "#94A3B8" : "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0C1322" : "#FFFFFF",
                    borderColor: isDark ? "#1E293B" : "#E2E8F0",
                    borderRadius: "0.75rem",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  }}
                />
                <Area type="monotone" dataKey="net" stroke="#0EA5E9" strokeWidth={2} fill="url(#expTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Expense list" subtitle="Debit transactions this period">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="pb-2.5">Vendor</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseTx.map((t) => (
                <tr key={t.id} className="border-t border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-slate-200">{t.party}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{t.category}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{t.date}</td>
                  <td className="py-3 text-right font-bold tabular text-slate-900 dark:text-white">{formatINR(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
