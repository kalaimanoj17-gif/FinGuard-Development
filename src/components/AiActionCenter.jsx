import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Zap, 
  Filter
} from 'lucide-react';
import { AI_ACTIONS } from '../data/mockData';

export default function AiActionCenter({ onSelectAction }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [handledActions, setHandledActions] = useState([]);

  const filteredActions = AI_ACTIONS.filter(action => {
    if (handledActions.includes(action.id)) return false;
    if (activeFilter === 'ALL') return true;
    return action.severity === activeFilter;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            HIGH PRIORITY
          </span>
        );
      case 'IMPORTANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            IMPORTANT
          </span>
        );
      case 'WATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            WATCH
          </span>
        );
      default:
        return null;
    }
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setHandledActions(prev => [...prev, id]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
      {/* Action Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-teal-100 border border-teal-200 text-teal-800">
              <Zap className="w-5 h-5 text-teal-700" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              AI ACTION CENTER
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold">
                Prioritized Recommendations
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Prioritized recommendations based on your real-time financial data.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl">
          {['ALL', 'HIGH', 'IMPORTANT', 'WATCH'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-white text-teal-800 border border-slate-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Action List */}
      {filteredActions.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-80" />
          <h4 className="text-sm font-bold text-slate-900">All prioritized AI actions cleared!</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            FinGuard AI is monitoring incoming bank feeds, supplier receipts, and GST ledgers 24/7.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActions.map(action => (
            <div 
              key={action.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-300 transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xs group"
            >
              {/* Left Details */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  {getSeverityBadge(action.severity)}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {action.category}
                  </span>
                  {action.potentialSaving && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Impact: {action.potentialSaving}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto lg:ml-0">
                    <Clock className="w-3 h-3" />
                    {action.timeDetected}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {action.subtitle}
                </p>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  onClick={(e) => handleDismiss(action.id, e)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Snooze
                </button>
                <button
                  onClick={() => onSelectAction(action)}
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all flex items-center gap-2 shadow-xs"
                >
                  <span>{action.actionType}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
