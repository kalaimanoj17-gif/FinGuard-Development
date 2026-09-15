// Centralized API Client Service for FinGuard AI Frontend

export const PRODUCTION_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook/d8280e0f-0480-43e8-8d3e-a45f301143e3';
const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `API Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[FinGuard API Fallback] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth API
  login: (credentials) => fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  signup: (data) => fetchJson('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMe: () => fetchJson('/auth/me'),

  // Settings & Business Profile API
  getSettings: () => fetchJson('/settings'),
  updateSettings: (data) => fetchJson('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getBusiness: () => fetchJson('/business'),
  updateBusiness: (data) => fetchJson('/business', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Dashboard Aggregated Metrics
  getDashboard: () => fetchJson('/dashboard'),

  // Invoices API
  getInvoices: () => fetchJson('/invoices'),
  createInvoice: (data) => fetchJson('/invoices', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateInvoiceStatus: (id, status) => fetchJson(`/invoices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteInvoice: (id) => fetchJson(`/invoices/${id}`, { method: 'DELETE' }),

  // Expenses API
  getExpenses: () => fetchJson('/expenses'),
  createExpense: (data) => fetchJson('/expenses', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  uploadExpenseReceipt: (formData) => fetch('/api/expenses', {
    method: 'POST',
    body: formData
  }).then(res => res.json()),
  deleteExpense: (id) => fetchJson(`/expenses/${id}`, { method: 'DELETE' }),

  // Transactions & Reconciliation API
  getTransactions: () => fetchJson('/transactions'),
  createTransaction: (data) => fetchJson('/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  reconcileTransaction: (id) => fetchJson(`/transactions/${id}/reconcile`, { method: 'POST' }),
  autoReconcile: () => fetchJson('/transactions/auto-reconcile', { method: 'POST' }),

  // Compliance API
  getCompliance: () => fetchJson('/compliance'),
  fileGst: () => fetchJson('/compliance/file-gst', { method: 'POST' }),

  // Fraud Alerts & Security Posture API
  getFraudAlerts: () => fetchJson('/fraud-alerts'),
  resolveFraudAlert: (id, decision) => fetchJson(`/fraud-alerts/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ decision })
  }),

  // Cash Forecast API
  getCashForecast: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/cashflow/forecast${query ? `?${query}` : ''}`);
  },
  simulateCashScenario: (scenarioData) => fetchJson('/cashflow/forecast/scenario', {
    method: 'POST',
    body: JSON.stringify(scenarioData)
  }),

  // Reports API
  getReports: () => fetchJson('/reports'),
  getProfitLossReport: (businessId = 'B001') => fetchJson(`/reports/profit-loss?business_id=${businessId}`),
  getCashFlowReport: (businessId = 'B001') => fetchJson(`/reports/cash-flow?business_id=${businessId}`),
  getExpenseBreakdownReport: (businessId = 'B001') => fetchJson(`/reports/expense-breakdown?business_id=${businessId}`),
  getExpenseReport: (businessId = 'B001') => fetchJson(`/reports/expense-breakdown?business_id=${businessId}`),
  getGstTaxSummary: (businessId = 'B001') => fetchJson(`/reports/gst-tax-summary?business_id=${businessId}`),
  getGstTaxReport: (businessId = 'B001') => fetchJson(`/reports/gst-tax-summary?business_id=${businessId}`),
  getReportSummary: (businessId = 'B001') => fetchJson(`/reports/summary?business_id=${businessId}`),
  generateReport: (data) => fetchJson('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  downloadReport: (id) => fetchJson(`/reports/${id}/download`),

  // AI Action Center API
  getAiActions: () => fetchJson('/ai/action-center'),
  executeAiAction: (id, decision) => fetchJson(`/ai/action-center/${id}/execute`, {
    method: 'POST',
    body: JSON.stringify({ decision })
  }),

  // FinGuard AI Copilot API & Production Webhook
  getCopilotMessages: () => fetchJson('/ai/copilot/messages'),
  sendCopilotPrompt: (prompt) => fetchJson('/ai/copilot', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  }),
  callProductionWebhook: (payload = {}) => fetchJson('/ai/webhook', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  callDirectWebhook: (payload = {}) => fetch(PRODUCTION_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => res.json())
};
