import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Bell,
  Eye,
} from "lucide-react";
import Card from "../components/Card";
import { StatusBadge, Modal, EmptyState, useToast } from "../components/ui";
import { formatINR } from "../data/mockData";
import { useInvoices } from "../context/InvoiceContext";
import { useLanguage } from "../context/LanguageContext";
import SmartInvoiceUploadModal from "../components/SmartInvoiceUploadModal";
import InvoiceDetailModal from "../components/InvoiceDetailModal";

const FILTERS = ["All", "Paid", "Sent", "Due soon", "Overdue", "Draft"];

const FILTER_KEYS = {
  All: "all",
  Paid: "paid",
  Sent: "sent",
  "Due soon": "dueSoon",
  Overdue: "overdue",
  Draft: "draft",
};

export default function Invoices() {
  const { invoices, addInvoice } = useInvoices();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", amount: "", dueDate: "" });
  const push = useToast();

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesFilter = filter === "All" || inv.status === filter;
      const matchesQuery =
        inv.customer.toLowerCase().includes(query.toLowerCase()) ||
        inv.id.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [invoices, filter, query]);

  // Keep selected synchronized with latest state
  const activeSelectedInvoice = useMemo(() => {
    if (!selected) return null;
    return invoices.find((inv) => inv.id === selected.id) || selected;
  }, [invoices, selected]);

  function handleAdd() {
    if (!form.customer || !form.amount || !form.dueDate) {
      push("Fill in customer, amount and due date.", "warning");
      return;
    }
    const id = `INV-${2450 + invoices.length + 10}`;
    addInvoice({
      id,
      customer: form.customer,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: "Draft",
    });
    setForm({ customer: "", amount: "", dueDate: "" });
    setAddOpen(false);
    push("Invoice created as draft.", "success");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            {t("invoicesTitle", "Invoices & Billings")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {invoices.length} {t("invoices", "invoices").toLowerCase()} ·{" "}
            {formatINR(invoices.reduce((s, i) => s + (Number(i.amount) || 0), 0))}{" "}
            {t("totalDue", "total value")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Smart AI Invoice Upload Button */}
          <button
            onClick={() => setUploadOpen(true)}
            className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Sparkles size={16} />
            <span>{t("smartUploadAi", "Smart Upload (AI)")}</span>
            <span className="rounded-md bg-white/20 text-white px-1.5 py-0.2 text-[10px] font-bold tracking-wide">
              AI
            </span>
          </button>

          <button
            onClick={() => setAddOpen(true)}
            className="focus-ring flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} /> {t("addManual", "Add manual")}
          </button>
        </div>
      </div>

      {/* Smart Invoice OCR & Binary Upload Modal */}
      <SmartInvoiceUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onInvoiceAdded={addInvoice}
      />

      {/* Interactive Invoice Details, Mark Paid & Remind to Pay Modal */}
      <InvoiceDetailModal
        open={!!activeSelectedInvoice}
        invoice={activeSelectedInvoice}
        onClose={() => setSelected(null)}
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchInvoices", "Search customer or invoice ID")}
              className="focus-ring w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {t(FILTER_KEYS[f] || f, f)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t("noInvoicesFound", "No invoices found")}
            description={t("noInvoicesDesc", "Try a different filter or search term, or upload a new invoice.")}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5">{t("invoiceColumn", "Invoice")}</th>
                  <th className="pb-2.5">{t("customerColumn", "Customer")}</th>
                  <th className="pb-2.5">{t("dueDateColumn", "Due date")}</th>
                  <th className="pb-2.5 text-right">{t("amountColumn", "Amount")}</th>
                  <th className="pb-2.5 text-right">{t("statusColumn", "Status")}</th>
                  <th className="pb-2.5 text-right">{t("actionsColumn", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className="border-t border-slate-100 dark:border-slate-800/60 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {inv.id}
                        </span>
                        {inv.aiImported && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
                            <Sparkles size={10} className="text-blue-600 dark:text-blue-400" />
                            {t("aiImported", "AI Imported")}
                          </span>
                        )}
                        {inv.remindersSent > 0 && (
                          <span
                            title={`Reminders sent: ${inv.remindersSent}`}
                            className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60"
                          >
                            <Bell size={9} />
                            {inv.remindersSent}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-900 dark:text-slate-200 font-semibold">
                      {inv.customer}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">{inv.dueDate}</td>
                    <td className="py-3 text-right font-bold tabular text-slate-900 dark:text-white">
                      {formatINR(inv.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(inv);
                        }}
                        className="focus-ring rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye size={12} />
                        <span>{t("viewDetails", "View Details")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Manual Add Invoice Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add invoice manually"
        footer={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="focus-ring rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              onClick={handleAdd}
              className="focus-ring rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 text-sm hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              Create invoice
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer
            </label>
            <input
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              placeholder="e.g. Meridian Textiles"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount (₹)
            </label>
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              type="number"
              className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Due date
            </label>
            <input
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              type="date"
              className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
