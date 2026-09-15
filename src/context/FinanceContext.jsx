import React, { createContext, useContext, useState, useMemo } from "react";

export const PERIOD_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "This quarter",
  "This year",
];

const PERIOD_DATA = {
  "Last 7 days": {
    label: "Last 7 days",
    dateRangeText: "02 Sep 2026 – 08 Sep 2026",
    sublabel: "Past 7 days performance",
    revenue: 229350,
    revenueChange: 11.8,
    revenueCompare: "vs ₹2.05L prev 7 days",
    revenueSpark: [24, 91, 0, 58, 0, 32, 48],

    expenses: 48100,
    expensesChange: -4.2,
    expensesCompare: "vs ₹50.2K prev 7 days",
    expensesSpark: [8, 0, 12, 0, 22, 8, 6],

    profit: 181250,
    profitChange: 17.1,
    profitCompare: "vs ₹1.55L prev 7 days",
    profitSpark: [16, 91, -12, 58, -22, 24, 42],

    outstanding: 89900,
    outstandingChange: -12.4,
    outstandingCompare: "vs ₹1.02L prev 7 days",
    outstandingSpark: [98, 95, 92, 91, 90, 90, 89],

    revenueVsExpenses: [
      { month: "Wed (Sep 2)", revenue: 24, expenses: 8 },
      { month: "Thu (Sep 3)", revenue: 91, expenses: 0 },
      { month: "Fri (Sep 4)", revenue: 0, expenses: 12 },
      { month: "Sat (Sep 5)", revenue: 58, expenses: 0 },
      { month: "Sun (Sep 6)", revenue: 0, expenses: 22 },
      { month: "Mon (Sep 7)", revenue: 32, expenses: 8 },
      { month: "Tue (Sep 8)", revenue: 48, expenses: 6 },
    ],

    cashFlow: [
      { month: "Sep 2", net: 16 },
      { month: "Sep 3", net: 91 },
      { month: "Sep 4", net: -12 },
      { month: "Sep 5", net: 58 },
      { month: "Sep 6", net: -22 },
      { month: "Sep 7", net: 24 },
      { month: "Sep 8", net: 42 },
    ],

    expenseBreakdown: [
      { name: "Inventory", value: 45, color: "#4C7EFF" },
      { name: "Marketing", value: 25, color: "#FBBF57" },
      { name: "Shipping & logistics", value: 17, color: "#14E0C4" },
      { name: "Utilities", value: 13, color: "#FF5C72" },
    ],

    paymentStatus: [
      { name: "Paid", value: 72, color: "#2FD68C" },
      { name: "Pending", value: 18, color: "#FBBF57" },
      { name: "Overdue", value: 10, color: "#FF5C72" },
    ],

    revenueReport: [
      { category: "Product sales", amount: 142200 },
      { category: "Services", amount: 58400 },
      { category: "Wholesale", amount: 24350 },
      { category: "Other income", amount: 4400 },
    ],

    expenseReport: [
      { category: "Inventory", amount: 21500 },
      { category: "Marketing", amount: 12000 },
      { category: "Shipping", amount: 8200 },
      { category: "Utilities", amount: 6400 },
    ],

    spendingScore: { score: 84, label: "Excellent", delta: 6 },
    creditScore: { score: 746, max: 900, label: "Good", delta: 4 },
    creditUtilization: { percent: 38, delta: -4 },
  },

  "Last 30 days": {
    label: "Last 30 days",
    dateRangeText: "10 Aug 2026 – 08 Sep 2026",
    sublabel: "Past 30 days performance",
    revenue: 842300,
    revenueChange: 8.4,
    revenueCompare: "vs ₹7.77L last month",
    revenueSpark: [40, 44, 42, 48, 52, 50, 58, 61, 59, 66, 70, 74],

    expenses: 356900,
    expensesChange: 12.0,
    expensesCompare: "vs ₹3.19L last month",
    expensesSpark: [30, 32, 31, 35, 33, 38, 36, 40, 42, 41, 45, 48],

    profit: 485400,
    profitChange: 5.1,
    profitCompare: "vs ₹4.62L last month",
    profitSpark: [22, 24, 23, 28, 30, 29, 33, 35, 34, 38, 40, 41],

    outstanding: 128650,
    outstandingChange: -3.6,
    outstandingCompare: "vs ₹1.33L last month",
    outstandingSpark: [50, 48, 49, 44, 46, 42, 40, 38, 39, 36, 35, 33],

    revenueVsExpenses: [
      { month: "Week 1", revenue: 195, expenses: 82 },
      { month: "Week 2", revenue: 218, expenses: 94 },
      { month: "Week 3", revenue: 204, expenses: 88 },
      { month: "Week 4", revenue: 225, expenses: 93 },
    ],

    cashFlow: [
      { month: "Week 1", net: 113 },
      { month: "Week 2", net: 124 },
      { month: "Week 3", net: 116 },
      { month: "Week 4", net: 132 },
    ],

    expenseBreakdown: [
      { name: "Payroll", value: 42, color: "#14E0C4" },
      { name: "Inventory", value: 24, color: "#4C7EFF" },
      { name: "Rent & utilities", value: 14, color: "#8B96AD" },
      { name: "Marketing", value: 12, color: "#FBBF57" },
      { name: "Other", value: 8, color: "#FF5C72" },
    ],

    paymentStatus: [
      { name: "Paid", value: 68, color: "#2FD68C" },
      { name: "Pending", value: 22, color: "#FBBF57" },
      { name: "Overdue", value: 10, color: "#FF5C72" },
    ],

    revenueReport: [
      { category: "Product sales", amount: 512300 },
      { category: "Services", amount: 218400 },
      { category: "Wholesale", amount: 89200 },
      { category: "Other income", amount: 22400 },
    ],

    expenseReport: [
      { category: "Payroll", amount: 149900 },
      { category: "Inventory", amount: 85600 },
      { category: "Rent & utilities", amount: 49900 },
      { category: "Marketing", amount: 42800 },
      { category: "Other", amount: 28700 },
    ],

    spendingScore: { score: 78, label: "Healthy", delta: 3 },
    creditScore: { score: 742, max: 900, label: "Good", delta: -8 },
    creditUtilization: { percent: 46, delta: 6 },
  },

  "This quarter": {
    label: "This quarter",
    dateRangeText: "01 Jul 2026 – 30 Sep 2026 (Q3)",
    sublabel: "Q3 2026 Quarterly performance",
    revenue: 2340000,
    revenueChange: 14.1,
    revenueCompare: "vs ₹20.5L last Q2",
    revenueSpark: [69, 71, 74, 76, 78, 79, 75, 77, 76, 80, 82, 85],

    expenses: 1070000,
    expensesChange: 9.2,
    expensesCompare: "vs ₹9.80L last Q2",
    expensesSpark: [31, 33, 35, 34, 36, 38, 35, 37, 34, 36, 38, 39],

    profit: 1270000,
    profitChange: 18.7,
    profitCompare: "vs ₹10.7L last Q2",
    profitSpark: [38, 38, 39, 42, 42, 41, 40, 40, 42, 44, 44, 46],

    outstanding: 315400,
    outstandingChange: -8.6,
    outstandingCompare: "vs ₹3.45L last Q2",
    outstandingSpark: [44, 42, 40, 38, 39, 37, 36, 35, 34, 33, 32, 31],

    revenueVsExpenses: [
      { month: "Jul", revenue: 740, expenses: 350 },
      { month: "Aug", revenue: 790, expenses: 380 },
      { month: "Sep (Proj.)", revenue: 810, expenses: 340 },
    ],

    cashFlow: [
      { month: "Jul", net: 390 },
      { month: "Aug", net: 410 },
      { month: "Sep", net: 470 },
    ],

    expenseBreakdown: [
      { name: "Payroll", value: 39, color: "#14E0C4" },
      { name: "Inventory", value: 28, color: "#4C7EFF" },
      { name: "Rent & utilities", value: 15, color: "#8B96AD" },
      { name: "Marketing", value: 11, color: "#FBBF57" },
      { name: "Other", value: 7, color: "#FF5C72" },
    ],

    paymentStatus: [
      { name: "Paid", value: 76, color: "#2FD68C" },
      { name: "Pending", value: 16, color: "#FBBF57" },
      { name: "Overdue", value: 8, color: "#FF5C72" },
    ],

    revenueReport: [
      { category: "Product sales", amount: 1420000 },
      { category: "Services", amount: 590000 },
      { category: "Wholesale", amount: 260000 },
      { category: "Other income", amount: 70000 },
    ],

    expenseReport: [
      { category: "Payroll", amount: 417300 },
      { category: "Inventory", amount: 299600 },
      { category: "Rent & utilities", amount: 160500 },
      { category: "Marketing", amount: 117700 },
      { category: "Other", amount: 74900 },
    ],

    spendingScore: { score: 81, label: "Healthy", delta: 5 },
    creditScore: { score: 748, max: 900, label: "Good", delta: 6 },
    creditUtilization: { percent: 41, delta: -3 },
  },

  "This year": {
    label: "This year",
    dateRangeText: "01 Jan 2026 – 31 Dec 2026 (FY26)",
    sublabel: "Full Fiscal Year 2026",
    revenue: 8550000,
    revenueChange: 15.2,
    revenueCompare: "vs ₹74.2L last year",
    revenueSpark: [58, 61, 55, 67, 71, 69, 74, 79, 76, 82, 85, 88],

    expenses: 4180000,
    expensesChange: 8.3,
    expensesCompare: "vs ₹38.6L last year",
    expensesSpark: [32, 30, 34, 33, 36, 31, 35, 38, 34, 37, 39, 36],

    profit: 4370000,
    profitChange: 22.8,
    profitCompare: "vs ₹35.6L last year",
    profitSpark: [26, 31, 21, 34, 35, 38, 39, 41, 42, 45, 46, 52],

    outstanding: 642000,
    outstandingChange: -9.6,
    outstandingCompare: "vs ₹7.10L last year",
    outstandingSpark: [65, 62, 59, 58, 54, 52, 50, 48, 45, 43, 40, 38],

    revenueVsExpenses: [
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
    ],

    cashFlow: [
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
    ],

    expenseBreakdown: [
      { name: "Payroll", value: 40, color: "#14E0C4" },
      { name: "Inventory", value: 26, color: "#4C7EFF" },
      { name: "Rent & utilities", value: 16, color: "#8B96AD" },
      { name: "Marketing", value: 11, color: "#FBBF57" },
      { name: "Other", value: 7, color: "#FF5C72" },
    ],

    paymentStatus: [
      { name: "Paid", value: 82, color: "#2FD68C" },
      { name: "Pending", value: 12, color: "#FBBF57" },
      { name: "Overdue", value: 6, color: "#FF5C72" },
    ],

    revenueReport: [
      { category: "Product sales", amount: 5200000 },
      { category: "Services", amount: 2210000 },
      { category: "Wholesale", amount: 890000 },
      { category: "Other income", amount: 250000 },
    ],

    expenseReport: [
      { category: "Payroll", amount: 1672000 },
      { category: "Inventory", amount: 1086800 },
      { category: "Rent & utilities", amount: 668800 },
      { category: "Marketing", amount: 459800 },
      { category: "Other", amount: 292600 },
    ],

    spendingScore: { score: 86, label: "Excellent", delta: 8 },
    creditScore: { score: 755, max: 900, label: "Very Good", delta: 13 },
    creditUtilization: { percent: 34, delta: -6 },
  },
};

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [period, setPeriod] = useState("Last 30 days");

  const currentData = useMemo(() => {
    const data = PERIOD_DATA[period] || PERIOD_DATA["Last 30 days"];

    const overviewMetrics = [
      {
        id: "revenue",
        label: "Total revenue",
        value: data.revenue,
        change: data.revenueChange,
        direction: data.revenueChange >= 0 ? "up" : "down",
        compare: data.revenueCompare,
        spark: data.revenueSpark,
      },
      {
        id: "expenses",
        label: "Total expenses",
        value: data.expenses,
        change: data.expensesChange,
        direction: data.expensesChange >= 0 ? "up" : "down",
        compare: data.expensesCompare,
        spark: data.expensesSpark,
      },
      {
        id: "profit",
        label: "Net profit",
        value: data.profit,
        change: data.profitChange,
        direction: data.profitChange >= 0 ? "up" : "down",
        compare: data.profitCompare,
        spark: data.profitSpark,
      },
      {
        id: "outstanding",
        label: "Outstanding payments",
        value: data.outstanding,
        change: data.outstandingChange,
        direction: data.outstandingChange >= 0 ? "up" : "down",
        compare: data.outstandingCompare,
        spark: data.outstandingSpark,
      },
    ];

    return {
      ...data,
      overviewMetrics,
    };
  }, [period]);

  return (
    <FinanceContext.Provider
      value={{
        period,
        setPeriod,
        data: currentData,
        periodOptions: PERIOD_OPTIONS,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
