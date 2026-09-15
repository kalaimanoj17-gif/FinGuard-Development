import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportsList, setReportsList] = useState([]);
  const [profitLossData, setProfitLossData] = useState(null);
  const [cashFlowData, setCashFlowData] = useState(null);
  const [expenseReportData, setExpenseReportData] = useState(null);
  const [gstTaxData, setGstTaxData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  const [aiSummaryGenerated, setAiSummaryGenerated] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [selectedModalReport, setSelectedModalReport] = useState(null); // 'profit-loss' | 'cash-flow' | 'expenses' | 'gst-tax'
  const [modalLoading, setModalLoading] = useState(false);

  const fetchAllReports = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      api.getReports().catch(err => {
        console.error("Failed to load /api/reports:", err);
        return null;
      }),
      api.getProfitLossReport('B001').catch(err => {
        console.error("Failed to load profit loss report:", err);
        return null;
      }),
      api.getCashFlowReport('B001').catch(err => {
        console.error("Failed to load cash flow report:", err);
        return null;
      }),
      api.getExpenseReport('B001').catch(err => {
        console.error("Failed to load expense report:", err);
        return null;
      }),
      api.getGstTaxReport('B001').catch(err => {
        console.error("Failed to load gst tax report:", err);
        return null;
      }),
      api.getReportSummary('B001').catch(err => {
        console.error("Failed to load report summary:", err);
        return null;
      })
    ])
      .then(([repRes, pl, cf, exp, gst, sum]) => {
        if (!repRes && !pl && !cf && !exp && !gst) {
          throw new Error("Unable to load report. Please try again.");
        }
        if (repRes && repRes.reports) {
          setReportsList(repRes.reports);
        }
        if (pl) setProfitLossData(pl);
        if (cf) setCashFlowData(cf);
        if (exp) setExpenseReportData(exp);
        if (gst) setGstTaxData(gst);
        if (sum) setSummaryData(sum);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reports from backend:", err);
        setError("Unable to load report. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  const handleViewReport = (reportType) => {
    setSelectedModalReport(reportType);
    setModalLoading(true);
    if (reportType === 'profit-loss') {
      api.getProfitLossReport('B001')
        .then((res) => {
          setProfitLossData(res);
          setModalLoading(false);
        })
        .catch((err) => {
          console.error("Error loading Profit & Loss report:", err);
          setModalLoading(false);
        });
    } else if (reportType === 'cash-flow') {
      api.getCashFlowReport('B001')
        .then((res) => {
          setCashFlowData(res);
          setModalLoading(false);
        })
        .catch((err) => {
          console.error("Error loading Cash Flow report:", err);
          setModalLoading(false);
        });
    } else if (reportType === 'expenses') {
      api.getExpenseReport('B001')
        .then((res) => {
          setExpenseReportData(res);
          setModalLoading(false);
        })
        .catch((err) => {
          console.error("Error loading Expense Breakdown report:", err);
          setModalLoading(false);
        });
    } else if (reportType === 'gst-tax') {
      api.getGstTaxReport('B001')
        .then((res) => {
          setGstTaxData(res);
          setModalLoading(false);
        })
        .catch((err) => {
          console.error("Error loading GST & Tax report:", err);
          setModalLoading(false);
        });
    }
  };

  const handleGenerateAiSummary = () => {
    setAiSummaryLoading(true);
    api.getReportSummary('B001')
      .then((res) => {
        setSummaryData(res);
        setAiSummaryGenerated(true);
        setAiSummaryLoading(false);
      })
      .catch(() => {
        setAiSummaryGenerated(true);
        setAiSummaryLoading(false);
      });
  };

  const handleDownloadReport = (reportType) => {
    api.downloadReport(reportType)
      .then((res) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `FinGuard_${reportType}_Report.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      })
      .catch((err) => {
        alert("Failed to download report file: " + err.message);
      });
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-teal-700 animate-pulse" />
          <h1 className="text-2xl font-extrabold text-slate-900">Financial Reports & Analytics</h1>
        </div>
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-teal-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">Financial Reports & Analytics</h1>
        </div>
        <div className="bg-rose-50 p-8 rounded-2xl border border-rose-200 text-rose-800 flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="w-10 h-10 text-rose-600" />
          <div>
            <h3 className="text-base font-extrabold">{error}</h3>
          </div>
          <button
            onClick={fetchAllReports}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const plReportMeta = reportsList.find(r => r.id === 'rep-1' || r.type === 'Financial') || {
    period: profitLossData?.period || "Q2 FY 2026-27",
    status: profitLossData?.status || "Generated",
    type: "Financial"
  };

  const cfReportMeta = reportsList.find(r => r.id === 'rep-2' || r.type === 'Cashflow') || {
    period: cashFlowData?.period || "August 2026",
    status: cashFlowData?.status || "Generated",
    type: "Cashflow"
  };

  const expReportMeta = reportsList.find(r => r.id === 'rep-3' || r.type === 'Spend') || {
    period: expenseReportData?.period || "August 2026",
    status: expenseReportData?.status || "Generated",
    type: "Spend"
  };

  const gstReportMeta = reportsList.find(r => r.id === 'rep-4' || r.type === 'Tax') || {
    period: gstTaxData?.period || "Q2 FY 2026-27",
    status: gstTaxData?.status || "Pending Filing",
    type: "Tax"
  };

  const formatMargin = (val) => {
    if (val === undefined || val === null) return "57.48%";
    if (typeof val === 'number') return `${val}%`;
    if (typeof val === 'string') return val.endsWith('%') ? val : `${val}%`;
    return `${val}%`;
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
          onClick={handleGenerateAiSummary}
          disabled={aiSummaryLoading}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{aiSummaryLoading ? 'Analyzing Ledger...' : 'Generate AI Summary'}</span>
        </button>
      </div>

      {/* AI Executive Summary Banner */}
      {aiSummaryGenerated && summaryData && (
        <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-[10px]">
                LIVE AI EXECUTIVE SUMMARY
              </span>
              <span className="text-xs font-bold text-slate-900">{summaryData.period} Performance Snapshot</span>
            </div>
            <button onClick={() => setAiSummaryGenerated(false)} className="text-xs text-slate-400 hover:text-slate-700">Dismiss</button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            "{summaryData.summaryText}"
          </p>
          {summaryData.recommendations && summaryData.recommendations.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">AI Prioritized Action Items:</span>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                {summaryData.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 1. Profit & Loss Statement Card */}
        {profitLossData && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold text-[10px]">
                  {plReportMeta.type || 'Financial'}
                </span>
                <span className="text-slate-400 font-medium">{plReportMeta.period || profitLossData.period}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Profit & Loss Statement</h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard business accounting report prepared with live ledger balances.
              </p>

              {/* Data Summary Pill Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Revenue</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    ₹{(profitLossData.summary?.totalIncome ?? profitLossData.totalIncome ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Profit</span>
                  <span className={`text-sm font-extrabold ${(profitLossData.summary?.netProfit ?? profitLossData.netProfit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ₹{(profitLossData.summary?.netProfit ?? profitLossData.netProfit ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Profit Margin:</span>
                  <span className="text-xs font-bold text-teal-700">
                    {formatMargin(profitLossData.summary?.profitMargin ?? profitLossData.profitMargin)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {plReportMeta.status || profitLossData.status || 'Generated'}
              </span>
              <button 
                onClick={() => handleViewReport('profit-loss')}
                className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Cash Flow Statement Card */}
        {cashFlowData && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold text-[10px]">
                  {cfReportMeta.type || 'Cashflow'}
                </span>
                <span className="text-slate-400 font-medium">{cfReportMeta.period || cashFlowData.period}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Cash Flow Statement</h3>
              <p className="text-xs text-slate-500 mt-1">
                Operating cash movements, expected target comparison, and liquidity health.
              </p>

              {/* Data Summary Pill Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Actual Income</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    ₹{cashFlowData.actualIncome?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Cash Flow</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    ₹{cashFlowData.actualNetCashFlow?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Cash Flow Trend:</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {cashFlowData.cashFlowTrend} ({cashFlowData.cashFlowChangePercentage})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {cfReportMeta.status || cashFlowData.status || 'Generated'}
              </span>
              <button 
                onClick={() => handleViewReport('cash-flow')}
                className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Expense Breakdown Report Card */}
        {expenseReportData && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold text-[10px]">
                  {expReportMeta.type || 'Spend'}
                </span>
                <span className="text-slate-400 font-medium">{expReportMeta.period || expenseReportData.period}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Expense Breakdown Report</h3>
              <p className="text-xs text-slate-500 mt-1">
                Detailed category spending breakdown, inventory purchases, and operational costs.
              </p>

              {/* Data Summary Pill Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Expenses</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    ₹{expenseReportData.totalExpenses?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stock Spending</span>
                  <span className="text-sm font-extrabold text-teal-700">
                    ₹{expenseReportData.stockPurchaseSpending?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Highest Category:</span>
                  <span className="text-xs font-bold text-slate-800">{expenseReportData.highestExpenseCategory}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {expReportMeta.status || expenseReportData.status || 'Generated'}
              </span>
              <button 
                onClick={() => handleViewReport('expenses')}
                className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. GST & Tax Summary Card */}
        {gstTaxData && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold text-[10px]">
                  {gstReportMeta.type || 'Tax'}
                </span>
                <span className="text-slate-400 font-medium">{gstReportMeta.period || gstTaxData.period}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">GST & Tax Summary</h3>
              <p className="text-xs text-slate-500 mt-1">
                GST return status, tax compliance health score, and action-required items.
              </p>

              {/* Data Summary Pill Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GST Status</span>
                  <span className={`text-sm font-extrabold ${gstTaxData.gstFilingStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {gstTaxData.gstFilingStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Compliance Score</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {gstTaxData.complianceScore}/100
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">GST Return Due:</span>
                  <span className="text-xs font-bold text-rose-600">{gstTaxData.gstDueDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-xs font-semibold flex items-center gap-1 ${gstTaxData.gstFilingStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {gstTaxData.gstFilingStatus === 'Completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                )}
                {gstReportMeta.status || (gstTaxData.gstFilingStatus === 'Completed' ? 'Filed' : 'Pending Filing')}
              </span>
              <button 
                onClick={() => handleViewReport('gst-tax')}
                className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* DETAILED REPORT MODAL DIALOG */}
      {selectedModalReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-teal-400 tracking-wider">
                  FinGuard Audit Module • Business ID: {profitLossData?.businessId || 'B001'}
                </span>
                <h2 className="text-lg font-extrabold mt-0.5">
                  {selectedModalReport === 'profit-loss' && 'Profit & Loss Detailed Report'}
                  {selectedModalReport === 'cash-flow' && 'Cash Flow Statement Detailed Report'}
                  {selectedModalReport === 'expenses' && 'Expense Breakdown Detailed Report'}
                  {selectedModalReport === 'gst-tax' && 'GST & Tax Summary Detailed Report'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReport(selectedModalReport)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => setSelectedModalReport(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {modalLoading ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 border-3 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-slate-500">Loading details...</p>
                </div>
              ) : (
                <>
                  {/* 1. Profit & Loss Details */}
                  {selectedModalReport === 'profit-loss' && profitLossData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Revenue</span>
                          <span className="text-base font-extrabold text-slate-900">
                            ₹{(profitLossData.summary?.totalIncome ?? profitLossData.totalIncome ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Expenses</span>
                          <span className="text-base font-extrabold text-slate-900">
                            ₹{(profitLossData.summary?.totalExpenses ?? profitLossData.totalExpenses ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Profit</span>
                          <span className={`text-base font-extrabold ${(profitLossData.summary?.netProfit ?? profitLossData.netProfit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            ₹{(profitLossData.summary?.netProfit ?? profitLossData.netProfit ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Profit Margin</span>
                          <span className="text-base font-extrabold text-teal-700">
                            {formatMargin(profitLossData.summary?.profitMargin ?? profitLossData.profitMargin)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Income Streams</h4>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                          {(profitLossData.incomeStreams || []).map((st, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700">{st.stream}</span>
                              <span className="font-mono font-bold text-slate-900">₹{st.amount?.toLocaleString('en-IN')} ({st.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Expense Line Items</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 font-bold text-slate-600">ID</th>
                                <th className="p-2.5 font-bold text-slate-600">Vendor</th>
                                <th className="p-2.5 font-bold text-slate-600">Category</th>
                                <th className="p-2.5 font-bold text-slate-600">Date</th>
                                <th className="p-2.5 font-bold text-slate-600 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(profitLossData.expenseBreakdown || []).map((e) => (
                                <tr key={e.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-mono text-slate-500">{e.id}</td>
                                  <td className="p-2.5 font-semibold text-slate-800">{e.vendor}</td>
                                  <td className="p-2.5 text-slate-600">{e.category}</td>
                                  <td className="p-2.5 font-mono text-slate-500">{e.date}</td>
                                  <td className="p-2.5 font-mono font-bold text-slate-900 text-right">₹{e.amount?.toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Cash Flow Details */}
                  {selectedModalReport === 'cash-flow' && cashFlowData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Actual Income</span>
                          <span className="text-base font-extrabold text-slate-900">₹{cashFlowData.actualIncome?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Actual Expenses</span>
                          <span className="text-base font-extrabold text-slate-900">₹{cashFlowData.actualExpenses?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Cash Flow</span>
                          <span className="text-base font-extrabold text-emerald-700">₹{cashFlowData.actualNetCashFlow?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Trend & Change</span>
                          <span className="text-xs font-extrabold text-amber-600 block">{cashFlowData.cashFlowTrend}</span>
                          <span className="text-[11px] text-slate-500">{cashFlowData.cashFlowChangePercentage} vs target</span>
                        </div>
                      </div>

                      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                        <span className="font-bold block">Cash Target Variance Summary:</span>
                        <p>
                          Expected Net Cash Flow target was ₹{cashFlowData.expectedNetCashFlow?.toLocaleString('en-IN')} (Expected Inflow: ₹{cashFlowData.expectedIncome?.toLocaleString('en-IN')}, Outflow: ₹{cashFlowData.expectedExpenses?.toLocaleString('en-IN')}). Actual Net Cash Flow surpassed expected targets by ₹{Math.abs(cashFlowData.cashFlowChange || 0).toLocaleString('en-IN')}.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Daily Cash Flow Ledger</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 font-bold text-slate-600">Date</th>
                                <th className="p-2.5 font-bold text-slate-600">Daily Inflow</th>
                                <th className="p-2.5 font-bold text-slate-600">Daily Outflow</th>
                                <th className="p-2.5 font-bold text-slate-600 text-right">Net Position</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {(cashFlowData.dailyCashFlow || []).map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-sans font-semibold text-slate-800">{row.date}</td>
                                  <td className="p-2.5 text-emerald-700">+₹{row.income?.toLocaleString('en-IN')}</td>
                                  <td className="p-2.5 text-rose-600">-₹{row.expense?.toLocaleString('en-IN')}</td>
                                  <td className="p-2.5 font-bold text-slate-900 text-right">₹{row.net?.toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Expense Breakdown Details */}
                  {selectedModalReport === 'expenses' && expenseReportData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Expenses</span>
                          <span className="text-base font-extrabold text-slate-900">₹{expenseReportData.totalExpenses?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Category</span>
                          <span className="text-base font-extrabold text-slate-900">{expenseReportData.highestExpenseCategory}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Stock Purchases</span>
                          <span className="text-base font-extrabold text-teal-700">₹{expenseReportData.stockPurchaseSpending?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Operating Costs</span>
                          <span className="text-base font-extrabold text-slate-800">₹{expenseReportData.operatingExpenses?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Category Spend Breakdown</h4>
                        <div className="space-y-2">
                          {(expenseReportData.categoryBreakdown || expenseReportData.expensesByCategory || []).map((cat, i) => (
                            <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-800">{cat.category} ({cat.count} items)</span>
                                <span className="font-mono font-bold text-slate-900">₹{cat.amount?.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-teal-600 h-full rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Expense Ledger Items</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 font-bold text-slate-600">ID</th>
                                <th className="p-2.5 font-bold text-slate-600">Vendor</th>
                                <th className="p-2.5 font-bold text-slate-600">Category</th>
                                <th className="p-2.5 font-bold text-slate-600">Status</th>
                                <th className="p-2.5 font-bold text-slate-600 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(expenseReportData.expensesList || []).map((exp) => (
                                <tr key={exp.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-mono text-slate-500">{exp.id}</td>
                                  <td className="p-2.5 font-semibold text-slate-800">{exp.vendor}</td>
                                  <td className="p-2.5 text-slate-600">{exp.category}</td>
                                  <td className="p-2.5 text-slate-500">{exp.approval}</td>
                                  <td className="p-2.5 font-mono font-bold text-slate-900 text-right">₹{exp.amount?.toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. GST & Tax Details */}
                  {selectedModalReport === 'gst-tax' && gstTaxData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">GSTIN</span>
                          <span className="text-xs font-mono font-bold text-slate-900">{gstTaxData.gstin}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">GST Return Status</span>
                          <span className={`text-sm font-extrabold ${gstTaxData.gstFilingStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {gstTaxData.gstFilingStatus}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">GST Due Date</span>
                          <span className="text-xs font-extrabold text-rose-600">{gstTaxData.gstDueDate}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Compliance Score</span>
                          <span className="text-base font-extrabold text-slate-800">{gstTaxData.complianceScore}/100</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600">Unclaimed Input Tax Credit (ITC):</span>
                          <span className="text-sm font-mono font-bold text-emerald-700">₹{gstTaxData.unclaimedItc?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600">Estimated Tax Liability:</span>
                          <span className="text-sm font-mono font-bold text-rose-700">₹{gstTaxData.taxLiability?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {gstTaxData.actionRequiredItems && gstTaxData.actionRequiredItems.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Pending Tax Action Items</h4>
                          <div className="space-y-2">
                            {gstTaxData.actionRequiredItems.map((act) => (
                              <div key={act.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs">
                                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-900 block">{act.title}</span>
                                  <p className="text-amber-800 mt-0.5">{act.subtitle}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">GST Filing History</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 font-bold text-slate-600">Period</th>
                                <th className="p-2.5 font-bold text-slate-600">GSTR-1</th>
                                <th className="p-2.5 font-bold text-slate-600">GSTR-3B</th>
                                <th className="p-2.5 font-bold text-slate-600 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(gstTaxData.filingHistory || []).map((fh) => (
                                <tr key={fh.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-bold text-slate-800">{fh.period}</td>
                                  <td className="p-2.5 font-mono text-slate-600">{fh.gstr1}</td>
                                  <td className="p-2.5 font-mono text-slate-600">{fh.gstr3b}</td>
                                  <td className="p-2.5 font-bold text-emerald-700 text-right">{fh.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setSelectedModalReport(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl shadow-xs transition-all"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
