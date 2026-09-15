// All figures are illustrative mock data for a small business (INR).

export const overviewMetrics = [
  {
    id: "revenue",
    label: "Total revenue",
    value: 842300,
    change: 8.4,
    direction: "up",
    compare: "vs ₹7.77L last month",
    spark: [40, 44, 42, 48, 52, 50, 58, 61, 59, 66, 70, 74],
  },
  {
    id: "expenses",
    label: "Total expenses",
    value: 356900,
    change: 12.0,
    direction: "up",
    compare: "vs ₹3.19L last month",
    spark: [30, 32, 31, 35, 33, 38, 36, 40, 42, 41, 45, 48],
  },
  {
    id: "profit",
    label: "Net profit",
    value: 485400,
    change: 5.1,
    direction: "up",
    compare: "vs ₹4.62L last month",
    spark: [22, 24, 23, 28, 30, 29, 33, 35, 34, 38, 40, 41],
  },
  {
    id: "outstanding",
    label: "Outstanding payments",
    value: 128650,
    change: -3.6,
    direction: "down",
    compare: "vs ₹1.33L last month",
    spark: [50, 48, 49, 44, 46, 42, 40, 38, 39, 36, 35, 33],
  },
];

export const revenueVsExpenses = [
  { month: "Jan", revenue: 58, expenses: 32 },
  { month: "Feb", revenue: 61, expenses: 30 },
  { month: "Mar", revenue: 55, expenses: 34 },
  { month: "Apr", revenue: 67, expenses: 33 },
  { month: "May", revenue: 71, expenses: 36 },
  { month: "Jun", revenue: 69, expenses: 31 },
  { month: "Jul", revenue: 74, expenses: 35 },
  { month: "Aug", revenue: 79, expenses: 38 },
  { month: "Sep", revenue: 76, expenses: 34 },
  { month: "Oct", revenue: 82, expenses: 37 },
  { month: "Nov", revenue: 85, expenses: 39 },
  { month: "Dec", revenue: 88, expenses: 36 },
];

export const cashFlow = [
  { month: "Jan", net: 18 },
  { month: "Feb", net: 22 },
  { month: "Mar", net: 14 },
  { month: "Apr", net: 26 },
  { month: "May", net: 28 },
  { month: "Jun", net: 24 },
  { month: "Jul", net: 30 },
  { month: "Aug", net: 32 },
  { month: "Sep", net: 27 },
  { month: "Oct", net: 34 },
  { month: "Nov", net: 36 },
  { month: "Dec", net: 39 },
];

export const expenseBreakdown = [
  { name: "Payroll", value: 42, color: "#14E0C4" },
  { name: "Inventory", value: 24, color: "#4C7EFF" },
  { name: "Rent & utilities", value: 14, color: "#8B96AD" },
  { name: "Marketing", value: 12, color: "#FBBF57" },
  { name: "Other", value: 8, color: "#FF5C72" },
];

export const paymentStatus = [
  { name: "Paid", value: 68, color: "#2FD68C" },
  { name: "Pending", value: 22, color: "#FBBF57" },
  { name: "Overdue", value: 10, color: "#FF5C72" },
];

export const transactions = [
  { id: "TXN-8841", party: "Meridian Textiles", category: "Sales", date: "2026-09-08", time: "14:32 IST", amount: 48250, status: "Completed", type: "credit", method: "NEFT", ref: "UTR8921049281", notes: "Invoice INV-2451 settlement cleared via HDFC Bank" },
  { id: "TXN-8840", party: "Sundar Logistics", category: "Shipping", date: "2026-09-08", time: "11:15 IST", amount: -6200, status: "Completed", type: "debit", method: "UPI", ref: "UPI9038291039", notes: "Interstate freight delivery charges" },
  { id: "TXN-8839", party: "Aarav Retail Co.", category: "Sales", date: "2026-09-07", time: "16:45 IST", amount: 32100, status: "Completed", type: "credit", method: "IMPS", ref: "UTR7829104829", notes: "Advance payment for autumn retail consignment" },
  { id: "TXN-8838", party: "PowerGrid Utilities", category: "Utilities", date: "2026-09-07", time: "10:20 IST", amount: -8400, status: "Pending", type: "debit", method: "Corporate Card", ref: "CC-90281903", notes: "Commercial warehouse electric supply bill" },
  { id: "TXN-8837", party: "Nova Packaging", category: "Inventory", date: "2026-09-06", time: "15:00 IST", amount: -21500, status: "Completed", type: "debit", method: "NEFT", ref: "UTR6729104823", notes: "Corrugated box materials batch 2026-B" },
  { id: "TXN-8836", party: "Kiran Wholesale", category: "Sales", date: "2026-09-05", time: "13:10 IST", amount: 57800, status: "Completed", type: "credit", method: "RTGS", ref: "UTR5610293847", notes: "Bulk wholesale order dispatch cleared" },
  { id: "TXN-8835", party: "AdReach Media", category: "Marketing", date: "2026-09-04", time: "09:40 IST", amount: -12000, status: "Failed", type: "debit", method: "Corporate Card", ref: "CC-49201948", notes: "Digital campaign recharge - Bank gateway timeout" },
  { id: "TXN-8834", party: "Blue Harbor Exports", category: "Sales", date: "2026-09-03", time: "17:25 IST", amount: 91200, status: "Completed", type: "credit", method: "NEFT", ref: "UTR4510293848", notes: "Export container milestone payment cleared" },
  { id: "TXN-8833", party: "Amazon Web Services", category: "SaaS & Cloud", date: "2026-09-02", time: "04:10 IST", amount: -4850, status: "Completed", type: "debit", method: "Corporate Card", ref: "CC-38291048", notes: "Cloud hosting infrastructure & AI inference" },
  { id: "TXN-8832", party: "Staff Payroll - Aug", category: "Payroll", date: "2026-09-01", time: "09:00 IST", amount: -149900, status: "Completed", type: "debit", method: "IMPS", ref: "UTR3719204928", notes: "Monthly employee salaries & statutory deductions" },
  { id: "TXN-8831", party: "Zomato for Work", category: "Meals & Ops", date: "2026-08-30", time: "20:15 IST", amount: -3200, status: "Completed", type: "debit", method: "UPI", ref: "UPI8291039481", notes: "Quarterly review client hospitality expense" },
  { id: "TXN-8830", party: "Apex Global Traders", category: "Sales", date: "2026-08-28", time: "12:40 IST", amount: 64500, status: "Completed", type: "credit", method: "NEFT", ref: "UTR2819203948", notes: "Wholesale consignment settlement" },
];

