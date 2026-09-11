import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Search,
  Building2,
  Check,
  X,
  HelpCircle
} from 'lucide-react';
import { TRANSACTIONS_LIST, INVOICES_LIST } from '../data/mockData';
import { api } from '../services/api';

export default function Reconciliation() {
  const [reconciledState, setReconciledState] = useState(false);
  const [mismatchState, setMismatchState] = useState('pending'); // 'pending' | 'investigating' | 'resolved'

  const handleConfirmMatch = () => {
    api.reconcileTransaction('TXN001')
      .then(() => setReconciledState(true))
      .catch(() => setReconciledState(true));
  };


  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">Bank Feed Reconciliation</h1>
          </div>
          <p className="text-xs text-slate-500">
            Xero-inspired connected ledger matching with 98% AI Match Confidence reasoning
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>AI Auto-Match Engine Active</span>
        </div>
      </div>

      {/* Primary 1-Click Interactive Match Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              AI MATCH SUGGESTION #1
            </span>
            <span className="text-xs text-slate-400 font-mono">TXN001 ↔ INV001</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            98% Match Confidence
          </span>
        </div>

        {reconciledState ? (
          <div className="py-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Transaction Reconciled Successfully!</h3>
            <p className="text-xs text-slate-600">
              TXN001 (₹25,000) matched with Invoice INV001 (ABC Suppliers). Ledger updated.
            </p>
            <button 
              onClick={() => setReconciledState(false)}
              className="text-xs text-teal-700 font-semibold hover:underline mt-2 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Match</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Bank Transaction Line */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Bank Feed Debit (ABC Traders Account)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900">ABC Suppliers</span>
                <span className="text-lg font-mono font-extrabold text-slate-900">₹25,000</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                <span>Date: 03 Sep 2026</span>
                <span className="font-mono">Ref: TXN001</span>
              </div>
            </div>

            {/* Right: AI Suggested Invoice Match */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2 relative">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                AI Suggested Ledger Invoice
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900 block">Invoice INV001</span>
                  <span className="text-xs text-slate-600">ABC Suppliers</span>
                </div>
                <span className="text-lg font-mono font-extrabold text-teal-800">₹25,000</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-teal-200 text-[11px] text-teal-800 font-semibold">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Same vendor</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Same amount</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Same date</span>
              </div>
            </div>
          </div>
        )}

        {!reconciledState && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
              Reject Match
            </button>
            <button className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors">
              Investigate
            </button>
            <button 
              onClick={handleConfirmMatch}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm Match</span>
            </button>
          </div>
        )}
      </div>

      {/* Mismatch Example Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              DEMO MISMATCH EXAMPLE
            </span>
            <span className="text-xs text-slate-400 font-mono">TXN004 ↔ INV005</span>
          </div>
          <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Amount Differs by ₹3,000
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Bank Transaction Line</span>
            <div className="flex items-center justify-between text-slate-900 font-extrabold text-sm">
              <span>Unmapped Supplier Wire</span>
              <span>₹28,000</span>
            </div>
            <span className="text-slate-400 text-[10px] block">Date: 28 Aug 2026 • TXN004</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Matched Invoice Record</span>
            <div className="flex items-center justify-between text-slate-900 font-extrabold text-sm">
              <span>Invoice INV005 (Starlight Trade)</span>
              <span>₹25,000</span>
            </div>
            <p className="text-amber-800 text-[11px] font-medium pt-1">
              AI Explanation: Bank line contains ₹28,000 debit whereas invoice INV005 is recorded for ₹25,000.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button className="px-5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Investigate Variance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
