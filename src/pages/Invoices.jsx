import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Download, 
  Sparkles,
  ShieldAlert,
  Check,
  Zap,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { INVOICES_LIST, INVOICE_OVERVIEW } from '../data/mockData';

export default function Invoices({ onOpenCreateInvoice, invoicesList, onSelectAction }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'HIGH-RISK' | 'PENDING' | 'PAID'
  const [toastMessage, setToastMessage] = useState(null);
  const [nudging, setNudging] = useState(false);

  const displayList = invoicesList || INVOICES_LIST;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAutoNudgeAll = () => {
    setNudging(true);
    setTimeout(() => {
      setNudging(false);
      showToast('⚡ AI Smart Nudges transmitted to 2 high-risk accounts');
    }, 1200);
  };

  const filtered = displayList.filter(inv => {
    const matchesSearch = (inv.customer || '').toLowerCase().includes(search.toLowerCase()) || 
                          (inv.id || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'HIGH-RISK') return inv.status === 'Flagged Duplicate' || inv.status === 'Overdue' || (inv.aiRisk && inv.aiRisk.includes('HIGH'));
    if (statusFilter === 'PENDING') return inv.status === 'Pending';
    if (statusFilter === 'PAID') return inv.status === 'Paid';
    return true;
  });

  // Calculate summary totals
  const totalOutstanding = displayList
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const highRiskTotal = displayList
    .filter(i => i.status === 'Flagged Duplicate' || i.status === 'Overdue')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const next7DaysTotal = displayList
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  return (
    <div className="space-y-6 pb-20 font-sans text-slate-100">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              AUTONOMOUS RECEIVABLES
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase font-semibold">Live Sync</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Invoice Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">Continuous behavioral scoring, fraud telemetry, and automated AI collection nudges</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateInvoice}
            className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Smart Invoice</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Total Outstanding (Span 2 on Desktop) */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-[#131b2e] border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Total Outstanding</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                +8.4% MoM
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400">INR</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Avg. Turnaround: <strong className="text-sky-400 font-semibold">14.2 Days</strong></span>
            </div>
            <span className="text-emerald-400 font-medium text-[11px]">{displayList.filter(i => i.status !== 'Paid').length} Active Invoices</span>
          </div>
        </div>

        {/* Card 2: Next 7 Days (Expected Inflow) */}
        <div className="rounded-2xl bg-[#171f33] border border-slate-800 p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono uppercase font-semibold tracking-wider text-slate-300">Next 7 Days</span>
            </div>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-white block">₹{next7DaysTotal.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-emerald-400 font-medium">1 client transfer scheduled</span>
          </div>

          {/* Sparkline curve */}
          <div className="w-full pt-1">
            <svg className="w-full h-8 stroke-emerald-400 fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path d="M0,18 Q20,20 35,12 T70,14 T100,4"></path>
            </svg>
          </div>
        </div>

        {/* Card 3: At-Risk Delay */}
        <div className="rounded-2xl bg-[#171f33] border border-slate-800 p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-semibold tracking-wider">At-Risk Delay</span>
            </div>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-rose-400 block">₹{highRiskTotal.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-rose-300 font-medium">2 accounts flagged for review</span>
          </div>

          {/* Warning sparkline */}
          <div className="w-full pt-1">
            <svg className="w-full h-8 stroke-rose-400 fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path d="M0,8 Q25,6 45,18 T75,12 T100,22"></path>
            </svg>
          </div>
        </div>

      </div>

      {/* AI Liquidity Guardian Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#222a3d] border border-slate-700/80 p-5 shadow-xl space-y-4">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-white">AI Liquidity Guardian</h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-semibold">
                84% Drift Risk
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              2 invoices show historical settlement lag. Automated behavioral nudges have been synthesized and optimized for response rate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAutoNudgeAll}
            disabled={nudging}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {nudging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-slate-950" />}
            <span>{nudging ? 'Transmitting AI Nudges...' : 'Review & Auto-Nudge'}</span>
          </button>
          <button 
            onClick={() => showToast('Filter parameters adjusted')}
            className="p-2.5 rounded-xl bg-[#171f33] text-slate-300 hover:text-white border border-slate-700 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Pill Segmented Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: `All Invoices (${displayList.length})` },
            { id: 'HIGH-RISK', label: 'High Risk (2)', badge: 'bg-rose-500' },
            { id: 'PENDING', label: `Pending (${displayList.filter(i => i.status === 'Pending').length})` },
            { id: 'PAID', label: `Paid (${displayList.filter(i => i.status === 'Paid').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-emerald-400 text-slate-950 shadow-md font-bold'
                  : 'bg-[#171f33] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {tab.badge && <span className={`w-2 h-2 rounded-full ${tab.badge}`}></span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor or invoice ID..."
            className="w-full bg-[#131b2e] border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

      </div>

      {/* Invoice Bento Cards List */}
      <div className="space-y-4">
        {filtered.map(inv => {
          const isDuplicate = inv.status === 'Flagged Duplicate';
          const isOverdue = inv.status === 'Overdue';
          const isHighRisk = isDuplicate || isOverdue;

          return (
            <div 
              key={inv.id}
              className={`rounded-2xl border p-5 shadow-xl space-y-4 transition-all ${
                isDuplicate 
                  ? 'bg-[#131b2e] border-rose-900/80 hover:border-rose-700' 
                  : isOverdue 
                  ? 'bg-[#131b2e] border-amber-900/60 hover:border-amber-700' 
                  : 'bg-[#131b2e] border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    isDuplicate ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {inv.customer ? inv.customer.substring(0, 2).toUpperCase() : 'INV'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-white truncate">{inv.customer}</h4>
                      {inv.status === 'Paid' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block truncate">
                      {inv.paymentTerms || 'Standard Invoice'} • <strong className="font-mono text-slate-300">#{inv.id}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-white block">₹{inv.amount.toLocaleString('en-IN')}</span>
                  <span className={`text-[11px] font-semibold ${
                    isDuplicate ? 'text-rose-400' : isOverdue ? 'text-amber-400' : inv.status === 'Paid' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {isDuplicate ? 'Flagged Duplicate' : isOverdue ? 'Overdue' : inv.status === 'Paid' ? 'Cleared & Settled' : `Due: ${inv.dueDate}`}
                  </span>
                </div>
              </div>

              {/* Risk Meter & Telemetry Block */}
              {isHighRisk && (
                <div className="rounded-xl bg-[#0b1326] p-3.5 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      <span className="font-mono font-bold text-rose-400 text-[11px] uppercase tracking-wide">
                        {isDuplicate ? 'Duplicate Submission Risk: 99% (High)' : 'Payment Delay Risk: 76% (Moderate)'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">ML Confidence 94%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isDuplicate ? 'bg-rose-500 w-[99%]' : 'bg-amber-400 w-[76%]'}`}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-300 pt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {isDuplicate 
                        ? 'Same vendor (ABC Suppliers), amount (₹25,000), and date (03 Sep 2026) submitted.' 
                        : 'Consistent payment delay pattern detected across last 2 quarters.'}
                    </span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {isDuplicate ? (
                  <>
                    <button
                      onClick={() => onSelectAction({
                        id: 'action-1',
                        severity: 'HIGH',
                        title: `Duplicate Invoice Flagged: ${inv.id}`,
                        subtitle: `ABC Suppliers submitted duplicate invoice matching INV001.`,
                        category: 'Fraud & Risk',
                        actionType: 'Review Action',
                        details: {
                          vendor: inv.customer,
                          invoiceNumber: inv.id,
                          matchingNumber: 'INV001',
                          amount: inv.amount
                        }
                      })}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Review Duplicate Action</span>
                    </button>
                    <button
                      onClick={() => showToast(`Early Pay 2% offer sent to ${inv.customer}`)}
                      className="py-2 px-3 rounded-xl bg-[#222a3d] hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700"
                    >
                      <span>Offer 2% Early Pay</span>
                    </button>
                  </>
                ) : isOverdue ? (
                  <>
                    <button
                      onClick={() => showToast(`AI Smart Nudge transmitted to ${inv.customer}`)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send AI Smart Nudge</span>
                    </button>
                    <button
                      onClick={() => showToast(`SMS ping sent to AP lead for ${inv.customer}`)}
                      className="py-2 px-3 rounded-xl bg-[#222a3d] hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700"
                    >
                      <span>Send SMS Ping</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-slate-400 bg-[#0b1326] px-3 py-2 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {inv.status === 'Paid' ? 'Settled via Bank Direct Wire' : 'On-Track (98% Reliability) Auto-Debit Scheduled'}
                    </span>
                    <button 
                      onClick={() => showToast(`Downloading receipt JSON for ${inv.id}`)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Quick Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%]">
        <div className="rounded-2xl bg-[#1d263b]/95 backdrop-blur-md border border-slate-700 p-3 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block leading-none">AI Shield Pre-Scan</span>
              <span className="text-[10px] text-emerald-400 font-mono">Zero Spoofing Detected</span>
            </div>
          </div>

          <button
            onClick={onOpenCreateInvoice}
            className="py-2 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Smart Invoice</span>
          </button>
        </div>
      </div>

    </div>
  );
}