export const invoices = [
  { id: "INV-2451", customer: "Meridian Textiles", amount: 48250, dueDate: "2026-09-15", date: "2026-08-15", status: "Paid", itemsCount: 4 },
  { id: "INV-2448", customer: "Meridian Textiles", amount: 62400, dueDate: "2026-08-20", date: "2026-07-20", status: "Paid", itemsCount: 3 },
  { id: "INV-2440", customer: "Meridian Textiles", amount: 55000, dueDate: "2026-07-15", date: "2026-06-15", status: "Paid", itemsCount: 2 },
  { id: "INV-2457", customer: "Meridian Textiles", amount: 48650, dueDate: "2026-09-28", date: "2026-08-28", status: "Sent", itemsCount: 5 },
  { id: "INV-2452", customer: "Aarav Retail Co.", amount: 32100, dueDate: "2026-09-18", date: "2026-09-03", status: "Due soon", itemsCount: 3 },
  { id: "INV-2445", customer: "Aarav Retail Co.", amount: 41800, dueDate: "2026-08-10", date: "2026-07-10", status: "Paid", itemsCount: 2 },
  { id: "INV-2439", customer: "Aarav Retail Co.", amount: 82300, dueDate: "2026-07-05", date: "2026-06-05", status: "Paid", itemsCount: 4 },
  { id: "INV-2453", customer: "Kiran Wholesale", amount: 57800, dueDate: "2026-09-16", date: "2026-09-01", status: "Due soon", itemsCount: 6 },
  { id: "INV-2458", customer: "Kiran Wholesale", amount: 34200, dueDate: "2026-09-25", date: "2026-08-25", status: "Sent", itemsCount: 2 },
  { id: "INV-2442", customer: "Kiran Wholesale", amount: 106700, dueDate: "2026-07-30", date: "2026-06-30", status: "Paid", itemsCount: 5 },
  { id: "INV-2454", customer: "Blue Harbor Exports", amount: 91200, dueDate: "2026-08-30", date: "2026-07-30", status: "Overdue", itemsCount: 4 },
  { id: "INV-2435", customer: "Blue Harbor Exports", amount: 48000, dueDate: "2026-06-25", date: "2026-05-25", status: "Paid", itemsCount: 2 },
  { id: "INV-2455", customer: "Nova Packaging", amount: 15300, dueDate: "2026-09-22", date: "2026-09-07", status: "Sent", itemsCount: 2 },
  { id: "INV-2447", customer: "Nova Packaging", amount: 27000, dueDate: "2026-08-15", date: "2026-07-15", status: "Paid", itemsCount: 3 },
  { id: "INV-2456", customer: "Sundar Logistics", amount: 9800, dueDate: "2026-09-28", date: "2026-08-28", status: "Draft", itemsCount: 1 },
];

