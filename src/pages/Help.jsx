import React from 'react';
import { HelpCircle, FileText, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

export default function Help({ setActiveTab }) {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-1">
        <HelpCircle className="w-5 h-5 text-teal-700" />
        <h1 className="text-2xl font-extrabold text-slate-900">Help & Knowledge Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <BookOpen className="w-6 h-6 text-teal-700" />
          <h3 className="text-sm font-extrabold text-slate-900">Getting Started Guide</h3>
          <p className="text-xs text-slate-500">Learn how connected bank feeds and GST audit automation work together.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <Sparkles className="w-6 h-6 text-teal-700" />
          <h3 className="text-sm font-extrabold text-slate-900">AI Action Center Rules</h3>
          <p className="text-xs text-slate-500">How duplicate invoice detection and anomaly thresholds prioritize tasks.</p>
        </div>

        <div 
          onClick={() => setActiveTab('ai-copilot')}
          className="bg-teal-50/60 p-5 rounded-2xl border border-teal-200 shadow-xs space-y-2 cursor-pointer hover:bg-teal-100/60 transition-colors"
        >
          <MessageSquare className="w-6 h-6 text-teal-700" />
          <h3 className="text-sm font-extrabold text-slate-900">Ask FinGuard Copilot</h3>
          <p className="text-xs text-slate-600">Get instant answers about your ledger and tax deadlines 24/7.</p>
        </div>
      </div>
    </div>
  );
}
