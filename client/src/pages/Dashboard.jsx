import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { ArrowRight, Eye, Calendar, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import AdvisorPanel from "../components/AdvisorPanel";
import Card from "../components/Card";
import { ProgressRing, StatusBadge, Modal } from "../components/ui";
import { useFinance } from "../context/FinanceContext";
import { useInvoices } from "../context/InvoiceContext";
import { useLanguage } from "../context/LanguageContext";
import { transactions, formatINR } from "../data/mockData";

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 shadow-xl">
      <p className="font-bold text-slate-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold text-[11px]">
          {p.name}: {prefix}{typeof p.value === "number" ? formatINR(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { period, data } = useFinance();
  const { invoices } = useInvoices();
  const { t } = useLanguage();
  const [txModal, setTxModal] = useState(null);

  const {
    overviewMetrics,
    revenueVsExpenses,
    cashFlow,
    expenseBreakdown,
    paymentStatus,
    spendingScore,
    creditScore,
    creditUtilization,
    dateRangeText,
    sublabel,
  } = data;

  // Finzo vibrant palette for charts (Royal Blue, Sky Blue, Mint Emerald)
  const FINZO_PALETTE = ["#2563EB", "#0EA5E9", "#10B981", "#3B82F6", "#60A5FA", "#34D399"];

  return (
    <div className="space-y-6">
      {/* 🚀 Finzo Hero Feature Card (Deep Royal Midnight Blue) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2B5C] via-[#1E40AF] to-[#2563EB] p-6 sm:p-7 text-white shadow-deepBlue">
        {/* Soft cyan & blue ambient glow circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl animate-pulseGlow" />
        <div className="pointer-events-none absolute left-1/3 -bottom-20 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            {/* Finzo signature pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-cyan-200 border border-white/20 mb-3 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
              <span>SMART FINANCIAL INTELLIGENCE & PORTFOLIO GOVERNANCE</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Invest today. <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">Own tomorrow.</span>
            </h2>

            <p className="mt-2 text-sm text-blue-100/90 leading-relaxed font-normal">
              Autonomous financial intelligence, smart OCR invoice reconciliation, goal-based capital growth, and instant payment collections—all in one high-performance dashboard.
            </p>
          </div>

          {/* Quick Metrics Grid on Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-center shadow-sm">
              <p className="font-display text-lg sm:text-xl font-bold text-white">99.4%</p>
              <p className="text-[10px] font-semibold text-cyan-200 tracking-wider uppercase mt-0.5">Health Score</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-center shadow-sm">
              <p className="font-display text-lg sm:text-xl font-bold text-white">₹1.28L</p>
              <p className="text-[10px] font-semibold text-cyan-200 tracking-wider uppercase mt-0.5">Net Inflow</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-center shadow-sm">
              <p className="font-display text-lg sm:text-xl font-bold text-white">100%</p>
              <p className="text-[10px] font-semibold text-cyan-200 tracking-wider uppercase mt-0.5">GST Sync</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-center shadow-sm">
              <p className="font-display text-lg sm:text-xl font-bold text-white">18 Days</p>
              <p className="text-[10px] font-semibold text-cyan-200 tracking-wider uppercase mt-0.5">Runway Buffer</p>
            </div>
          </div>
        </div>

        {/* Hero Bottom Progress Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">FINZO INTELLIGENCE JOURNEY:</span>
            <span className="font-medium text-cyan-200">Active period: {t(period, period)} ({dateRangeText})</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="h-2 flex-1 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: "78%" }} />
            </div>
            <span className="font-mono text-[11px] font-bold text-white">78% Opt.</span>
          </div>
        </div>
      </div>

      {/* Overview metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Revenue chart + AI advisor */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title={t("revenueVsExpenses", "Revenue vs expenses")}
          subtitle={`${sublabel || t("comparison", "Comparison")}, in ₹ thousands`}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueVsExpenses}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip prefix="₹" />} />
                <Area type="monotone" dataKey="revenue" name={t("revenue", "Revenue")} stroke="#2563EB" strokeWidth={2.4} fill="url(#rev)" />
                <Area type="monotone" dataKey="expenses" name={t("expenses", "Expenses")} stroke="#0EA5E9" strokeWidth={2} strokeDasharray="3 3" fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-5 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm inline-block" /> {t("revenue", "Revenue")}</span>
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-cyan-500 inline-block" /> {t("expenses", "Expenses")}</span>
          </div>
        </Card>

        <AdvisorPanel />
      </div>

      {/* Cash flow + expense breakdown + payment status */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("monthlyCashFlow", "Monthly cash flow")} subtitle={t("netCashPosition", "Net cash position, in ₹ thousands")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={26} />
                <Tooltip content={<ChartTooltip prefix="₹" />} />
                <Bar dataKey="net" name={t("netCash", "Net cash")} radius={[6, 6, 0, 0]} fill="#2563EB" maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t("expenseBreakdown", "Expense breakdown")} subtitle={t("shareOfTotalSpend", "Share of total spend")}>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={44} outerRadius={68} paddingAngle={3}>
                    {expenseBreakdown.map((e, idx) => (
                      <Cell key={e.name} fill={FINZO_PALETTE[idx % FINZO_PALETTE.length]} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-xs w-full">
              {expenseBreakdown.map((e, idx) => (
                <li key={e.name} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="h-2 w-2 rounded-full inline-block shrink-0" style={{ background: FINZO_PALETTE[idx % FINZO_PALETTE.length] }} />
                  <span className="truncate">{t(e.name, e.name)}</span>
                  <span className="ml-auto font-bold text-slate-900 dark:text-white">{e.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title={t("paymentStatus", "Payment status")} subtitle={t("invoicesThisPeriod", "Invoices this period")}>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentStatus} dataKey="value" nameKey="name" innerRadius={44} outerRadius={68} paddingAngle={3} startAngle={90} endAngle={-270}>
                    {paymentStatus.map((e, idx) => (
                      <Cell key={e.name} fill={FINZO_PALETTE[(idx + 1) % FINZO_PALETTE.length]} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-xs w-full">
              {paymentStatus.map((e, idx) => (
                <li key={e.name} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="h-2 w-2 rounded-full inline-block shrink-0" style={{ background: FINZO_PALETTE[(idx + 1) % FINZO_PALETTE.length] }} />
                  <span className="truncate">{t(e.name, e.name)}</span>
                  <span className="ml-auto font-bold text-slate-900 dark:text-white">{e.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Transactions + Invoices */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title={t("recentTransactions", "Recent transactions")}
          action={<Link to="/transactions" className="focus-ring flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">{t("viewAll", "View all")} <ArrowRight size={13} /></Link>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5">{t("transaction", "Transaction")}</th>
                  <th className="pb-2.5">{t("category", "Category")}</th>
                  <th className="pb-2.5">{t("date", "Date")}</th>
                  <th className="pb-2.5 text-right">{t("amount", "Amount")}</th>
                  <th className="pb-2.5 text-right">{t("status", "Status")}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 6).map((tItem) => (
                  <tr
                    key={tItem.id}
                    className="border-t border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3">
                      <p className="font-bold text-slate-900 dark:text-white transition-colors">{tItem.party}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{tItem.id}</p>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{t(tItem.category, tItem.category)}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{tItem.date}</td>
                    <td
                      className={`py-3 text-right font-bold tabular ${tItem.amount < 0
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-emerald-600 dark:text-emerald-400 font-extrabold"
                        }`}
                    >
                      {formatINR(tItem.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={tItem.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={t("recentInvoices", "Recent invoices")}
          action={
            <Link
              to="/invoices"
              className="focus-ring flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
            >
              {t("viewAll", "View all")} <ArrowRight size={13} />
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {invoices.slice(0, 4).map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-3.5 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                    {inv.customer}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {inv.id} · {t("due", "Due")} {inv.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold tabular text-slate-900 dark:text-white transition-colors">
                    {formatINR(inv.amount)}
                  </span>
                  <button
                    onClick={() => setTxModal(inv)}
                    className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    aria-label={t("preview", "Preview invoice")}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Spending & credit */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card title={t("spendingScore", "Spending score")}>
          <div className="flex items-center justify-center py-2">
            <ProgressRing value={spendingScore.score} label={spendingScore.score} sublabel="/ 100" color="#2563EB" trackColor="#EFF6FF" />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-slate-500">{spendingScore.label} · {spendingScore.delta > 0 ? "+" : ""}{spendingScore.delta} {t("ptsVsLastMonth", "pts vs last month")}</p>
        </Card>
        <Card title={t("creditScore", "Credit score")}>
          <div className="flex items-center justify-center py-2">
            <ProgressRing value={creditScore.score} max={creditScore.max} label={creditScore.score} sublabel={`/ ${creditScore.max}`} color="#10B981" trackColor="#ECFDF5" />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-slate-500">{creditScore.label} · {creditScore.delta} {t("ptsVsLastMonth", "pts vs last month")}</p>
        </Card>
        <Card title={t("creditUtilization", "Credit utilization")}>
          <div className="flex items-center justify-center py-2">
            <ProgressRing value={creditUtilization.percent} label={`${creditUtilization.percent}%`} color="#F59E0B" trackColor="#FFFBEB" />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-slate-500">+{creditUtilization.delta} {t("ptsVsLastMonth", "pts vs last month")}</p>
        </Card>
        <Card title={t("monthlySpendingTrend", "Monthly spending trend")} subtitle={t("last6Months", "Last 6 months")}>
          <div className="h-[104px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow.slice(-6)}>
                <defs>
                  <linearGradient id="spendTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="net" stroke="#2563EB" strokeWidth={2} fill="url(#spendTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Modal open={!!txModal} onClose={() => setTxModal(null)} title={txModal ? `${t("invoiceColumn", "Invoice")} ${txModal.id}` : ""}>
        {txModal && (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-2"><span>{t("customerColumn", "Customer")}</span><span className="font-bold text-slate-900">{txModal.customer}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span>{t("amountColumn", "Amount")}</span><span className="font-bold text-slate-900">{formatINR(txModal.amount)}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span>{t("dueDateColumn", "Due date")}</span><span className="font-semibold text-slate-900">{txModal.dueDate}</span></div>
            <div className="flex justify-between"><span>{t("statusColumn", "Status")}</span><StatusBadge status={txModal.status} /></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
