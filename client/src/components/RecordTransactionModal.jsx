import React, { useState } from "react";
import {
  X,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building2,
  Calendar,
  FileText,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "./ui";

const CATEGORIES = [
  "Sales",
  "Inventory",
  "Shipping",
  "Utilities",
  "Marketing",
  "Payroll",
  "SaaS & Cloud",
  "Consulting",
  "Meals & Ops",
  "Rent",
  "Other",
];

const METHODS = [
  "NEFT",
  "UPI",
  "IMPS",
  "RTGS",
  "Corporate Card",
  "Net Banking",
];

const COMMON_PARTIES = [
  "Meridian Textiles",
  "Aarav Retail Co.",
  "Sundar Logistics",
  "PowerGrid Utilities",
  "Nova Packaging",
  "Kiran Wholesale",
  "AdReach Media",
  "Blue Harbor Exports",
  "Amazon Web Services",
  "Staff Payroll",
  "Apex Global Traders",
];

export default function RecordTransactionModal({ open, onClose, onAddTransaction }) {
  const push = useToast();
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState("credit"); // 'credit' | 'debit'
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Sales");
  const [method, setMethod] = useState("NEFT");
  const [date, setDate] = useState(today);
  const [ref, setRef] = useState(`UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [status, setStatus] = useState("Completed");
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!party.trim()) {
      push("Please enter party / counterparty name", "warning");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      push("Please enter a valid positive amount", "warning");
      return;
    }

    const newTxn = {
      id: `TXN-${Math.floor(8842 + Math.random() * 1000)}`,
      party: party.trim(),
      category,
      date,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
      amount: type === "credit" ? numAmount : -numAmount,
      status,
      type,
      method,
      ref: ref.trim() || `UTR${Date.now().toString().slice(-8)}`,
      notes: notes.trim() || (type === "credit" ? "Direct customer credit settlement" : "Business operational expenditure"),
    };

    onAddTransaction(newTxn);
    push(`Transaction ${newTxn.id} recorded successfully!`, "success");

    // Reset fields
    setParty("");
    setAmount("");
    setNotes("");
    setRef(`UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0C1322] border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Record New Transaction
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Log a direct credit or debit to update ledger balance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Transaction Type Segmented Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Transaction Nature
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setType("credit");
                    if (category === "Inventory" || category === "Utilities" || category === "Shipping") {
                      setCategory("Sales");
                    }
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === "credit"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ArrowDownLeft size={15} />
                  Credit / Inflow (+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("debit");
                    if (category === "Sales") {
                      setCategory("Inventory");
                    }
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === "debit"
                      ? "bg-slate-800 dark:bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ArrowUpRight size={15} />
                  Debit / Outflow (-)
                </button>
              </div>
            </div>

            {/* Party & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Party / Client / Vendor
                </label>
                <input
                  type="text"
                  required
                  list="common-parties"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  placeholder="e.g. Meridian Textiles"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
                <datalist id="common-parties">
                  {COMMON_PARTIES.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & UTR Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reference / UTR Number
                </label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. UTR8921092812"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Status & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  <option value="Completed">Completed (Cleared)</option>
                  <option value="Pending">Pending (Processing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Audit Memo
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Invoice #2458 settlement"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
