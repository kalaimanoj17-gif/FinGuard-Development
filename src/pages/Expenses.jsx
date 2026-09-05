import React, { useState } from 'react';
import { 
  Receipt, 
  Upload, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  DollarSign,
  Sliders
} from 'lucide-react';
import { EXPENSES_LIST, EXPENSE_OVERVIEW } from '../data/mockData';

export default function Expenses({ onOpenUploadExpense, expensesList }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = expensesList.filter(exp => {
    if (selectedCategory === 'ALL') return true;
    return exp.category === selectedCategory;
  });

  const categoryColors = ["#0d9488", "#2563eb", "#6366f1", "#16a34a", "#d97706"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Expenses & Spend Control</h1>
          </div>
          <p className="text-xs text-slate-500">Automated receipt OCR extraction, anomaly detection, and budget tracking</p>
        </div>
        <button
          onClick={onOpenUploadExpense}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Receipt & Scan OCR</span>
        </button>
      </div>

      {/* AI SPEND INSIGHT Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0">
          <Sparkles className="w-5 h-5 text-teal-700" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">AI SPEND INSIGHT</span>
          <p className="text-xs font-bold text-slate-900">
            "{EXPENSE_OVERVIEW.spendInsight}"
          </p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {EXPENSE_OVERVIEW.categoryBreakdown.map((cat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">{cat.category}</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[idx] }}></span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">₹{cat.amount.toLocaleString('en-IN')}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: categoryColors[idx] }}></div>
            </div>
            <span className="text-[10px] text-slate-400 block">{cat.percentage}% of monthly spend</span>
          </div>
        ))}
      </div>

      {/* SPENDING CONTROLS Configuration Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-700" />
            SPENDING CONTROLS (Configurable Demo Settings)
          </span>
          <span className="text-[10px] font-mono text-slate-400">Rule Engine Active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Single Expense Limit</span>
            <span className="text-base font-extrabold text-slate-900">₹{EXPENSE_OVERVIEW.spendingControls.singleLimit.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Inventory Budget</span>
            <span className="text-base font-extrabold text-slate-900">₹{EXPENSE_OVERVIEW.spendingControls.monthlyInventoryBudget.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Review Required Above</span>
            <span className="text-base font-extrabold text-teal-800">₹{EXPENSE_OVERVIEW.spendingControls.reviewRequiredAbove.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Expense Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Category Filter:</span>
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'Inventory', 'Operations', 'Transport', 'Software', 'Utilities'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-100 text-teal-800 border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Expense Ref</th>
                <th className="p-4">Vendor / Merchant</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Amount (₹)</th>
                <th className="p-4">Date</th>
                <th className="p-4">Receipt Status</th>
                <th className="p-4">AI Anomaly Status</th>
                <th className="p-4">Approval State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-800">{exp.id}</td>
                  <td className="p-4 font-semibold text-slate-900">{exp.vendor}</td>
                  <td className="p-4 text-slate-500">{exp.category}</td>
                  <td className="p-4 text-right font-extrabold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-500">{exp.date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                      {exp.receipt}
                    </span>
                  </td>
                  <td className="p-4">
                    {exp.aiStatus.includes('Flagged') || exp.aiStatus.includes('Surge') ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        {exp.aiStatus}
                      </span>
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      exp.approval === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {exp.approval}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
