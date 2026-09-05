import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  change, 
  isPositive = true, 
  icon: Icon, 
  badge, 
  aiInsight,
  accentColor = "teal"
}) {
  const accentClasses = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between group">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{title}</span>
          {Icon && (
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${accentClasses[accentColor] || accentClasses.teal}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Value Display */}
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          {badge && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {badge}
            </span>
          )}
        </div>

        {/* Trend or Subtitle */}
        {change && (
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            {isPositive ? (
              <span className="flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {change}
              </span>
            ) : (
              <span className="flex items-center text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200/60">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {change}
              </span>
            )}
            <span className="text-slate-500 text-[11px] font-normal">{subtitle}</span>
          </div>
        )}
      </div>

      {/* AI Mini Insight Footer */}
      {aiInsight && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
          <span className="leading-snug">{aiInsight}</span>
        </div>
      )}
    </div>
  );
}
