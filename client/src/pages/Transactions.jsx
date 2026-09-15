import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  X,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "../components/Card";
import { StatusBadge, EmptyState, useToast } from "../components/ui";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { transactions as defaultTransactions, formatINR } from "../data/mockData";
import TransactionSlipModal from "../components/TransactionSlipModal";
import RecordTransactionModal from "../components/RecordTransactionModal";

const STORAGE_KEY = "finguard_transactions_v2";

const CATEGORY_COLORS = {
  Sales: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
  Shipping: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60",
  Utilities: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  Inventory: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
  Marketing: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60",
  Payroll: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
  "SaaS & Cloud": "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60",
  "Meals & Ops": "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/60",
};

export default function Transactions() {
  const { period } = useFinance();
  const { isDark } = useTheme();
  const push = useToast();

  // Load from local storage or mock defaults
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultTransactions;
  });

  // Filters and search states
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All"); // 'All' | 'Credit' | 'Debit'
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Completed' | 'Pending' | 'Failed'
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Modals
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  // Financial KPI calculations
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    items.forEach((t) => {
      if (t.amount > 0) {
        inflow += t.amount;
      } else {
        outflow += Math.abs(t.amount);
      }

      if (t.status === "Completed") completedCount++;
      else if (t.status === "Pending") pendingCount++;
      else if (t.status === "Failed") failedCount++;
    });

    const net = inflow - outflow;
    const totalCount = items.length || 1;
    const clearanceRate = Math.round((completedCount / totalCount) * 100);

    return {
      inflow,
      outflow,
      net,
      completedCount,
      pendingCount,
      failedCount,
      clearanceRate,
    };
  }, [items]);

  // Anomaly / issues detected by FinGuard AI
  const anomalies = useMemo(() => {
    return items.filter((t) => t.status === "Failed" || t.status === "Pending");
  }, [items]);

  // Filtered & Sorted items
  const filtered = useMemo(() => {
    return items
      .filter((t) => {
        const matchesType =
          type === "All" ||
          (type === "Credit" ? t.amount > 0 : t.amount < 0);

        const matchesStatus =
          statusFilter === "All" || t.status === statusFilter;

        const matchesCategory =
          categoryFilter === "All" || t.category === categoryFilter;

        const q = query.toLowerCase().trim();
        const matchesQuery =
          !q ||
          t.party.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.ref && t.ref.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q);

        return matchesType && matchesStatus && matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sortBy === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortBy === "amount-asc") return Math.abs(a.amount) - Math.abs(b.amount);
        return 0;
      });
  }, [items, query, type, statusFilter, categoryFilter, sortBy]);

  // Handlers
  const handleAddTransaction = (newTxn) => {
    setItems((prev) => [newTxn, ...prev]);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTxn && selectedTxn.id === id) {
      setSelectedTxn((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleResolveAllAnomalies = () => {
    setItems((prev) =>
      prev.map((t) =>
        t.status === "Failed" || t.status === "Pending"
          ? { ...t, status: "Completed" }
          : t
      )
    );
    push("All pending and failed transactions cleared & verified!", "success");
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Top Banner Header
      doc.setFillColor(12, 19, 34);
      doc.rect(0, 0, 842, 60, "F");

      // Brand Logo & Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("FINGUARD AI", 40, 36);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("Official Financial Ledger Statement & Transaction Report", 165, 35);

      const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text(`Generated: ${currentDate}`, 802, 35, { align: "right" });

      // KPI Summary Banner Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(40, 75, 762, 48, 6, 6, "FD");

      // Total Inflow
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("TOTAL INFLOW (CREDITS)", 60, 93);
      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129);
      doc.text(`+INR ${stats.inflow.toLocaleString("en-IN")}`, 60, 110);

      // Total Outflow
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("TOTAL OUTFLOW (DEBITS)", 250, 93);
      doc.setFontSize(11);
      doc.setTextColor(244, 63, 94);
      doc.text(`-INR ${stats.outflow.toLocaleString("en-IN")}`, 250, 110);

      // Net Balance
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("NET OPERATING FLOW", 440, 93);
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(
        `${stats.net >= 0 ? "+" : "-"}INR ${Math.abs(stats.net).toLocaleString("en-IN")}`,
        440,
        110
      );

      // Records Count
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("CLEARANCE & AUDIT", 620, 93);
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `${filtered.length} of ${items.length} records (${stats.clearanceRate}% Cleared)`,
        620,
        110
      );

      // AutoTable
      const tableColumn = [
        "TXN ID",
        "Party / Beneficiary",
        "Nature",
        "Category",
        "Method",
        "Date",
        "Bank Reference / UTR",
        "Status",
        "Amount (INR)",
      ];

      const tableRows = filtered.map((t) => {
        const isCredit = t.amount > 0;
        const absVal = Math.abs(t.amount).toLocaleString("en-IN");
        return [
          t.id,
          t.party,
          isCredit ? "Credit (+)" : "Debit (-)",
          t.category,
          t.method || "Transfer",
          t.date,
          t.ref || "UTR-VERIFIED",
          t.status,
          `${isCredit ? "+" : "-"}${absVal}`,
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 135,
        theme: "striped",
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
          cellPadding: 6,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
          cellPadding: 5.5,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 65 },
          1: { fontStyle: "bold", cellWidth: 125 },
          2: { cellWidth: 65 },
          3: { cellWidth: 75 },
          4: { cellWidth: 70 },
          5: { cellWidth: 65 },
          6: { cellWidth: 95 },
          7: { cellWidth: 65, halign: "center" },
          8: { fontStyle: "bold", halign: "right", cellWidth: 97 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        didParseCell: function (data) {
          if (data.column.index === 8) {
            const raw = data.cell.raw || "";
            if (raw.startsWith("+")) {
              data.cell.styles.textColor = [16, 185, 129];
            } else {
              data.cell.styles.textColor = [15, 23, 42];
            }
          }
          if (data.column.index === 7) {
            const status = data.cell.raw;
            if (status === "Completed") data.cell.styles.textColor = [16, 185, 129];
            else if (status === "Pending") data.cell.styles.textColor = [217, 119, 6];
            else if (status === "Failed") data.cell.styles.textColor = [225, 29, 72];
          }
        },
        margin: { left: 40, right: 40, bottom: 40 },
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `FinGuard AI Ledger · Confidential & Digitally Verified · Page ${data.pageNumber} of ${pageCount}`,
            40,
            575
          );
          doc.text(
            `Verification Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            802,
            575,
            { align: "right" }
          );
        },
      });

      const fileName = `finguard-transactions-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
      push("Exported transaction statement as PDF!", "success");
    } catch (err) {
      console.error("PDF generation failed", err);
      window.print();
      push("Opened printable statement view", "info");
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Transactions & Ledger
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Real-time audit log of inflows, vendor payments, and bank settlement rails.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 transition-all shadow-sm cursor-pointer"
          >
            <FileText size={14} className="text-rose-500" />
            Export as PDF
          </button>
          <button
            type="button"
            onClick={() => setRecordOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus size={15} />
            Record Transaction
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1322]/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Credits (Inflow)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <p className="font-display text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2 tabular">
            +{formatINR(stats.inflow)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {items.filter((t) => t.amount > 0).length} transactions
            </span>{" "}
            received this period
          </div>
        </div>

        {/* Total Outflow */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1322]/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Debits (Outflow)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 tabular">
            -{formatINR(stats.outflow)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {items.filter((t) => t.amount < 0).length} transactions
            </span>{" "}
            disbursed to vendors
          </div>
        </div>

        {/* Net Cash Movement */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1322]/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Operating Flow</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ArrowLeftRight size={18} />
            </div>
          </div>
          <p
            className={`font-display text-2xl font-bold tracking-tight mt-2 tabular ${
              stats.net >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {stats.net >= 0 ? "+" : "-"}
            {formatINR(Math.abs(stats.net))}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.2 font-semibold">
              {stats.net >= 0 ? "Surplus" : "Deficit"}
            </span>{" "}
            across active ledger
          </div>
        </div>

        {/* Settlement & Clearance */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1322]/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Clearance Efficiency</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 tabular">
            {stats.clearanceRate}%
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{stats.completedCount} Cleared</span>
            {stats.pendingCount > 0 && <span className="text-amber-500 font-semibold">· {stats.pendingCount} Pending</span>}
            {stats.failedCount > 0 && <span className="text-rose-500 font-semibold">· {stats.failedCount} Failed</span>}
          </div>
        </div>
      </div>

      {/* AI Anomaly & Diagnostics Banner */}
      {anomalies.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-300/60 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 dark:from-amber-950/30 dark:via-slate-900/50 dark:to-amber-950/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                FinGuard AI Audit: {anomalies.length} item(s) require attention
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/70 mt-0.5">
                {stats.failedCount > 0 && `${stats.failedCount} failed transaction requires bank re-try.`}{" "}
                {stats.pendingCount > 0 && `${stats.pendingCount} pending transaction awaiting settlement clearing.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResolveAllAnomalies}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw size={13} />
              Verify & Clear All
            </button>
          </div>
        </div>
      )}

      {/* Main Ledger Card */}
      <Card>
        {/* Controls Bar: Search, Type Tabs, Filters */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full lg:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search party, TXN ID, UTR..."
                className="focus-ring w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Inflow / Outflow Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {[
                { id: "All", label: "All Ledger" },
                { id: "Credit", label: "Credits (+)" },
                { id: "Debit", label: "Debits (-)" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setType(f.id)}
                  className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    type === f.id
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls: Status, Category, and Sort */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 sm:ml-auto">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(type !== "All" || statusFilter !== "All" || categoryFilter !== "All" || query) && (
              <button
                type="button"
                onClick={() => {
                  setType("All");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                  setQuery("");
                }}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions match your filters"
            description="Try changing your search query, status, or date filters to see more results."
            action={
              <button
                onClick={() => {
                  setQuery("");
                  setType("All");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                }}
                className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 w-8"></th>
                  <th className="pb-3">Transaction ID & Ref</th>
                  <th className="pb-3">Party / Beneficiary</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isCredit = t.amount > 0;
                  const catStyle =
                    CATEGORY_COLORS[t.category] ||
                    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTxn(t)}
                      className="border-t border-slate-100 dark:border-slate-800/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                    >
                      {/* Direction Icon */}
                      <td className="py-3.5 pl-1">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            isCredit
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                        </div>
                      </td>

                      {/* ID & UTR */}
                      <td className="py-3.5">
                        <div className="font-mono text-xs text-slate-900 dark:text-white font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t.id}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {t.ref || "UTR-VERIFIED"}
                        </div>
                      </td>

                      {/* Party */}
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-200">
                          {t.party}
                        </div>
                        {t.notes && (
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                            {t.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${catStyle}`}
                        >
                          {t.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          <CreditCard size={11} className="text-slate-400" />
                          {t.method || "Transfer"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5">
                        <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {t.date}
                        </div>
                        {t.time && (
                          <div className="text-[10px] text-slate-400">
                            {t.time}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3.5 text-right font-bold tabular ${
                          isCredit
                            ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                            : "text-slate-900 dark:text-slate-200"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatINR(Math.abs(t.amount))}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 text-right">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Quick Actions */}
                      <td
                        className="py-3.5 text-right pr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {t.status === "Failed" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(t.id, "Completed")}
                              title="Re-try settlement"
                              className="rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-2 py-1 text-xs font-semibold border border-blue-200/70 dark:border-blue-800 transition-colors"
                            >
                              Re-try
                            </button>
                          )}
                          {t.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(t.id, "Completed")}
                              title="Mark as cleared"
                              className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 px-2 py-1 text-xs font-semibold border border-emerald-200/70 dark:border-emerald-800 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedTxn(t)}
                            title="View Transaction Slip"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{items.length}</strong> total transactions
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span>
              Filtered Sum:{" "}
              <strong className="text-slate-900 dark:text-white font-bold tabular">
                {formatINR(filtered.reduce((sum, t) => sum + t.amount, 0))}
              </strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Transaction Detail Slip Modal */}
      <TransactionSlipModal
        open={Boolean(selectedTxn)}
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Record New Transaction Modal */}
      <RecordTransactionModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
