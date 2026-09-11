import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { REPORTS_DATA } from '../data/mockData';
import { api } from '../services/api';

export default function Reports() {
  const [aiSummaryGenerated, setAiSummaryGenerated] = useState(false);
  const [reportsList, setReportsList] = useState(REPORTS_DATA);

  const fetchReports = () => {
    api.getReports()
      .then(res => {
        if (res && res.reports) {
          setReportsList(res.reports);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = () => {
    api.generateReport({
      title: "Quarterly Executive Audit",
      type: "Audit",
      period: "Q2 FY 2026-27"
    })
    .then(() => {
      setAiSummaryGenerated(true);
      fetchReports();
    })
    .catch(() => setAiSummaryGenerated(true));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">Financial Reports & Analytics</h1>
          </div>
          <p className="text-xs text-slate-500">Executive financial statements, tax reporting, and automated AI summary generation</p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Summary</span>
        </button>
      </div>

      {/* AI Executive Summary Banner */}
      {aiSummaryGenerated && (
        <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-[10px]">
                LIVE AI EXECUTIVE SUMMARY
              </span>
              <span className="text-xs font-bold text-slate-900">Q2 FY 2026-27 Performance Snapshot</span>
            </div>
            <button onClick={() => setAiSummaryGenerated(false)} className="text-xs text-slate-400 hover:text-slate-700">Dismiss</button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pt-1">
            "ABC Traders maintained strong cash stability with net liquidity at ₹1,85,000. Operating cash flow improved by 14% month-over-month. Recommended focus areas include settling GST filing due 10 Sep 2026 and resolving duplicate invoice INV002."
          </p>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep) => (
          <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold text-[10px]">
                  {rep.type}
                </span>
                <span className="text-slate-400 font-medium">{rep.period}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{rep.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard business accounting report prepared with live ledger balances.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {rep.status}
              </span>
              <button className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1">
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
