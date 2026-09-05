import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Download, 
  Sparkles,
  ShieldAlert,
  Check
} from 'lucide-react';
import { INVOICES_LIST, INVOICE_OVERVIEW } from '../data/mockData';

export default function Invoices({ onOpenCreateInvoice, invoicesList, onSelectAction }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = invoicesList.filter(inv => {
    const matchesSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'FLAGGED') return matchesSearch && inv.status === 'Flagged Duplicate';
    return matchesSearch && inv.status.toUpperCase() === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">Paid</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">Pending</span>;
      case 'Overdue':
        return <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">Overdue</span>;
      case 'Flagged Duplicate':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-700" />
            Flagged Duplicate
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">Invoices & Receivables</h1>
          </div>
          <p className="text-xs text-slate-500">Manage client billing, automated GST invoicing, and AI duplicate checks</p>
        </div>
        <button
          onClick={onOpenCreateInvoice}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Invoice</span>
        </button>
      </div>

      {/* High-Risk Duplicate Invoice Alert Callout */}
      <div className="bg-red-50/70 p-5 rounded-2xl border border-red-200 border-l-4 border-l-red-600 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">HIGH RISK ALERT</span>
            <h3 className="text-sm font-extrabold text-slate-900">Potential Duplicate Invoice Flagged: INV001 ↔ INV002</h3>
          </div>
          <p className="text-xs text-slate-700">Vendor <span className="font-bold text-slate-900">ABC Suppliers</span> billed ₹25,000 on 03 Sep 2026 under two identical invoice numbers.</p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same vendor</span>
            <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same amount (₹25,000)</span>
            <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same invoice date (03 Sep 2026)</span>
            <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Same business (ABC Traders)</span>
          </div>
        </div>

        <button
          onClick={() => onSelectAction({
            id: 'action-1',
            severity: 'HIGH',
            title: 'Potential Duplicate Invoice: INV001 ↔ INV002',
            subtitle: 'ABC Suppliers submitted Invoice #INV002 (₹25,000) matching #INV001.',
            category: 'Fraud & Risk',
            actionType: 'Review Action',
            details: {
              vendor: 'ABC Suppliers',
              invoiceNumber: 'INV002',
              matchingNumber: 'INV001',
              amount: 25000
            }
          })}
          className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shrink-0 shadow-xs"
        >
          Review Duplicate Action
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Pending Receivables</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{INVOICE_OVERVIEW.pendingAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-teal-700 mt-1 block font-medium">{INVOICE_OVERVIEW.pendingCount} Active Invoices</span>
        </div>
        <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-xs">
          <span className="text-xs font-semibold text-red-700 uppercase">Overdue Warning</span>
          <h3 className="text-2xl font-extrabold text-red-700 mt-1">₹{INVOICE_OVERVIEW.overdueAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-red-700 mt-1 block font-semibold">{INVOICE_OVERVIEW.overdueCount} Account Requires Follow-up</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Collection Velocity</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{INVOICE_OVERVIEW.collectionScore}%</h3>
          <span className="text-[11px] text-slate-500 mt-1 block">Avg Payment Term: 14 Days</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice ID (INV001), vendor name..."
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
          {['ALL', 'PENDING', 'PAID', 'OVERDUE', 'FLAGGED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-white text-teal-800 border border-slate-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Invoice Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Amount (₹)</th>
                <th className="p-4 text-right">GST (18%)</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Risk</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-800">{inv.id}</td>
                  <td className="p-4 font-semibold text-slate-900">{inv.customer}</td>
                  <td className="p-4 text-slate-500">{inv.date}</td>
                  <td className="p-4 text-slate-500">{inv.dueDate}</td>
                  <td className="p-4 text-right font-extrabold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right font-mono text-slate-500">₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                  <td className="p-4">{getStatusBadge(inv.status)}</td>
                  <td className="p-4">
                    <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      {inv.aiRisk}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {inv.status === 'Flagged Duplicate' ? (
                      <button
                        onClick={() => onSelectAction({
                          id: 'action-1',
                          severity: 'HIGH',
                          title: `Duplicate Invoice Flagged: ${inv.id}`,
                          subtitle: `ABC Suppliers submitted duplicate invoice matching INV001.`,
                          category: 'Fraud & Risk',
                          actionType: 'Review Action',
                          details: {
                            vendor: inv.customer,
                            invoiceNumber: inv.id,
                            matchingNumber: 'INV001',
                            amount: inv.amount
                          }
                        })}
                        className="px-3 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                      >
                        Review Action
                      </button>
                    ) : (
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
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
