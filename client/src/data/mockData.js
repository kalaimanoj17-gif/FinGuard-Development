export const BUSINESS_PROFILE = {
  name: "ABC Traders",
  legalName: "ABC Trading Solutions Pvt Ltd",
  businessId: "B001",
  entityType: "Private Limited",
  gstin: "27AABCU9603R1ZM",
  pan: "AABCU9603R",
  primaryBank: "ABC Traders Business Account (#8892)",
  currency: "INR",
  currencySymbol: "₹",
  fiscalYear: "FY 2026-27",
  complianceRegion: "India (GST Rules)",
  lastSyncTime: "2 mins ago"
};

export const FINANCIAL_HEALTH_SCORE = {
  score: 72,
  status: "MEDIUM",
  change: "Requires GST action",
  factors: [
    { label: "GST Compliance", status: "Pending (Due 10 Sep)", score: 65, weight: "High" },
    { label: "Pending Payments", status: "1 Invoice Overdue", score: 75, weight: "High" },
    { label: "Financial Risk", status: "1 Duplicate Flag", score: 76, weight: "Critical" }
  ]
};

export const AI_ACTIONS = [
  {
    id: "action-1",
    severity: "HIGH",
    title: "Potential Duplicate Invoice: INV001 ↔ INV002",
    subtitle: "ABC Suppliers submitted Invoice #INV002 (₹25,000) matching items, date, and amount of #INV001.",
    category: "Fraud & Risk",
    potentialSaving: "₹25,000",
    timeDetected: "10 mins ago",
    actionType: "Review Action",
    details: {
      vendor: "ABC Suppliers",
      invoiceNumber: "INV002",
      matchingNumber: "INV001",
      amount: 25000,
      confidence: "99.2% Match",
      reasons: [
        "Same vendor (ABC Suppliers)",
        "Same amount (₹25,000)",
        "Same invoice date (03 Sep 2026)",
        "Same business (ABC Traders)"
      ]
    }
  },
  {
    id: "action-2",
    severity: "IMPORTANT",
    title: "GST Filing Pending (Due 10 September 2026)",
    subtitle: "GSTR-1 return for August is calculated and ready for filing before the 10 Sep deadline.",
    category: "Compliance",
    potentialSaving: "Penalty Avoidance",
    timeDetected: "1 hour ago",
    actionType: "Handle",
    details: {
      period: "August 2026",
      dueDate: "10 September 2026",
      status: "Pending",
      recommendation: "Complete the pending GST filing before the due date and clear the outstanding tax payment."
    }
  },
  {
    id: "action-3",
    severity: "WATCH",
    title: "Tax Payment Pending",
    subtitle: "Q2 Tax Liability estimate calculated. Last filing date was 10 August 2026.",
    category: "Compliance",
    potentialSaving: "Tax Compliance",
    timeDetected: "3 hours ago",
    actionType: "Review",
    details: {
      lastFilingDate: "10 August 2026",
      taxStatus: "Pending Payment",
      recommendation: "Review tax payment ledger before final submission."
    }
  }
];

export const CASH_OVERVIEW = {
  totalCash: 185000,
  netCashFlowMonth: 35000,
  cashInflowMonth: 125000,
  cashOutflowMonth: 90000,
  runwayMonths: 7.2,
  trendData: [
    { month: "Apr", balance: 130000, inflow: 85000, outflow: 70000 },
    { month: "May", balance: 145000, inflow: 92000, outflow: 77000 },
    { month: "Jun", balance: 155000, inflow: 98000, outflow: 88000 },
    { month: "Jul", balance: 165000, inflow: 110000, outflow: 100000 },
    { month: "Aug", balance: 185000, inflow: 125000, outflow: 90000 }
  ]
};

export const INVOICE_OVERVIEW = {
  pendingAmount: 70000,
  pendingCount: 3,
  overdueAmount: 62000,
  overdueCount: 1,
  paidThisMonth: 18500,
  paidCount: 12,
  collectionScore: 88
};

export const INVOICES_LIST = [
  { id: "INV001", customer: "ABC Suppliers", amount: 25000, gstAmount: 4500, date: "2026-09-03", dueDate: "2026-09-17", status: "Flagged Duplicate", aiRisk: "HIGH Duplicate Risk", paymentTerms: "Net 15" },
  { id: "INV002", customer: "ABC Suppliers", amount: 25000, gstAmount: 4500, date: "2026-09-03", dueDate: "2026-09-17", status: "Flagged Duplicate", aiRisk: "HIGH Duplicate Risk", paymentTerms: "Net 15" },
  { id: "INV003", customer: "Summit Enterprises", amount: 45000, gstAmount: 8100, date: "2026-08-28", dueDate: "2026-09-12", status: "Pending", aiRisk: "Low Risk", paymentTerms: "Net 15" },
  { id: "INV004", customer: "Vanguard Supplies", amount: 18500, gstAmount: 3330, date: "2026-08-15", dueDate: "2026-08-30", status: "Paid", aiRisk: "On Time", paymentTerms: "Net 15" },
  { id: "INV005", customer: "Starlight Trade", amount: 62000, gstAmount: 11160, date: "2026-08-01", dueDate: "2026-08-16", status: "Overdue", aiRisk: "High Delay Risk", paymentTerms: "Net 15" }
];

export const EXPENSE_OVERVIEW = {
  totalMonth: 185000,
  budget: 220000,
  spendInsight: "Inventory spending increased compared with the previous period.",
  spendingControls: {
    singleLimit: 50000,
    monthlyInventoryBudget: 100000,
    reviewRequiredAbove: 25000
  },
  categoryBreakdown: [
    { category: "Inventory", amount: 85000, color: "#0d9488", percentage: 46 },
    { category: "Operations", amount: 45000, color: "#2563eb", percentage: 24 },
    { category: "Transport", amount: 25000, color: "#6366f1", percentage: 14 },
    { category: "Software", amount: 18000, color: "#16a34a", percentage: 10 },
    { category: "Utilities", amount: 12000, color: "#d97706", percentage: 6 }
  ]
};

