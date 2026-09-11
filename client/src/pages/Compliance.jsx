import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Download, 
  Clock, 
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';
import { COMPLIANCE_DATA, BUSINESS_PROFILE } from '../data/mockData';
import { api } from '../services/api';

export default function Compliance({ onSelectAction }) {
  const [reportGenerated, setReportGenerated] = useState(false);
  const [complianceData, setComplianceData] = useState(COMPLIANCE_DATA);

  const fetchCompliance = () => {
    api.getCompliance()
      .then(res => {
        if (res) setComplianceData(res);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCompliance();
    const interval = setInterval(fetchCompliance, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileGst = () => {
    api.fileGst()
      .then(res => {
        setReportGenerated(true);
        fetchCompliance();
      })
      .catch(() => setReportGenerated(true));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">GST & Tax Compliance</h1>
          </div>
          <p className="text-xs text-slate-500">Automated GST filing readiness, return verification & tax payment monitoring</p>
        </div>
        <button 
          onClick={() => setReportGenerated(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Report</span>
        </button>
      </div>

      {reportGenerated && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>AI Compliance Audit Report generated for Q2 FY 2026-27 (Ref #REP-GST-72)</span>
          </div>
          <button onClick={() => setReportGenerated(false)} className="text-slate-500 hover:text-slate-900 text-xs">Dismiss</button>
        </div>
      )}

      {/* Compliance Score Gauge Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0">
            {complianceData.complianceScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Compliance Score: {complianceData.complianceScore} / 100</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                {complianceData.riskLevel} RISK
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Score derived from GST filing timelines, tax liability clearing, and audit trails.
            </p>
          </div>
        </div>

        {/* AI Compliance Recommendation Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md space-y-1">
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            AI Compliance Recommendation
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            "{complianceData.recommendation}"
          </p>
        </div>
      </div>

      {/* Primary Compliance Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase">GST Filing Status</span>
          <h3 className="text-lg font-extrabold text-amber-700">{complianceData.gstFilingStatus}</h3>
          <p className="text-[11px] font-bold text-slate-700">Due Date: {complianceData.gstDueDate}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase">Income Tax Filing</span>
          <h3 className="text-lg font-extrabold text-emerald-700">{complianceData.taxFilingStatus}</h3>
          <p className="text-[11px] text-slate-500">Filed for FY 2025-26</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase">Tax Payment Status</span>
          <h3 className="text-lg font-extrabold text-amber-700">{complianceData.taxPaymentStatus}</h3>
          <p className="text-[11px] text-slate-500">Last Filing: {complianceData.lastFilingDate}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase">GSTIN Identifier</span>
          <h3 className="text-base font-mono font-bold text-teal-800">{COMPLIANCE_DATA.gstin || BUSINESS_PROFILE.gstin}</h3>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified Active
          </p>
        </div>
      </div>

      {/* Tax Liability Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-teal-700" />
          Tax Liability Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Estimated Output Tax</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">₹63,400</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Input Tax Credit (ITC)</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">-₹18,400</p>
          </div>
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
            <span className="text-xs text-teal-800 font-bold">Estimated Net Tax Payable</span>
            <p className="text-2xl font-extrabold text-teal-800 mt-1">₹{COMPLIANCE_DATA.taxLiability.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Historical Filings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h4 className="text-sm font-bold text-slate-900">Historical GST Filings & Compliance Audit Logs</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Tax Period</th>
                <th className="p-4">GSTR-1 Reference</th>
                <th className="p-4">GSTR-3B Reference</th>
                <th className="p-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {COMPLIANCE_DATA.filingHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{item.period}</td>
                  <td className="p-4 font-mono text-teal-800">{item.gstr1}</td>
                  <td className="p-4 font-mono text-emerald-700">{item.gstr3b}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                      {item.status}
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
