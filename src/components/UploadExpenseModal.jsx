import React, { useState } from 'react';
import { X, Upload, Sparkles, CheckCircle2, FileText, RefreshCw, AlertCircle } from 'lucide-react';

export default function UploadExpenseModal({ onClose, onAddExpense }) {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleSimulateUpload = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsedData({
        vendor: "Hardware Hub Pvt Ltd",
        category: "Raw Materials & Goods",
        amount: 1450.00,
        gstin: "27AAACH9912K1Z8",
        date: new Date().toISOString().split('T')[0],
        duplicateRisk: "Clear (No match)",
        confidence: "99.1% OCR Accuracy"
      });
    }, 1200);
  };

  const handleConfirm = () => {
    if (parsedData) {
      onAddExpense({
        id: `EXP-${Math.floor(8000 + Math.random() * 1000)}`,
        vendor: parsedData.vendor,
        category: parsedData.category,
        amount: parsedData.amount,
        date: parsedData.date,
        receipt: "Verified OCR",
        aiStatus: "Normal",
        approval: "Approved"
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 border border-teal-200 text-teal-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">AI OCR Receipt Scanner</h3>
              <p className="text-xs text-slate-500">Extract line items, GSTIN, and duplicate checks in 2 seconds</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!parsedData ? (
            <div 
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              {isParsing ? (
                <div className="py-6 space-y-3">
                  <RefreshCw className="w-10 h-10 text-teal-700 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-900">Extracting Invoice & GST Tax Data...</p>
                  <p className="text-xs text-slate-500">FinGuard Neural Vision OCR v2.4</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Click to upload or drop receipt file</h4>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG, or Tax Invoice Scans</p>
                  </div>
                  <span className="inline-block text-[10px] font-mono px-3 py-1 rounded-full bg-white text-teal-800 border border-slate-200 shadow-xs">
                    Sample Demo Receipt Auto-Extract
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {parsedData.confidence}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">GSTIN: {parsedData.gstin}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Vendor Name</span>
                    <span className="font-bold text-slate-900">{parsedData.vendor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Amount</span>
                    <span className="font-extrabold text-teal-800">${parsedData.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Category</span>
                    <span className="font-medium text-slate-700">{parsedData.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Duplicate Check</span>
                    <span className="font-semibold text-emerald-700">{parsedData.duplicateRisk}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Post to Expenses</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