export const EXPENSES_LIST = [
  { id: "EXP001", vendor: "ABC Suppliers", category: "Inventory", amount: 25000, date: "2026-09-03", receipt: "Verified OCR", aiStatus: "Flagged Duplicate", approval: "Pending Review" },
  { id: "EXP002", vendor: "Metro Operations Hub", category: "Operations", amount: 45000, date: "2026-09-01", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" },
  { id: "EXP003", vendor: "Express Logistics", category: "Transport", amount: 25000, date: "2026-08-28", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" },
  { id: "EXP004", vendor: "Cloud SaaS Services", category: "Software", amount: 18000, date: "2026-08-25", receipt: "Auto-synced", aiStatus: "Normal", approval: "Approved" },
  { id: "EXP005", vendor: "City Utilities Ltd", category: "Utilities", amount: 12000, date: "2026-08-20", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" }
];

export const TRANSACTIONS_LIST = [
  { id: "TXN001", date: "2026-09-03", description: "ABC Suppliers", amount: -25000, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 98, category: "Inventory", status: "UNRECONCILED", suggestedMatch: "INV001" },
  { id: "TXN002", date: "2026-09-02", description: "Summit Enterprises Payment", amount: +45000, type: "CREDIT", account: "ABC Traders Business Account", matchConfidence: 99, category: "Customer Payment", status: "Reconciled", suggestedMatch: "INV003" },
  { id: "TXN003", date: "2026-08-30", description: "Vanguard Store Equipment", amount: -18500, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 97, category: "Operations", status: "Reconciled", suggestedMatch: "INV004" },
  { id: "TXN004", date: "2026-08-28", description: "Unmapped Supplier Wire", amount: -28000, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 64, category: "Uncategorized", status: "UNRECONCILED", suggestedMatch: "INV005 (Amount Differs by ₹3,000)" }
];

export const COMPLIANCE_DATA = {
  complianceScore: 72,
  riskLevel: "MEDIUM",
  gstFilingStatus: "Pending",
  gstDueDate: "10 September 2026",
  taxFilingStatus: "Completed",
  taxPaymentStatus: "Pending",
  lastFilingDate: "10 August 2026",
  recommendation: "Complete the pending GST filing before the due date and clear the outstanding tax payment.",
  unclaimedItc: 18400,
  taxLiability: 45000,
  filingHistory: [
    { period: "July 2026", gstr1: "Filed (Ref #GST-9921)", gstr3b: "Filed (Ref #GST-9945)", status: "Compliant" },
    { period: "June 2026", gstr1: "Filed (Ref #GST-8812)", gstr3b: "Filed (Ref #GST-8839)", status: "Compliant" }
  ]
};

export const FRAUD_SECURITY_DATA = {
  securityPostureScore: 72,
  riskLevel: "MEDIUM Risk",
  activeAlertsCount: 1,
  duplicateInvoicesCount: 1,
  highRiskAlert: {
    severity: "HIGH",
    title: "Potential Duplicate Invoice: INV001 ↔ INV002",
    vendor: "ABC Suppliers",
    amount: 25000,
    date: "03 Sep 2026",
    reasons: [
      "Same vendor (ABC Suppliers)",
      "Same amount (₹25,000)",
      "Same invoice date (03 Sep 2026)",
      "Same business (ABC Traders)"
    ]
  }
};

export const CASH_FORECAST_DATA = [
  { week: "Wk 1", baseline: 185000, optimized: 185000 },
  { week: "Wk 2", baseline: 195000, optimized: 202000 },
  { week: "Wk 3", baseline: 205000, optimized: 218000 },
  { week: "Wk 4", baseline: 215000, optimized: 232000 },
  { week: "Wk 5", baseline: 225000, optimized: 245000 },
  { week: "Wk 6", baseline: 235000, optimized: 258000 },
  { week: "Wk 7", baseline: 245000, optimized: 271000 },
  { week: "Wk 8", baseline: 255000, optimized: 285000 }
];

export const REPORTS_DATA = [
  { id: "rep-1", title: "Profit & Loss Statement", period: "Q2 FY 2026-27", status: "Generated", type: "Financial" },
  { id: "rep-2", title: "Cash Flow Statement", period: "August 2026", status: "Generated", type: "Cashflow" },
  { id: "rep-3", title: "Expense Breakdown Report", period: "August 2026", status: "Generated", type: "Spend" },
  { id: "rep-4", title: "GST & Tax Summary", period: "Q2 FY 2026-27", status: "Pending Filing", type: "Tax" }
];

export const COPILOT_SUGGESTIONS = [
  "What should I do today?",
  "Which invoice should I review?",
  "Why is my compliance score 72?",
  "Where am I spending the most?",
  "Why was this transaction flagged?",
  "Can I afford a ₹50,000 purchase?",
  "Is my cash flow healthy?",
  "What is my biggest financial risk?"
];

export const COPILOT_INITIAL_MESSAGES = [
  {
    sender: "ai",
    timestamp: "10:30 AM",
    text: "Good morning! I am FinGuard Copilot. Your financial health score is 72/100 (MEDIUM risk). You have 1 High Risk duplicate invoice alert (INV001 ↔ INV002 for ₹25,000 from ABC Suppliers) and GST filing pending due 10 September 2026. How can I assist you today?"
  }
];
