import React from 'react';
import { 
  Sparkles, 
  Wallet, 
  FileText, 
  Receipt, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import StatCard from '../components/StatCard';
import AiActionCenter from '../components/AiActionCenter';
import { 
  BUSINESS_PROFILE, 
  FINANCIAL_HEALTH_SCORE, 
  CASH_OVERVIEW, 
  INVOICE_OVERVIEW, 
  EXPENSE_OVERVIEW, 
  FRAUD_SECURITY_DATA 
} from '../data/mockData';

export default function Dashboard({ onSelectAction, setActiveTab }) {
  const expenseChartColors = ["#0d9488", "#2563eb", "#6366f1", "#16a34a", "#d97706"];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting Banner */}
      <div className="bg-gradient-to-r from-teal-50/60 via-white to-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-teal-800 font-bold tracking-wider uppercase">Live Ledger Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Business ID: {BUSINESS_PROFILE.businessId}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, {BUSINESS_PROFILE.name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Your financial workspace at a glance. FinGuard AI is monitoring 142 ledgers, bank feeds, and supplier tax invoices.
          </p>
        </div>

        {/* AI Health Pill Badge */}
        <div 
          onClick={() => setActiveTab('compliance')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-teal-300 transition-all shrink-0"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center font-extrabold text-lg text-white shadow-xs">
            {FINANCIAL_HEALTH_SCORE.score}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900">Health Score: {FINANCIAL_HEALTH_SCORE.status}</span>
              <Activity className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">{FINANCIAL_HEALTH_SCORE.change}</p>
          </div>
        </div>
      </div>

      {/* Financial Health Visible Factors Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            Financial Health Score Factors (72 / 100 • MEDIUM Risk)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Real-time Risk Audit</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {FINANCIAL_HEALTH_SCORE.factors.map((f, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">{f.label}</span>
                <span className="font-bold text-slate-900">{f.status}</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                f.score < 70 ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
              }`}>
                {f.score}/100
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Overview Cards in INR ₹ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cash Position"
          value={`₹${CASH_OVERVIEW.totalCash.toLocaleString('en-IN')}`}
          change={`+₹${CASH_OVERVIEW.netCashFlowMonth.toLocaleString('en-IN')}`}
          isPositive={true}
          subtitle="net cashflow this mo."
          icon={Wallet}
          accentColor="emerald"
          badge={`${CASH_OVERVIEW.runwayMonths} Mo Runway`}
          aiInsight="Cash buffer healthy. 7.2 months operational runway based on current burn."
        />

        <StatCard
          title="Outstanding Invoices"
          value={`₹${INVOICE_OVERVIEW.pendingAmount.toLocaleString('en-IN')}`}
          change={`₹${INVOICE_OVERVIEW.overdueAmount.toLocaleString('en-IN')} Overdue`}
          isPositive={false}
          subtitle="1 account late"
          icon={FileText}
          accentColor="teal"
          badge={`${INVOICE_OVERVIEW.pendingCount} Pending`}
          aiInsight="88 Collection score. Starlight Trade is overdue on ₹62,000 invoice."
        />

        <StatCard
          title="Monthly Expenses"
          value={`₹${EXPENSE_OVERVIEW.totalMonth.toLocaleString('en-IN')}`}
          change="Inventory Surge"
          isPositive={false}
          subtitle="vs last month"
          icon={Receipt}
          accentColor="blue"
          badge="Under Budget"
          aiInsight="Inventory spending increased compared with the previous period."
        />

        <StatCard
          title="Alerts & Security"
          value={`${FRAUD_SECURITY_DATA.activeAlertsCount} High Risk`}
          change="₹25,000 Saved"
          isPositive={true}
          subtitle="prevented loss"
          icon={AlertTriangle}
          accentColor="red"
          badge="72% Health"
          aiInsight="1 High Severity duplicate invoice flagged (INV001 ↔ INV002)."
        />
      </div>

      {/* Signature: PROMINENT AI ACTION CENTER */}
      <AiActionCenter onSelectAction={onSelectAction} />

      {/* Two-Column Financial Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cash Position Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                Cash Position & Flow Trend (₹ INR)
              </h3>
              <p className="text-xs text-slate-500">Month-over-month inflow vs outflow analysis</p>
            </div>
            <button 
              onClick={() => setActiveTab('forecast')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Detailed Forecast</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CASH_OVERVIEW.trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="balance" name="Total Cash" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Expense Breakdown Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Expense Breakdown
            </h3>
            <button 
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              View All
            </button>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EXPENSE_OVERVIEW.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {EXPENSE_OVERVIEW.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={expenseChartColors[index % expenseChartColors.length]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            {EXPENSE_OVERVIEW.categoryBreakdown.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: expenseChartColors[idx] }}></span>
                  <span className="text-slate-600 font-medium">{cat.category}</span>
                </div>
                <span className="font-bold text-slate-900">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
