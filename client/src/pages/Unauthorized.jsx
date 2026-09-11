import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Unauthorized({ onBackToDashboard }) {
  return (
    <div className="py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 text-red-700 flex items-center justify-center mx-auto shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900">Unauthorized</h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        You don't have permission to access this page based on your assigned user role.
      </p>
      <button
        onClick={onBackToDashboard}
        className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
}
