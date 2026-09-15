import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../components/Card";
import { StatusBadge } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { paymentStatus, invoices, formatINR } from "../data/mockData";

const STATUS_MAP = { Paid: "Paid", "Due soon": "Pending", Sent: "Pending", Draft: "Pending", Overdue: "Overdue" };

export default function Payments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const grouped = { Paid: [], Pending: [], Overdue: [] };
  invoices.forEach((inv) => grouped[STATUS_MAP[inv.status]].push(inv));

  const STATUS_COLORS = ["#10B981", "#F59E0B", "#F43F5E"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Payments</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Track paid, pending, and overdue payments.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {Object.entries(grouped).map(([status, list]) => (
          <Card key={status} title={status} subtitle={`${list.length} invoices`}>
            <p className="mb-3 font-display text-2xl font-bold tabular text-slate-900 dark:text-white">
              {formatINR(list.reduce((s, i) => s + i.amount, 0))}
            </p>
            <ul className="space-y-2">
              {list.length === 0 && <p className="text-sm text-slate-400">No invoices in this group.</p>}
              {list.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 px-3.5 py-2.5 text-sm hover:border-blue-200 dark:hover:border-slate-700 transition-colors">
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">{inv.customer}</span>
                  <span className="font-bold tabular text-slate-900 dark:text-white">{formatINR(inv.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Payment status split" className="lg:col-span-1">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                  {paymentStatus.map((e, idx) => (
                    <Cell key={e.name} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} stroke={isDark ? "#0C1322" : "#FFFFFF"} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0C1322" : "#FFFFFF",
                    borderColor: isDark ? "#1E293B" : "#E2E8F0",
                    borderRadius: "0.75rem",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {paymentStatus.map((e, idx) => (
              <li key={e.name} className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full inline-block" style={{ background: STATUS_COLORS[idx % STATUS_COLORS.length] }} /> {e.name}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Payment history" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5">Invoice</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Due date</th>
                  <th className="pb-2.5 text-right">Amount</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-100 dark:border-slate-800/60 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white text-xs">{inv.id}</td>
                    <td className="py-3 text-slate-900 dark:text-slate-200 font-semibold">{inv.customer}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{inv.dueDate}</td>
                    <td className="py-3 text-right font-bold tabular text-slate-900 dark:text-white">{formatINR(inv.amount)}</td>
                    <td className="py-3 text-right"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
