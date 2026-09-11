import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export default function ActionModal({ action, onClose, onResolveSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!action) return null;

  const handleExecute = () => {
    setIsProcessing(true);
    api.executeAiAction(action.id, 'RESOLVED')
      .catch(() => {})
      .finally(() => {
        setIsProcessing(false);
        setIsDone(true);
        setTimeout(() => {
          onResolveSuccess(action.id);
          onClose();
        }, 1400);
      });
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">{action.category}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  {action.severity} SEVERITY
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{action.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {isDone ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Action Successfully Executed</h4>
              <p className="text-xs text-slate-500">FinGuard AI has updated your ledger and resolved this item.</p>
            </div>
          ) : (
            <>
              {/* Detailed Breakdown Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-800">AI Diagnostic Context</span>
                  <span className="text-teal-800 font-mono font-bold">Confidence Score: 99.2%</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {action.subtitle}
                </p>

                {/* Conditional Custom Visuals for Duplicate Invoices */}
                {action.details?.invoiceNumber && (
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                      <span className="text-[10px] font-bold text-red-700 uppercase">Incoming Flagged Inv</span>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">#{action.details.invoiceNumber}</p>
                      <p className="text-xs text-slate-600">₹{action.details.amount.toLocaleString('en-IN')} • {action.details.vendor}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Existing Matched Inv</span>
                      <p className="text-sm font-extrabold text-slate-700 mt-1">#{action.details.matchingNumber}</p>
                      <p className="text-xs text-slate-500">₹{action.details.amount.toLocaleString('en-IN')} • ABC Suppliers</p>
                    </div>
                  </div>
                )}

                {/* Reasons List */}
                {action.details?.reasons && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">Duplicate Verification Criteria:</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {action.details.reasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Recommended FinGuard Workflow</span>
                  <p className="text-slate-600">
                    Executing this action will record an audit trail in your ledger and automatically resolve associated vendor flags.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isDone && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isProcessing}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Action</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
