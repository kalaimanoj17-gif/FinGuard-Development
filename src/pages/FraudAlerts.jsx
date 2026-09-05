import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Search,
  ArrowRight,
  Check
} from 'lucide-react';
import { FRAUD_SECURITY_DATA, AI_ACTIONS } from '../data/mockData';

export default function FraudAlerts({ onSelectAction }) {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Fraud & Risk Shield</h1>
          </div>
          <p className="text-xs text-slate-500">Autonomous neural threat scanning across supplier payments, duplicate invoices, and account takeovers</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Real-time Risk Sentinel Active</span>
        </div>
      </div>

      {/* Security Posture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Security Score</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{FRAUD_SECURITY_DATA.securityPostureScore}/100</h3>
          <span className="text-[11px] text-amber-700 font-semibold">{FRAUD_SECURITY_DATA.riskLevel}</span>
        </div>

        <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-xs">
          <span className="text-xs text-red-700 font-bold uppercase">Active Anomaly Flags</span>
          <h3 className="text-2xl font-extrabold text-red-800 mt-1">{FRAUD_SECURITY_DATA.activeAlertsCount} High Risk</h3>
          <span className="text-[11px] text-red-700 font-medium">1 Duplicate Inv (INV001 ↔ INV002)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Scanned Invoices</span>
          <h3 className="text-2xl font-extrabold text-teal-800 mt-1">142 Invoices</h3>
          <span className="text-[11px] text-slate-500">Current billing cycle</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-bold uppercase">Prevented Loss Total</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">₹25,000</h3>
          <span className="text-[11px] text-emerald-700 font-medium">Stopped before payout</span>
        </div>
      </div>

      {/* Primary High Risk Alert Card - INV001 ↔ INV002 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Active High-Risk Fraud Alert
        </h3>

        <div className="bg-red-50/60 p-5 rounded-xl border border-red-200 border-l-4 border-l-red-600 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">
                HIGH RISK
              </span>
              <h4 className="text-base font-extrabold text-slate-900">
                Potential Duplicate Invoice: INV001 ↔ INV002
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-medium pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Vendor</span>
                <span className="font-bold text-slate-900">ABC Suppliers</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Amount</span>
                <span className="font-bold text-slate-900">₹25,000</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Invoice Date</span>
                <span className="font-bold text-slate-900">03 Sep 2026</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-900 block mb-1">Why was this flagged?</span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700">
                <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same vendor (ABC Suppliers)</span>
                <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same amount (₹25,000)</span>
                <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same invoice date (03 Sep 2026)</span>
                <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same business (ABC Traders)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectAction(AI_ACTIONS[0])}
            className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Investigate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
