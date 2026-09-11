import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  ArrowRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { AI_ACTIONS } from '../data/mockData';
import { api } from '../services/api';

export default function AiActionCenterPage({ onSelectAction }) {
  const [actionsList, setActionsList] = useState(AI_ACTIONS);

  const fetchActions = () => {
    api.getAiActions()
      .then(res => {
        if (res && res.actions) {
          setActionsList(res.actions);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">What Should I Do Today?</h1>
          </div>
          <p className="text-xs text-slate-500">
            Dedicated AI task priorization center for small business owners
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>{actionsList.length} Priority Action(s) Ready</span>
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {actionsList.map((action) => (

          <div 
            key={action.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  action.severity === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' :
                  action.severity === 'IMPORTANT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-teal-50 text-teal-800 border border-teal-200'
                }`}>
                  {action.severity} PRIORITY
                </span>
                <span className="text-xs font-mono text-slate-400">{action.category}</span>
              </div>
              {action.potentialSaving && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Financial Impact: {action.potentialSaving}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{action.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{action.subtitle}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block">AI Reasoning & Next Step</span>
              <p className="text-slate-700">
                {action.details?.recommendation || action.details?.issue || 'Review ledger details before confirming execution.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => onSelectAction(action)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>{action.actionType} Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
