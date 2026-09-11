import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Building2, 
  Filter,
  Check
} from 'lucide-react';
import { TRANSACTIONS_LIST } from '../data/mockData';
import { api } from '../services/api';

export default function Transactions({ setActiveTab }) {
  const [transactions, setTransactions] = useState(TRANSACTIONS_LIST);
  const [filterType, setFilterType] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchTxns = () => {
    api.getTransactions()
      .then(res => {
        if (res && res.transactions) {
          setTransactions(res.transactions);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTxns();
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    fetchTxns();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const filtered = transactions.filter(t => {
    if (filterType === 'ALL') return true;
    if (filterType === 'MONEY_IN') return t.amount > 0;
    if (filterType === 'MONEY_OUT') return t.amount < 0;
    if (filterType === 'RECONCILED') return t.status === 'Reconciled';
    if (filterType === 'UNRECONCILED') return t.status === 'UNRECONCILED';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">Bank Transactions</h1>
          </div>
          <p className="text-xs text-slate-500">Live feed from ABC Traders Business Account (#8892) with AI Ledger reconciliation</p>
        </div>
        <button 
          onClick={handleSync}
          className="px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-600' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Live Bank Feed'}</span>
        </button>
      </div>


      {/* Account Info Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-extrabold text-xs">
            ₹
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">ABC Traders Business Account</h3>
            <p className="text-[11px] text-slate-500 font-mono">Account #8892 • Currency: INR (₹)</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          Connected & Synced
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2">
          {['ALL', 'MONEY_IN', 'MONEY_OUT', 'RECONCILED', 'UNRECONCILED'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-slate-100 text-teal-800 border border-slate-200 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Txn ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Money In (₹)</th>
                <th className="p-4 text-right">Money Out (₹)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Suggested Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(t => (
                <tr 
                  key={t.id} 
                  className={`transition-colors ${t.status === 'UNRECONCILED' ? 'bg-teal-50/40 border-l-4 border-l-teal-600' : 'hover:bg-slate-50/80'}`}
                >
                  <td className="p-4 font-mono font-bold text-teal-800">{t.id}</td>
                  <td className="p-4 text-slate-500">{t.date}</td>
                  <td className="p-4 font-semibold text-slate-900">{t.description}</td>
                  <td className="p-4 text-right font-extrabold text-emerald-700">
                    {t.amount > 0 ? `+₹${t.amount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="p-4 text-right font-extrabold text-slate-900">
                    {t.amount < 0 ? `₹${Math.abs(t.amount).toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="p-4 text-slate-500">{t.category}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      t.status === 'Reconciled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200 font-bold'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setActiveTab && setActiveTab('reconciliation')}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold hover:bg-teal-100 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      {t.suggestedMatch || 'View Match'}
                    </button>
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