export const customers = [
  {
    id: "CUST-001",
    name: "Meridian Textiles",
    contactPerson: "Vikram Singhania",
    email: "accounts@meridiantextiles.com",
    phone: "+91 98201 44521",
    city: "Surat, Gujarat",
    address: "Plot 42, GIDC Industrial Estate, Ring Road, Surat, Gujarat - 395023",
    gstin: "24AAACM1234F1Z5",
    paymentTerms: "Net 30 Days",
    creditLimit: 350000,
    onTimeRate: 96,
    category: "Textiles & Fabrics",
    totalBilled: 214300,
    invoicesCount: 6,
    status: "Active",
    aiNote: "Excellent customer track record. Average settlement time is 18 days.",
  },
  {
    id: "CUST-002",
    name: "Aarav Retail Co.",
    contactPerson: "Aarav Mehta",
    email: "billing@aaravretail.in",
    phone: "+91 99102 33412",
    city: "Mumbai, Maharashtra",
    address: "B-204, Lodha Boulevard, Andheri East, Mumbai, Maharashtra - 400069",
    gstin: "27AABCA5678G1Z2",
    paymentTerms: "Net 15 Days",
    creditLimit: 200000,
    onTimeRate: 92,
    category: "Retail FMCG",
    totalBilled: 156200,
    invoicesCount: 4,
    status: "Active",
    aiNote: "Invoice INV-2452 due soon (₹32,100). WhatsApp reminder queued.",
  },
  {
    id: "CUST-003",
    name: "Kiran Wholesale",
    contactPerson: "Kiran Chawla",
    email: "finance@kiranwholesale.com",
    phone: "+91 98450 88219",
    city: "Ahmedabad, Gujarat",
    address: "12, APMC Market Complex, Naroda Road, Ahmedabad, Gujarat - 382330",
    gstin: "24AACKW9012H1Z8",
    paymentTerms: "Net 30 Days",
    creditLimit: 300000,
    onTimeRate: 88,
    category: "Wholesale Distribution",
    totalBilled: 198700,
    invoicesCount: 5,
    status: "Active",
    aiNote: "Two active receivables totaling ₹92,000. Moderate risk rating.",
  },
  {
    id: "CUST-004",
    name: "Blue Harbor Exports",
    contactPerson: "Capt. Ramesh Pillai",
    email: "procurement@blueharborexports.com",
    phone: "+91 94441 77290",
    city: "Chennai, Tamil Nadu",
    address: "Suite 501, Marine House, Rajaji Salai, Chennai, Tamil Nadu - 600001",
    gstin: "33AABCB3456J1Z1",
    paymentTerms: "Net 45 Days",
    creditLimit: 150000,
    onTimeRate: 64,
    category: "Export & Logistics",
    totalBilled: 91200,
    invoicesCount: 2,
    status: "Overdue",
    aiNote: "CRITICAL: Invoice INV-2454 (₹91,200) is 15+ days overdue. Recommend immediate follow-up.",
  },
  {
    id: "CUST-005",
    name: "Nova Packaging",
    contactPerson: "Neha Agarwal",
    email: "accounts@novapackaging.com",
    phone: "+91 98110 55670",
    city: "Bengaluru, Karnataka",
    address: "78, Peenya Industrial Area, 3rd Phase, Bengaluru, Karnataka - 560058",
    gstin: "29AACNP7890K1Z4",
    paymentTerms: "Net 15 Days",
    creditLimit: 100000,
    onTimeRate: 98,
    category: "Packaging Materials",
    totalBilled: 42300,
    invoicesCount: 3,
    status: "Active",
    aiNote: "Strong financial standing. Current bill of ₹15,300 sent and well within term.",
  },
];

export const aiInsights = [
  { id: 1, tone: "warning", text: "Your spending increased by 12% this month, mostly in inventory and marketing." },
  { id: 2, tone: "alert", text: "3 invoices are approaching their due date within the next 5 days." },
  { id: 3, tone: "positive", text: "You could reduce operational expenses by approximately ₹8,500 by consolidating shipping vendors." },
  { id: 4, tone: "warning", text: "Your current credit utilization is higher than last month — now at 46%." },
];

export const suggestedQuestions = [
  "Why did my expenses go up this month?",
  "Which invoices should I follow up on first?",
  "How can I improve my credit score?",
  "Where can I safely cut costs?",
];

export const spendingScore = { score: 78, label: "Healthy", delta: 3 };
export const creditScore = { score: 742, max: 900, label: "Good", delta: -8 };
export const creditUtilization = { percent: 46, delta: 6 };

export const creditHistory = [
  { month: "Apr", score: 720 },
  { month: "May", score: 726 },
  { month: "Jun", score: 733 },
  { month: "Jul", score: 738 },
  { month: "Aug", score: 750 },
  { month: "Sep", score: 742 },
];

export const creditRecommendations = [
  "Pay down ₹18,000 on your business credit line to bring utilization under 35%.",
  "Your on-time payment streak is 6 months — keep it going to lift your score further.",
  "Avoid opening new credit lines in the next 60 days; it may temporarily lower your score.",
];

export const revenueReport = [
  { category: "Product sales", amount: 512300 },
  { category: "Services", amount: 218400 },
  { category: "Wholesale", amount: 89200 },
  { category: "Other income", amount: 22400 },
];

export const expenseReport = [
  { category: "Payroll", amount: 149900 },
  { category: "Inventory", amount: 85600 },
  { category: "Rent & utilities", amount: 49900 },
  { category: "Marketing", amount: 42800 },
  { category: "Other", amount: 28700 },
];



export function formatINR(amount) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}
