import React, { useState, useMemo } from "react";
import Card from "../components/Card";
import { StatusBadge } from "../components/ui";
import { customers as seedCustomers, formatINR } from "../data/mockData";
import { useInvoices } from "../context/InvoiceContext";
import CustomerDetailModal from "../components/CustomerDetailModal";
import {
  Search,
  Users,
  AlertCircle,
  Receipt,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Building2,
  Filter,
} from "lucide-react";

export default function Customers() {
  const { invoices } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'pending' | 'overdue' | 'clear'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Compute live financial totals per customer from invoice context
  const customersWithStats = useMemo(() => {
    return seedCustomers.map((c) => {
      const custInvoices = invoices.filter(
        (inv) => inv.customer?.toLowerCase() === c.name?.toLowerCase()
      );
      const pendingInvoices = custInvoices.filter(
        (inv) => inv.status !== "Paid"
      );
      const overdueInvoices = custInvoices.filter(
        (inv) => inv.status === "Overdue"
      );
      const totalPending = pendingInvoices.reduce(
        (sum, inv) => sum + (inv.amount || 0),
        0
      );

      return {
        ...c,
        invoicesCount: custInvoices.length,
        pendingCount: pendingInvoices.length,
        overdueCount: overdueInvoices.length,
        totalPending,
        hasOverdue: overdueInvoices.length > 0,
        hasPending: pendingInvoices.length > 0,
      };
    });
  }, [invoices]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customersWithStats.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.contactPerson?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterTab === "pending") return c.hasPending;
      if (filterTab === "overdue") return c.hasOverdue;
      if (filterTab === "clear") return !c.hasPending;
      return true;
    });
  }, [customersWithStats, searchQuery, filterTab]);

  const totalOutstandingAll = customersWithStats.reduce(
    (sum, c) => sum + c.totalPending,
    0
  );
  const overdueCustomerCount = customersWithStats.filter((c) => c.hasOverdue).length;

  const handleOpenCustomer = (c) => {
    setSelectedCustomer(c);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Customers & Accounts
            </h1>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/70">
              {seedCustomers.length} active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Click on any customer to inspect their full profile, contact info, and pending bills.
          </p>
        </div>

        {/* Global Outstanding Highlight */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1322]/95 px-4 py-2.5 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Receivables
            </span>
            <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
              {formatINR(totalOutstandingAll)}
            </span>
          </div>
          {overdueCustomerCount > 0 && (
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 px-4 py-2.5 shadow-sm">
              <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider block">
                Overdue Accounts
              </span>
              <span className="font-display text-base font-extrabold text-rose-600 dark:text-rose-400">
                {overdueCustomerCount} client{overdueCustomerCount === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, contact person, city, or GSTIN…"
            className="focus-ring w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0C1322]/90 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`focus-ring rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterTab === "all"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            All ({customersWithStats.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("pending")}
            className={`focus-ring flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterTab === "pending"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Receipt size={13} />
            Has Pending (
            {customersWithStats.filter((c) => c.hasPending).length}
            )
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("overdue")}
            className={`focus-ring flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterTab === "overdue"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-500/25"
                : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <AlertCircle size={13} />
            Overdue (
            {customersWithStats.filter((c) => c.hasOverdue).length}
            )
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("clear")}
            className={`focus-ring flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterTab === "clear"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <CheckCircle2 size={13} />
            All Clear (
            {customersWithStats.filter((c) => !c.hasPending).length}
            )
          </button>
        </div>
      </div>

      {/* Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1322]/95 p-12 text-center shadow-card">
          <Users size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
            No customers match your criteria
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search keywords or clear filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((c) => {
            const initials = c.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={c.name}
                onClick={() => handleOpenCustomer(c)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleOpenCustomer(c);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-200 cursor-pointer bg-white dark:bg-[#0C1322]/95 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 ${
                  c.hasOverdue
                    ? "border-rose-200/80 dark:border-rose-900/60 hover:border-rose-400/90 dark:hover:border-rose-500"
                    : c.hasPending
                    ? "border-amber-200/70 dark:border-amber-900/50 hover:border-blue-400/80 dark:hover:border-blue-500"
                    : "border-slate-100 dark:border-slate-800/80 hover:border-blue-400/80 dark:hover:border-blue-500"
                }`}
              >
                <div>
                  {/* Card Header: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 font-display text-sm font-extrabold text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        {initials}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-slate-400" />
                          {c.city || "India"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={c.status} />
                      {c.hasOverdue && (
                        <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Person */}
                  {c.contactPerson && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50/70 dark:bg-slate-900/60 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 text-[11px]">Contact Person:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.contactPerson}</span>
                    </div>
                  )}

                  {/* Financial Status Strip */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/70 pt-3">
                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Pending Bills
                      </p>
                      <p
                        className={`font-display text-base font-extrabold tabular ${
                          c.totalPending > 0
                            ? c.hasOverdue
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {c.totalPending > 0 ? formatINR(c.totalPending) : "₹0 (Clear)"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Total Billed
                      </p>
                      <p className="font-display text-base font-bold tabular text-slate-900 dark:text-white">
                        {formatINR(c.totalBilled || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Link / Cue */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/70 pt-3 text-xs">
                  <span className="text-[11px] font-medium text-slate-400">
                    {c.invoicesCount} invoices on record
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-all">
                    <span>View Bills & Profile</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Details & Pending Bills Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
