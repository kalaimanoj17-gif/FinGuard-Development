import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Receipt,
  CreditCard,
  MapPin,
  FileText,
} from "lucide-react";
import { formatINR } from "../data/mockData";
import { StatusBadge, useToast } from "./ui";
import { useInvoices } from "../context/InvoiceContext";
import { useLanguage } from "../context/LanguageContext";

export default function CustomerDetailModal({
  customer,
  open,
  onClose,
  onOpenInvoice,
}) {
  const { invoices, updateInvoice } = useInvoices();
  const { t } = useLanguage();
  const push = useToast();

  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'details' | 'history'
  const [copiedGstin, setCopiedGstin] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  if (!open || !customer) return null;

  // Filter invoices for this customer
  const customerInvoices = invoices.filter(
    (inv) => inv.customer?.toLowerCase() === customer.name?.toLowerCase()
  );

  const pendingInvoices = customerInvoices.filter(
    (inv) => inv.status !== "Paid"
  );
  const paidInvoices = customerInvoices.filter((inv) => inv.status === "Paid");

  const totalOutstanding = pendingInvoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const hasOverdue = pendingInvoices.some((inv) => inv.status === "Overdue");

  const creditLimit = customer.creditLimit || 200000;
  const creditUsedPercent = Math.min(
    100,
    Math.round((totalOutstanding / creditLimit) * 100)
  );

  const handleCopyGstin = () => {
    if (customer.gstin) {
      navigator.clipboard.writeText(customer.gstin);
      setCopiedGstin(true);
      push({
        type: "success",
        title: "GSTIN Copied",
        message: `${customer.gstin} copied to clipboard`,
      });
      setTimeout(() => setCopiedGstin(false), 2000);
    }
  };

  const handleMarkAsPaid = (inv) => {
    setMarkingId(inv.id);
    setTimeout(() => {
      updateInvoice(inv.id, { status: "Paid" });
      setMarkingId(null);
      push({
        type: "success",
        title: "Invoice Settled",
        message: `${inv.id} for ${formatINR(inv.amount)} marked as Paid.`,
      });
    }, 300);
  };

  const handleSendWhatsAppReminder = (inv) => {
    const rawPhone = (customer.phone || "+919876543210").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${customer.contactPerson || customer.name},\n\nThis is a friendly reminder from FinGuard AI regarding invoice ${inv.id} for ${formatINR(inv.amount)}, which was due on ${inv.dueDate}.\n\nPlease arrange for payment settlement at your earliest convenience.\n\nThank you,\nFinance & Accounts Team`
    );
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, "_blank");
    push({
      type: "info",
      title: "WhatsApp Reminder Opened",
      message: `Direct reminder link initiated for ${customer.name}.`,
    });
  };

  const initials = customer.name
    ? customer.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CU";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0C1322] shadow-[0_25px_60px_rgba(15,23,42,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all overflow-hidden">
        {/* Header with gradient accent */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-blue-50/40 dark:from-[#0C1322] dark:via-slate-900 dark:to-blue-950/40 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 font-display text-lg font-extrabold text-white shadow-md shadow-blue-500/25">
                {initials}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {customer.name}
                  </h2>
                  <StatusBadge status={customer.status} />
                  {hasOverdue && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                      <AlertCircle size={12} /> Overdue Bills
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {customer.contactPerson && (
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500">Contact:</span> {customer.contactPerson}
                    </span>
                  )}
                  {customer.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400 dark:text-slate-500" /> {customer.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Close & Action buttons */}
            <div className="flex items-center gap-1.5">
              {customer.phone && (
                <a
                  href={`tel:${customer.phone}`}
                  title="Call Customer"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Phone size={14} />
                </a>
              )}
              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  title="Email Customer"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Mail size={14} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="focus-ring ml-1 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className={`rounded-2xl border p-3 ${
              totalOutstanding > 0
                ? hasOverdue
                  ? "border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30"
                  : "border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/30"
                : "border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/30"
            }`}>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Balance
              </span>
              <p className={`mt-0.5 font-display text-lg font-extrabold ${
                totalOutstanding > 0
                  ? hasOverdue
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}>
                {formatINR(totalOutstanding)}
              </p>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {pendingInvoices.length} bill{pendingInvoices.length === 1 ? "" : "s"} outstanding
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Billed
              </span>
              <p className="mt-0.5 font-display text-lg font-extrabold text-slate-900 dark:text-white">
                {formatINR(customer.totalBilled || 0)}
              </p>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {customerInvoices.length} lifetime invoices
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Credit Limit
              </span>
              <p className="mt-0.5 font-display text-lg font-extrabold text-blue-600 dark:text-blue-400">
                {formatINR(creditLimit)}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      creditUsedPercent > 80 ? "bg-rose-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${creditUsedPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {creditUsedPercent}%
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Payment Track
              </span>
              <p className="mt-0.5 font-display text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {customer.onTimeRate || 92}%
              </p>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                On-time settlement rate
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`focus-ring relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pending"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Receipt size={14} />
              Pending Bills
              {pendingInvoices.length > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    activeTab === "pending"
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {pendingInvoices.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`focus-ring flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "details"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Building2 size={14} />
              Customer Profile & Tax
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`focus-ring flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <FileText size={14} />
              Billing History ({paidInvoices.length})
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* TAB 1: PENDING BILLS */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              {pendingInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-100 dark:border-emerald-900/60 shadow-sm">
                    <CheckCircle2 size={24} />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    All Caught Up!
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                    {customer.name} currently has no outstanding or overdue invoices on file.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Unpaid Invoices Awaiting Settlement
                    </p>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Total: {formatINR(totalOutstanding)}
                    </span>
                  </div>

                  {pendingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border p-4 transition-all ${
                        inv.status === "Overdue"
                          ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700"
                          : "border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            inv.status === "Overdue"
                              ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                              : "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          <Receipt size={17} />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                              {inv.id}
                            </span>
                            <StatusBadge status={inv.status} />
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Issued: {inv.date || "2026-08-15"}</span>
                            <span>•</span>
                            <span
                              className={`font-medium ${
                                inv.status === "Overdue"
                                  ? "text-rose-600 dark:text-rose-400 font-bold"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              Due Date: {inv.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Amount and Actions */}
                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 border-t border-slate-100 dark:border-slate-800/70 pt-2 sm:border-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                            {formatINR(inv.amount)}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {inv.itemsCount || 3} line items
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Send WhatsApp Reminder */}
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppReminder(inv)}
                            title="Send WhatsApp Payment Reminder"
                            className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                          >
                            <MessageSquare size={13} />
                            <span>Remind</span>
                          </button>

                          {/* Mark as Paid */}
                          <button
                            type="button"
                            disabled={markingId === inv.id}
                            onClick={() => handleMarkAsPaid(inv)}
                            className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 size={13} />
                            <span>{markingId === inv.id ? "Settling…" : "Mark Paid"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Advisor Context Card for this Customer */}
              {customer.aiNote && (
                <div className="rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-blue-50/50 dark:from-blue-950/40 dark:via-slate-900/40 dark:to-blue-950/30 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                      <Sparkles size={14} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                        FinGuard AI Risk Insight
                      </p>
                      <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                        {customer.aiNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPANY & TAX DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* GSTIN & Tax Profile */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    GSTIN & Tax Registration
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
                      {customer.gstin || "24AAACM1234F1Z5"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyGstin}
                      className="focus-ring flex h-7 items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      {copiedGstin ? <Check size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedGstin ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Active GST Registration (Regular Taxpayer)
                  </span>
                </div>

                {/* Payment Terms */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Default Credit & Payment Terms
                  </p>
                  <p className="mt-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">
                    {customer.paymentTerms || "Net 30 Days"}
                  </p>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Credit limit: {formatINR(creditLimit)}
                  </span>
                </div>
              </div>

              {/* Billing & Postal Address */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Registered Business Address
                </p>
                <div className="mt-2 flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {customer.address || "Main Industrial Zone, Mumbai, Maharashtra - 400001"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Official Communication Channels
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>{customer.email || "accounts@customer.com"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>{customer.phone || "+91 98000 00000"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Settled Invoices & Payment Ledger
              </p>

              {paidInvoices.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No settled invoices found in recent records.
                </div>
              ) : (
                paidInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                      </span>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {inv.id}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Paid on time • Due was {inv.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                        {formatINR(inv.amount)}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Settled
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0C1322] px-6 py-3.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            FinGuard Business Ledger • {customer.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
