import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Printer,
  Calendar,
  Building2,
  CreditCard,
  FileText,
  Clock,
  Check,
  RotateCcw,
  Copy,
  ExternalLink,
  Workflow,
  Code2,
  Zap,
  Activity,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { formatINR } from "../data/mockData";
import { StatusBadge, useToast } from "./ui";
import { useInvoices } from "../context/InvoiceContext";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_REMINDER_WEBHOOK_URL =
  "https://api.agents.snsihub.ai/webhook/d8280e0f-0480-43e8-8d3e-a45f301143e3";
const FALLBACK_REMINDER_WEBHOOK_URL =
  "https://api.agents.snsihub.ai/webhook-test/d8280e0f-0480-43e8-8d3e-a45f301143e3";

export default function InvoiceDetailModal({ invoice, open, onClose }) {
  const { updateInvoice } = useInvoices();
  const { t } = useLanguage();
  const push = useToast();

  // Primary active tab view in modal: 'details' | 'reminder'
  const [activeTab, setActiveTab] = useState("details");
  const [reminderChannel, setReminderChannel] = useState("whatsapp"); // 'whatsapp' | 'email' | 'workflow'
  const [reminderTone, setReminderTone] = useState("friendly"); // 'friendly' | 'urgent' | 'official'
  const [customWebhookUrl, setCustomWebhookUrl] = useState(
    DEFAULT_REMINDER_WEBHOOK_URL
  );
  const [showPayload, setShowPayload] = useState(false);
  const [reminderSending, setReminderSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageBody, setMessageBody] = useState("");

  const isPaid = invoice?.status === "Paid";
  const reminderHistory = invoice?.reminderHistory || [];

  const items =
    invoice?.items && invoice.items.length > 0
      ? invoice.items
      : [
          {
            id: 1,
            name: "Professional Financial & Ledger Services",
            qty: 1,
            unitPrice: invoice?.amount || 1000,
          },
        ];

  const subtotal =
    invoice?.subtotal ||
    items.reduce(
      (sum, it) => sum + (Number(it.qty) || 1) * (Number(it.unitPrice) || 0),
      0
    );
  const taxAmount =
    invoice?.tax || Math.round(subtotal * ((invoice?.taxRate || 5) / 100));
  const totalAmount = invoice?.amount || subtotal + taxAmount;

  // Reset tab to 'details' when a new invoice is opened
  useEffect(() => {
    if (open) {
      setActiveTab("details");
      setReminderSending(false);
    }
  }, [open, invoice?.id]);

  // Sync draft message when invoice or tone changes
  useEffect(() => {
    if (!invoice) return;
    const cust = invoice.customer || "Customer";
    const amt = formatINR(totalAmount);
    const id = invoice.id;
    const due = invoice.dueDate || "the due date";

    if (reminderTone === "urgent") {
      setMessageBody(
        `⚠️ Urgent Notice for ${cust}: Payment for Invoice #${id} of ${amt} was due on ${due}. Please complete the payment immediately via: https://finguard.ai/pay/${id}`
      );
    } else if (reminderTone === "official") {
      setMessageBody(
        `Dear ${cust},\n\nThis is an official payment reminder regarding Invoice #${id} for ${amt}, payable by ${due}.\n\nPlease process the payment here: https://finguard.ai/pay/${id}\n\nSincerely,\nFinGuard AI Billing Dept.`
      );
    } else {
      setMessageBody(
        `Hello ${cust}, this is a friendly reminder from FinGuard AI regarding Invoice #${id} for ${amt} due on ${due}. Click here to pay: https://finguard.ai/pay/${id}`
      );
    }
  }, [invoice, reminderTone, totalAmount]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        if (activeTab === "reminder") {
          setActiveTab("details");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeTab, onClose]);

  if (!open || !invoice) return null;

  const handleTogglePaid = () => {
    const newStatus = isPaid ? "Due soon" : "Paid";
    updateInvoice(invoice.id, {
      status: newStatus,
      paidAt: newStatus === "Paid" ? new Date().toISOString() : null,
    });
    push(
      newStatus === "Paid"
        ? `Invoice ${invoice.id} marked as Paid! Ledger updated.`
        : `Invoice ${invoice.id} status changed to ${newStatus}.`,
      "success"
    );
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    push("Reminder message copied to clipboard!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const recordReminder = (channelName) => {
    const newEntry = {
      id: Date.now(),
      channel: channelName,
      timestamp: new Date().toISOString(),
      message: messageBody.slice(0, 80) + "...",
    };

    updateInvoice(invoice.id, {
      remindersSent: (invoice.remindersSent || 0) + 1,
      lastReminderAt: new Date().toISOString(),
      reminderHistory: [newEntry, ...reminderHistory],
    });
  };

  // Direct WhatsApp Dispatch
  const handleOpenWhatsApp = () => {
    const rawPhone = (invoice.phone || "919876543210").replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(messageBody);
    const waUrl = `https://wa.me/${rawPhone}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    recordReminder("WhatsApp (Direct)");
    push(`WhatsApp opened for ${invoice.customer}!`, "success");
  };

  // Direct Mail Client Dispatch
  const handleOpenMailClient = () => {
    const targetEmail = invoice.email || "manoj.kumar@gmail.com";
    const subject = encodeURIComponent(
      `Payment Reminder: Invoice #${invoice.id} (${formatINR(totalAmount)})`
    );
    const body = encodeURIComponent(messageBody);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    recordReminder("Email (Mail Client)");
    push(`Email client opened for ${invoice.customer}!`, "success");
  };

  // Automated Webhook Workflow Dispatcher
  const handleTriggerWorkflow = async () => {
    setReminderSending(true);

    const payload = {
      action: "send_payment_reminder",
      channel: reminderChannel,
      tone: reminderTone,
      invoice: {
        id: invoice.id,
        amount: totalAmount,
        dueDate: invoice.dueDate,
        invoiceDate: invoice.date,
        status: invoice.status,
      },
      customer: {
        name: invoice.customer,
        email: invoice.email || "manoj.kumar@gmail.com",
        phone: invoice.phone || "+91 98765 43210",
        address: invoice.address,
      },
      message: messageBody,
      timestamp: new Date().toISOString(),
      business_id: "B001",
    };

    try {
      const urlToUse = customWebhookUrl.trim() || DEFAULT_REMINDER_WEBHOOK_URL;
      const res = await fetch(urlToUse, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        await fetch(FALLBACK_REMINDER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.warn("Workflow dispatch note:", err);
    }

    setReminderSending(false);
    recordReminder(`AI Workflow (${reminderChannel.toUpperCase()})`);
    push(
      `Payment reminder workflow triggered successfully for ${invoice.customer}!`,
      "success"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm animate-[fadeIn_.18s_ease-out] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0C1322] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            {activeTab === "reminder" ? (
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={t("backToInvoice", "Back to Invoice Details")}
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-white shadow-md">
                <FileText size={20} />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {activeTab === "reminder"
                    ? `${t("remindCustomerTab", "Remind Customer")} — ${t("invoiceColumn", "Invoice")} #${invoice.id}`
                    : `${t("invoiceColumn", "Invoice")} #${invoice.id}`}
                </h3>
                <StatusBadge status={invoice.status} />
                {invoice.aiImported && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                    <Sparkles size={10} className="text-amber-300" />
                    {t("aiImported", "AI Imported")}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100/90">
                {t("customerColumn", "Customer")}: <strong className="text-white font-bold">{invoice.customer}</strong> · {t("dueDateColumn", "Due")}: {invoice.dueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "details" && (
              <button
                onClick={() => window.print()}
                title={t("printInvoice", "Print Invoice")}
                className="hidden sm:flex rounded-xl p-2 text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              >
                <Printer size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              aria-label={t("close", "Close")}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-6 py-2.5 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-xl px-3.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "details"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            }`}
          >
            {t("invoiceOverviewTab", "Invoice Overview & Items")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reminder")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "reminder"
                ? "bg-amber-500 text-white shadow-sm font-bold"
                : "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold"
            }`}
          >
            <Bell size={13} className={invoice.remindersSent ? "" : "animate-bounce"} />
            <span>{t("remindCustomerTab", "Remind Customer (Mail / WhatsApp)")}</span>
            {invoice.remindersSent > 0 && (
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 text-[9px] border border-amber-300 dark:border-amber-700 font-bold">
                {invoice.remindersSent}
              </span>
            )}
          </button>
        </div>

        {/* ================= VIEW 1: INVOICE DETAILS ================= */}
        {activeTab === "details" && (
          <div className="max-h-[64vh] overflow-y-auto p-6 space-y-6">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 p-3.5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <Clock size={15} className="text-slate-500" />
                <span>
                  {t("statusColumn", "Status")}: <strong className="text-slate-900 dark:text-white font-bold">{invoice.status}</strong>
                  {invoice.lastReminderAt && (
                    <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 font-bold px-2 py-0.5 rounded-md ml-2 text-[11px]">
                      {t("reminded", "Reminded")} {new Date(invoice.lastReminderAt).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Remind Customer Button */}
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("reminder")}
                    className="focus-ring flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 px-4 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-sm group"
                  >
                    <Bell size={14} className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>{t("remindToPay", "Remind to Pay")}</span>
                    <ChevronRight size={14} className="text-amber-600 dark:text-amber-400" />
                  </button>
                )}

                {/* Mark as Paid / Toggle Button */}
                <button
                  type="button"
                  onClick={handleTogglePaid}
                  className={`focus-ring flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                    isPaid
                      ? "border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 font-bold shadow-md"
                  }`}
                >
                  {isPaid ? (
                    <>
                      <RotateCcw size={14} className="text-slate-500" />
                      <span>{t("markAsUnpaid", "Mark as Unpaid")}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} className="text-white" />
                      <span>{t("markAsPaid", "Mark as Paid")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Building2 size={13} className="text-slate-500" />
                  {t("billedTo", "Billed To (Customer)")}
                </p>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{invoice.customer}</p>
                {invoice.phone && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mt-0.5 flex items-center gap-1">
                    <Phone size={11} className="text-slate-400" /> {invoice.phone}
                  </p>
                )}
                {invoice.email && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 truncate mt-0.5 flex items-center gap-1">
                    <Mail size={11} className="text-slate-400" /> {invoice.email}
                  </p>
                )}
                {invoice.address && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-tight">{invoice.address}</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar size={13} className="text-slate-500" />
                  {t("scheduleTerms", "Schedule & Terms")}
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t("invoiceDate", "Invoice Date")}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{invoice.date || invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t("dueDateColumn", "Due Date")}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t("terms", "Terms")}:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Net 7 Days</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <CreditCard size={13} className="text-slate-500" />
                  {t("totalAmountDue", "Total Amount Due")}
                </p>
                <p className="font-display text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular">
                  {formatINR(totalAmount)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t("statusColumn", "Status")}: <strong className="font-bold text-slate-900 dark:text-white">{invoice.status}</strong>
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t("itemizedBreakdown", "Itemized Breakdown")} ({items.length} {t("items", "items")})
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{t("taxInvoicePreview", "Standard Tax Invoice")}</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3 text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {t("qty", "Qty")}: {item.qty} × {formatINR(item.unitPrice)}
                      </p>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white tabular text-sm shrink-0">
                      {formatINR((item.qty || 1) * (item.unitPrice || 0))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Summary */}
              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>{t("subtotal", "Subtotal")}</span>
                  <span className="tabular font-bold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>{t("discount", "Discount")}</span>
                    <span className="tabular">-{formatINR(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>{t("gstTax", "GST Tax")} ({invoice.taxRate || 5}%)</span>
                  <span className="tabular font-bold text-slate-900 dark:text-white">{formatINR(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>{t("totalDue", "Total Due")}</span>
                  <span className="font-display text-base text-blue-600 dark:text-blue-400 tabular font-extrabold">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Past Reminder History */}
            {reminderHistory.length > 0 && (
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 space-y-2.5 shadow-sm">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-slate-500" />
                  {t("reminderActivityLog", "Reminder Activity Log")} ({reminderHistory.length})
                </h5>
                <div className="space-y-1.5">
                  {reminderHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 px-1.5 py-0.5 text-[10px] font-bold">
                          {entry.channel}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 truncate">{entry.message}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 2: PAYMENT REMINDER STUDIO ================= */}
        {activeTab === "reminder" && (
          <div className="max-h-[64vh] overflow-y-auto p-6 space-y-5">
            {/* Channel Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t("chooseChannel", "1. Select Communication Channel:")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setReminderChannel("whatsapp")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-xs font-semibold transition-all cursor-pointer ${
                    reminderChannel === "whatsapp"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-sm">
                    <MessageSquare size={17} />
                  </div>
                  <span className="font-bold">{t("whatsAppDirect", "WhatsApp Direct")}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {invoice.phone || "+91 98765 43210"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderChannel("email")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-xs font-semibold transition-all cursor-pointer ${
                    reminderChannel === "email"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-sm">
                    <Mail size={17} />
                  </div>
                  <span className="font-bold">{t("emailMailto", "Email (Mailto)")}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[130px]">
                    {invoice.email || "manoj.kumar@gmail.com"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderChannel("workflow")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-xs font-semibold transition-all cursor-pointer ${
                    reminderChannel === "workflow"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-sm">
                    <Workflow size={17} />
                  </div>
                  <span className="font-bold">{t("aiWorkflow", "AI Workflow")}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Webhook Node</span>
                </button>
              </div>
            </div>

            {/* Recipient & Tone Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 p-3.5 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t("targetRecipient", "Target Recipient")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{invoice.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t("pendingDue", "Pending Due")}:</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{formatINR(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t("dueDateColumn", "Due Date")}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{invoice.dueDate}</span>
                </div>
              </div>

              {/* Tone Switcher */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3.5 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t("chooseTone", "2. Choose Tone:")}
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setReminderTone("friendly")}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                      reminderTone === "friendly"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t("friendly", "Friendly")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReminderTone("urgent")}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                      reminderTone === "urgent"
                        ? "bg-amber-500 text-white font-bold shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t("urgent", "Urgent")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReminderTone("official")}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                      reminderTone === "official"
                        ? "bg-slate-800 dark:bg-slate-700 text-white font-bold shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t("official", "Official")}
                  </button>
                </div>
              </div>
            </div>

            {/* Workflow Webhook Config (When Workflow is selected) */}
            {reminderChannel === "workflow" && (
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Workflow size={14} className="text-slate-500" />
                    {t("workflowWebhookUrl", "Workflow Webhook URL")}:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPayload(!showPayload)}
                    className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Code2 size={12} />
                    {showPayload ? t("hideJson", "Hide JSON") : t("viewJsonPayload", "View JSON Payload")}
                  </button>
                </div>
                <input
                  type="text"
                  value={customWebhookUrl}
                  onChange={(e) => setCustomWebhookUrl(e.target.value)}
                  placeholder="https://api.agents.snsihub.ai/webhook/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 shadow-sm"
                />

                {showPayload && (
                  <pre className="rounded-xl bg-slate-900 text-emerald-400 p-3 text-[10px] font-mono overflow-x-auto max-h-32 border border-slate-800">
                    {JSON.stringify(
                      {
                        action: "send_payment_reminder",
                        channel: reminderChannel,
                        invoice_id: invoice.id,
                        amount: totalAmount,
                        customer: invoice.customer,
                        email: invoice.email || "manoj.kumar@gmail.com",
                        phone: invoice.phone || "+91 98765 43210",
                        message: messageBody,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            )}

            {/* Message Draft & Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t("reminderDraft", "3. Reminder Message Draft:")}
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="focus-ring flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? t("copied", "Copied!") : t("copyText", "Copy Text")}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-xs text-slate-900 dark:text-white font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm resize-none font-sans"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className="focus-ring flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                <ArrowLeft size={14} /> {t("backToInvoice", "Back to Invoice")}
              </button>

              <div className="flex items-center gap-2">
                {reminderChannel === "whatsapp" && (
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 px-6 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquare size={15} />
                    <span>{t("sendOnWhatsApp", "Send on WhatsApp")}</span>
                    <ExternalLink size={12} className="opacity-80" />
                  </button>
                )}

                {reminderChannel === "email" && (
                  <button
                    type="button"
                    onClick={handleOpenMailClient}
                    className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 px-6 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Mail size={15} />
                    <span>{t("openEmailClient", "Open in Email Client")}</span>
                    <ExternalLink size={12} className="opacity-80" />
                  </button>
                )}

                {reminderChannel === "workflow" && (
                  <button
                    type="button"
                    onClick={handleTriggerWorkflow}
                    disabled={reminderSending}
                    className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 px-6 py-2.5 text-xs font-bold hover:bg-blue-700 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {reminderSending ? (
                      <>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                        <span>{t("triggeringWorkflow", "Triggering Workflow...")}</span>
                      </>
                    ) : (
                      <>
                        <Zap size={15} className="text-white" />
                        <span>{t("triggerWorkflowWebhook", "Trigger AI Workflow Webhook")}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0C1322] px-6 py-3.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
            FinGuard Ledger ID: {invoice.id}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
          >
            {t("close", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
