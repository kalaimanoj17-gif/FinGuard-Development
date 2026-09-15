// Centralized In-Memory Data Store for FinGuard AI Backend

export const store = {
  users: [
    {
      id: "usr-001",
      email: "admin@abctraders.com",
      password: "FinGuard@123",
      name: "Business Owner",
      role: "Business Owner / Admin",
      business: "ABC Traders",
      businessId: "B001"
    }
  ],

  settings: {
    sensitivity: 85,
    autoApproveMatches: true,
    emailAlerts: true
  },

  businessProfile: {
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
    lastSyncTime: "Just now"
  },

  complianceData: {
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
      { id: "fh-1", period: "July 2026", gstr1: "Filed (Ref #GST-9921)", gstr3b: "Filed (Ref #GST-9945)", status: "Compliant" },
      { id: "fh-2", period: "June 2026", gstr1: "Filed (Ref #GST-8812)", gstr3b: "Filed (Ref #GST-8839)", status: "Compliant" }
    ]
  },

  aiActions: [
    {
      id: "action-1",
      severity: "HIGH",
      title: "Potential Duplicate Invoice: INV001 ↔ INV002",
      subtitle: "ABC Suppliers submitted Invoice #INV002 (₹25,000) matching items, date, and amount of #INV001.",
      category: "Fraud & Risk",
      potentialSaving: "₹25,000",
      timeDetected: "10 mins ago",
      actionType: "Review Action",
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
      details: {
        lastFilingDate: "10 August 2026",
        taxStatus: "Pending Payment",
        recommendation: "Review tax payment ledger before final submission."
      }
    }
  ],

  invoices: [
    { id: "INV001", customer: "ABC Suppliers", amount: 25000, gstAmount: 4500, date: "2026-09-03", dueDate: "2026-09-17", status: "Flagged Duplicate", aiRisk: "HIGH Duplicate Risk", paymentTerms: "Net 15" },
    { id: "INV002", customer: "ABC Suppliers", amount: 25000, gstAmount: 4500, date: "2026-09-03", dueDate: "2026-09-17", status: "Flagged Duplicate", aiRisk: "HIGH Duplicate Risk", paymentTerms: "Net 15" },
    { id: "INV003", customer: "Summit Enterprises", amount: 45000, gstAmount: 8100, date: "2026-08-28", dueDate: "2026-09-12", status: "Pending", aiRisk: "Low Risk", paymentTerms: "Net 15" },
    { id: "INV004", customer: "Vanguard Supplies", amount: 18500, gstAmount: 3330, date: "2026-08-15", dueDate: "2026-08-30", status: "Paid", aiRisk: "On Time", paymentTerms: "Net 15" },
    { id: "INV005", customer: "Starlight Trade", amount: 62000, gstAmount: 11160, date: "2026-08-01", dueDate: "2026-08-16", status: "Overdue", aiRisk: "High Delay Risk", paymentTerms: "Net 15" }
  ],

  expenses: [
    { id: "EXP001", vendor: "ABC Suppliers", category: "Inventory", amount: 25000, date: "2026-09-03", receipt: "Verified OCR", aiStatus: "Flagged Duplicate", approval: "Pending Review" },
    { id: "EXP002", vendor: "Metro Operations Hub", category: "Operations", amount: 45000, date: "2026-09-01", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" },
    { id: "EXP003", vendor: "Express Logistics", category: "Transport", amount: 25000, date: "2026-08-28", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" },
    { id: "EXP004", vendor: "Cloud SaaS Services", category: "Software", amount: 18000, date: "2026-08-25", receipt: "Auto-synced", aiStatus: "Normal", approval: "Approved" },
    { id: "EXP005", vendor: "City Utilities Ltd", category: "Utilities", amount: 12000, date: "2026-08-20", receipt: "Verified OCR", aiStatus: "Normal", approval: "Approved" }
  ],

  transactions: [
    { id: "TXN001", date: "2026-09-03", description: "ABC Suppliers", amount: -25000, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 98, category: "Inventory", status: "UNRECONCILED", suggestedMatch: "INV001" },
    { id: "TXN002", date: "2026-09-02", description: "Summit Enterprises Payment", amount: +45000, type: "CREDIT", account: "ABC Traders Business Account", matchConfidence: 99, category: "Customer Payment", status: "Reconciled", suggestedMatch: "INV003" },
    { id: "TXN003", date: "2026-08-30", description: "Vanguard Store Equipment", amount: -18500, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 97, category: "Operations", status: "Reconciled", suggestedMatch: "INV004" },
    { id: "TXN004", date: "2026-08-28", description: "Unmapped Supplier Wire", amount: -28000, type: "DEBIT", account: "ABC Traders Business Account", matchConfidence: 64, category: "Uncategorized", status: "UNRECONCILED", suggestedMatch: "INV005 (Amount Differs by ₹3,000)" }
  ],

  cash_flow: [
    // Actual Income records
    { id: "cf-1", business_id: "B001", business_name: "ABC Traders", date: "2026-08-01", type: "Income", category: "Sales Revenue", description: "Batch Store Sales Settlement", amount: 64000, status: "Actual" },
    { id: "cf-2", business_id: "B001", business_name: "ABC Traders", date: "2026-08-05", type: "Income", category: "Sales Revenue", description: "Wholesale Inventory Clearance", amount: 72000, status: "Actual" },
    { id: "cf-3", business_id: "B001", business_name: "ABC Traders", date: "2026-08-12", type: "Income", category: "Sales Revenue", description: "Mid-month Retail Inflow", amount: 58000, status: "Actual" },
    { id: "cf-4", business_id: "B001", business_name: "ABC Traders", date: "2026-08-20", type: "Income", category: "Client Payment", description: "Summit Enterprises Invoice Deposit", amount: 60000, status: "Actual" },
    { id: "cf-5", business_id: "B001", business_name: "ABC Traders", date: "2026-08-28", type: "Income", category: "Client Payment", description: "Vanguard Supplies Settlement", amount: 40000, status: "Actual" },

    // Actual Expense records
    { id: "cf-6", business_id: "B001", business_name: "ABC Traders", date: "2026-08-01", type: "Expense", category: "Logistics", description: "Freight & Haulage Fee", amount: 5200, status: "Actual" },
    { id: "cf-7", business_id: "B001", business_name: "ABC Traders", date: "2026-08-05", type: "Expense", category: "Utilities", description: "Store Electricity & Power", amount: 8000, status: "Actual" },
    { id: "cf-8", business_id: "B001", business_name: "ABC Traders", date: "2026-08-12", type: "Expense", category: "Operations", description: "Packaging & Supplies", amount: 6000, status: "Actual" },
    { id: "cf-9", business_id: "B001", business_name: "ABC Traders", date: "2026-08-20", type: "Expense", category: "Software", description: "SaaS Platform Subscription", amount: 7000, status: "Actual" },
    { id: "cf-10", business_id: "B001", business_name: "ABC Traders", date: "2026-08-28", type: "Expense", category: "Maintenance", description: "Store Repairs & Servicing", amount: 5000, status: "Actual" },

    // Expected Target records
    { id: "cf-11", business_id: "B001", business_name: "ABC Traders", date: "2026-08-31", type: "Income", category: "Target Forecast", description: "Expected Monthly Inflow Target", amount: 200000, status: "Expected" },
    { id: "cf-12", business_id: "B001", business_name: "ABC Traders", date: "2026-08-31", type: "Expense", category: "Target Forecast", description: "Expected Monthly Outflow Target", amount: 120000, status: "Expected" }
  ],

  reports: [
    { id: "rep-1", title: "Profit & Loss Statement", period: "Q2 FY 2026-27", status: "Generated", type: "Financial", generatedAt: "2026-09-01" },
    { id: "rep-2", title: "Cash Flow Statement", period: "August 2026", status: "Generated", type: "Cashflow", generatedAt: "2026-09-01" },
    { id: "rep-3", title: "Expense Breakdown Report", period: "August 2026", status: "Generated", type: "Spend", generatedAt: "2026-08-31" },
    { id: "rep-4", title: "GST & Tax Summary", period: "Q2 FY 2026-27", status: "Pending Filing", type: "Tax", generatedAt: "2026-09-05" }
  ],

  copilotMessages: [
    { id: "msg-0",
      sender: "ai",
      timestamp: "10:30 AM",
      text: "Good morning! I am FinGuard Copilot. Your financial health score is 72/100 (MEDIUM risk). You have 1 High Risk duplicate invoice alert (INV001 ↔ INV002 for ₹25,000 from ABC Suppliers) and GST filing pending due 10 September 2026. How can I assist you today?"
    }
  ],

  inventory: [
    { id: "SKU-001", item: "Sugar 1kg", category: "Staples", currentStock: 7, minimumStock: 20, unitPrice: 45, status: "Critical" },
    { id: "SKU-002", item: "Rice 25kg", category: "Grains", currentStock: 6, minimumStock: 10, unitPrice: 1350, status: "Low Stock" },
    { id: "SKU-003", item: "Cooking Oil 5L", category: "Oils", currentStock: 25, minimumStock: 12, unitPrice: 750, status: "Healthy" },
    { id: "SKU-004", item: "Wheat Flour 10kg", category: "Grains", currentStock: 18, minimumStock: 8, unitPrice: 420, status: "Healthy" },
    { id: "SKU-005", item: "Toor Dal 1kg", category: "Pulses", currentStock: 30, minimumStock: 15, unitPrice: 160, status: "Healthy" }
  ]
};


