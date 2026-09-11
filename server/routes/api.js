import { Router } from 'express';
import multer from 'multer';
import { store } from '../db/store.js';
import { FinGuardAgentEngine } from '../agent/workflowEngine.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// --- HEALTH ---
router.get('/health', (req, res) => {
  res.json({ status: 'OK', engine: 'FinGuard AI Agent Engine Active', timestamp: new Date() });
});

// --- AUTHENTICATION ---
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const user = store.users.find(u => u.email.toLowerCase() === trimmedEmail);

  if (user) {
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.business,
        businessId: user.businessId
      },
      token: `finguard-token-${user.id}-${Date.now()}`
    });
  }

  // Fallback for dynamic login if email valid
  const emailPrefix = trimmedEmail.split('@')[0];
  const formattedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  const newUser = {
    id: `usr-${Date.now()}`,
    email: trimmedEmail,
    name: formattedName,
    role: 'Business Owner / Admin',
    business: `${formattedName}'s Business`,
    businessId: 'B' + Math.floor(100 + Math.random() * 900)
  };

  store.users.push(newUser);
  res.json({
    message: 'Login successful',
    user: newUser,
    token: `finguard-token-${newUser.id}-${Date.now()}`
  });
});

router.post('/auth/signup', (req, res) => {
  const { email, password, name, businessName } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and full name are required' });
  }

  const existing = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.trim(),
    password: password || 'FinGuard@123',
    name,
    role: 'Business Owner / Admin',
    business: businessName || `${name}'s Business`,
    businessId: 'B' + Math.floor(100 + Math.random() * 900)
  };

  store.users.push(newUser);
  res.status(201).json({
    message: 'Account created successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      business: newUser.business,
      businessId: newUser.businessId
    },
    token: `finguard-token-${newUser.id}-${Date.now()}`
  });
});

router.get('/auth/me', (req, res) => {
  const user = store.users[0] || {
    id: 'usr-001',
    name: 'Business Owner',
    email: 'admin@abctraders.com',
    role: 'Business Owner / Admin',
    business: 'ABC Traders',
    businessId: 'B001'
  };
  res.json({ user });
});

// --- SETTINGS & BUSINESS PROFILE ---
router.get('/settings', (req, res) => {
  res.json({
    businessProfile: store.businessProfile,
    settings: store.settings
  });
});

router.put('/settings', (req, res) => {
  const { name, legalName, gstin, sensitivity, autoApproveMatches, emailAlerts } = req.body;

  if (name) store.businessProfile.name = name;
  if (legalName) store.businessProfile.legalName = legalName;
  if (gstin) store.businessProfile.gstin = gstin;

  if (sensitivity !== undefined) store.settings.sensitivity = Number(sensitivity);
  if (autoApproveMatches !== undefined) store.settings.autoApproveMatches = !!autoApproveMatches;
  if (emailAlerts !== undefined) store.settings.emailAlerts = !!emailAlerts;

  FinGuardAgentEngine.recalculateComplianceScore();

  res.json({
    message: 'Platform settings updated successfully',
    businessProfile: store.businessProfile,
    settings: store.settings
  });
});

router.get('/business', (req, res) => {
  res.json(store.businessProfile);
});

router.put('/business', (req, res) => {
  const { name, legalName, gstin, entityType } = req.body;
  if (name) store.businessProfile.name = name;
  if (legalName) store.businessProfile.legalName = legalName;
  if (gstin) store.businessProfile.gstin = gstin;
  if (entityType) store.businessProfile.entityType = entityType;

  res.json({
    message: 'Business profile updated successfully',
    businessProfile: store.businessProfile
  });
});

// --- DASHBOARD AGGREGATED METRICS ---
router.get('/dashboard', (req, res) => {
  const compliance = FinGuardAgentEngine.recalculateComplianceScore();
  const activeActions = store.aiActions.filter(a => a.status === 'ACTIVE');
  
  const pendingInvoicesAmount = store.invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  
  const overdueInvoicesAmount = store.invoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const totalMonthlyExpense = store.expenses
    .reduce((sum, e) => sum + Number(e.amount), 0);

  res.json({
    business: store.businessProfile,
    complianceScore: compliance,
    financialHealth: {
      score: compliance.score,
      status: compliance.riskLevel,
      change: compliance.riskLevel === 'HIGH' ? 'Critical Action Required' : 'Requires GST action',
      factors: [
        { label: "GST Compliance", status: `${store.complianceData.gstFilingStatus} (Due 10 Sep)`, score: store.complianceData.gstFilingStatus === 'Completed' ? 95 : 65, weight: "High" },
        { label: "Pending Payments", status: `${overdueInvoicesAmount > 0 ? '1 Invoice Overdue' : 'All Clear'}`, score: overdueInvoicesAmount > 0 ? 75 : 95, weight: "High" },
        { label: "Financial Risk", status: `${activeActions.length} Flagged Alert(s)`, score: activeActions.length > 0 ? 76 : 98, weight: "Critical" }
      ]
    },
    activeActions: activeActions,
    cashOverview: {
      totalCash: 185000,
      netCashFlowMonth: 35000,
      cashInflowMonth: 125000,
      cashOutflowMonth: totalMonthlyExpense,
      runwayMonths: 7.2,
      trendData: [
        { month: "Apr", balance: 130000, inflow: 85000, outflow: 70000 },
        { month: "May", balance: 145000, inflow: 92000, outflow: 77000 },
        { month: "Jun", balance: 155000, inflow: 98000, outflow: 88000 },
        { month: "Jul", balance: 165000, inflow: 110000, outflow: 100000 },
        { month: "Aug", balance: 185000, inflow: 125000, outflow: totalMonthlyExpense }
      ]
    },
    invoiceOverview: {
      pendingAmount: pendingInvoicesAmount,
      pendingCount: store.invoices.filter(i => i.status === 'Pending').length,
      overdueAmount: overdueInvoicesAmount,
      overdueCount: store.invoices.filter(i => i.status === 'Overdue').length,
      paidThisMonth: store.invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0),
      paidCount: store.invoices.filter(i => i.status === 'Paid').length,
      collectionScore: 88
    }
  });
});

// --- INVOICES ---
router.get('/invoices', (req, res) => {
  res.json({
    invoices: store.invoices,
    overview: {
      pendingAmount: store.invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0),
      pendingCount: store.invoices.filter(i => i.status === 'Pending').length,
      overdueAmount: store.invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0),
      overdueCount: store.invoices.filter(i => i.status === 'Overdue').length,
      paidThisMonth: store.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
      paidCount: store.invoices.filter(i => i.status === 'Paid').length,
      collectionScore: 88
    }
  });
});

router.post('/invoices', (req, res) => {
  const { customer, amount, gstAmount, date, dueDate, paymentTerms } = req.body;
  if (!customer || !amount) {
    return res.status(400).json({ error: 'Customer and amount are required' });
  }

  const numAmount = Number(amount);
  const calculatedGst = gstAmount ? Number(gstAmount) : Math.round(numAmount * 0.18);
  const newId = `INV${String(store.invoices.length + 1).padStart(3, '0')}`;

  const newInvoice = {
    id: newId,
    customer,
    amount: numAmount,
    gstAmount: calculatedGst,
    date: date || new Date().toISOString().split('T')[0],
    dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Pending',
    aiRisk: 'Low Risk',
    paymentTerms: paymentTerms || 'Net 15'
  };

  // Execute AI Agent Duplicate Detection Workflow
  const aiResult = FinGuardAgentEngine.runInvoiceDuplicateDetection(newInvoice);
  store.invoices.unshift(newInvoice);

  res.status(201).json({
    message: 'Invoice created successfully',
    invoice: newInvoice,
    aiAnalysis: aiResult
  });
});

router.patch('/invoices/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const invoice = store.invoices.find(i => i.id === id);

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  invoice.status = status;
  if (status === 'Paid') invoice.aiRisk = 'On Time';
  if (status === 'Resolved') invoice.aiRisk = 'Cleared';

  FinGuardAgentEngine.recalculateComplianceScore();

  res.json({ message: 'Invoice status updated successfully', invoice });
});

router.delete('/invoices/:id', (req, res) => {
  const { id } = req.params;
  const index = store.invoices.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  const deleted = store.invoices.splice(index, 1);
  FinGuardAgentEngine.recalculateComplianceScore();

  res.json({ message: 'Invoice deleted successfully', invoice: deleted[0] });
});

// --- EXPENSES ---
router.get('/expenses', (req, res) => {
  const total = store.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  res.json({
    expenses: store.expenses,
    overview: {
      totalMonth: total,
      budget: 220000,
      spendInsight: "Inventory spending increased compared with the previous period.",
      spendingControls: {
        singleLimit: 50000,
        monthlyInventoryBudget: 100000,
        reviewRequiredAbove: 25000
      },
      categoryBreakdown: [
        { category: "Inventory", amount: store.expenses.filter(e => e.category === 'Inventory').reduce((s, e) => s + e.amount, 0), color: "#0d9488", percentage: 46 },
        { category: "Operations", amount: store.expenses.filter(e => e.category === 'Operations').reduce((s, e) => s + e.amount, 0), color: "#2563eb", percentage: 24 },
        { category: "Transport", amount: store.expenses.filter(e => e.category === 'Transport').reduce((s, e) => s + e.amount, 0), color: "#6366f1", percentage: 14 },
        { category: "Software", amount: store.expenses.filter(e => e.category === 'Software').reduce((s, e) => s + e.amount, 0), color: "#16a34a", percentage: 10 },
        { category: "Utilities", amount: store.expenses.filter(e => e.category === 'Utilities').reduce((s, e) => s + e.amount, 0), color: "#d97706", percentage: 6 }
      ]
    }
  });
});

router.post('/expenses', upload.single('receipt'), (req, res) => {
  const { vendor, category, amount, date } = req.body;
  if (!vendor || !amount) {
    return res.status(400).json({ error: 'Vendor and amount are required' });
  }

  const newId = `EXP${String(store.expenses.length + 1).padStart(3, '0')}`;
  const newExpense = {
    id: newId,
    vendor,
    category: category || 'General',
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    receipt: req.file ? `Uploaded (${req.file.originalname})` : 'Verified OCR',
    aiStatus: 'Normal',
    approval: 'Approved'
  };

  const aiResult = FinGuardAgentEngine.runExpenseDuplicateDetection(newExpense);
  store.expenses.unshift(newExpense);

  res.status(201).json({
    message: 'Expense added successfully',
    expense: newExpense,
    aiAnalysis: aiResult
  });
});

router.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const index = store.expenses.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  const deleted = store.expenses.splice(index, 1);
  FinGuardAgentEngine.recalculateComplianceScore();

  res.json({ message: 'Expense deleted successfully', expense: deleted[0] });
});

// --- TRANSACTIONS & RECONCILIATION ---
router.get('/transactions', (req, res) => {
  res.json({ transactions: store.transactions });
});

router.post('/transactions', (req, res) => {
  const { description, amount, type, category, account } = req.body;
  if (!description || amount === undefined) {
    return res.status(400).json({ error: 'Description and amount are required' });
  }

  const newTxn = {
    id: `TXN${String(store.transactions.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    description,
    amount: Number(amount),
    type: type || (Number(amount) < 0 ? 'DEBIT' : 'CREDIT'),
    account: account || store.businessProfile.primaryBank,
    matchConfidence: Math.floor(80 + Math.random() * 20),
    category: category || 'General',
    status: 'UNRECONCILED',
    suggestedMatch: 'Pending Review'
  };

  store.transactions.unshift(newTxn);
  res.status(201).json({ message: 'Transaction created successfully', transaction: newTxn });
});

router.post('/transactions/:id/reconcile', (req, res) => {
  const { id } = req.params;
  const txn = store.transactions.find(t => t.id === id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });

  txn.status = 'Reconciled';
  res.json({ message: 'Transaction reconciled successfully', transaction: txn });
});

router.post('/transactions/auto-reconcile', (req, res) => {
  const result = FinGuardAgentEngine.autoReconcileTransactions();
  res.json({
    message: `Batch auto-reconciliation complete. ${result.reconciledCount} transaction(s) reconciled.`,
    ...result
  });
});

// --- COMPLIANCE ---
router.get('/compliance', (req, res) => {
  FinGuardAgentEngine.recalculateComplianceScore();
  res.json(store.complianceData);
});

router.post('/compliance/file-gst', (req, res) => {
  store.complianceData.gstFilingStatus = 'Completed';
  store.complianceData.lastFilingDate = new Date().toISOString().split('T')[0];
  
  // Resolve any pending GST filing AI Action
  const gstAction = store.aiActions.find(a => a.title.includes('GST Filing'));
  if (gstAction) {
    gstAction.status = 'RESOLVED';
  }

  const scores = FinGuardAgentEngine.recalculateComplianceScore();
  res.json({
    message: 'GST Filing submitted successfully',
    compliance: store.complianceData,
    newScore: scores
  });
});

// --- FRAUD ALERTS & SECURITY POSTURE ---
router.get('/fraud-alerts', (req, res) => {
  const activeAlerts = store.aiActions.filter(a => a.status === 'ACTIVE');
  const duplicateCount = store.invoices.filter(i => i.status.includes('Duplicate')).length;
  
  const highRisk = activeAlerts.find(a => a.severity === 'HIGH');

  res.json({
    securityPostureScore: store.complianceData.complianceScore,
    riskLevel: `${store.complianceData.riskLevel} Risk`,
    activeAlertsCount: activeAlerts.length,
    duplicateInvoicesCount: duplicateCount,
    highRiskAlert: highRisk ? {
      severity: highRisk.severity,
      title: highRisk.title,
      vendor: highRisk.details?.vendor || 'ABC Suppliers',
      amount: highRisk.details?.amount || 25000,
      date: "03 Sep 2026",
      reasons: highRisk.details?.reasons || []
    } : null,
    alertsList: activeAlerts
  });
});

router.post('/fraud-alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;
  const result = FinGuardAgentEngine.resolveAiAction(id, decision || 'RESOLVED');
  res.json(result);
});

// --- CASH FORECAST ---
router.get('/cashflow/forecast', (req, res) => {
  const forecastData = FinGuardAgentEngine.generateCashForecast(req.query);
  res.json(forecastData);
});

router.post('/cashflow/forecast/scenario', (req, res) => {
  const result = FinGuardAgentEngine.generateCashForecast(req.body);
  res.json({
    message: 'Scenario simulation processed successfully',
    ...result
  });
});


// --- REPORTS ---
router.get('/reports', (req, res) => {
  res.json({ reports: store.reports });
});

router.post('/reports/generate', (req, res) => {
  const { title, type, period } = req.body;
  const newReport = {
    id: `rep-${store.reports.length + 1}`,
    title: title || 'Custom Financial Report',
    period: period || 'Q2 FY 2026-27',
    status: 'Generated',
    type: type || 'Financial',
    generatedAt: new Date().toISOString().split('T')[0]
  };

  store.reports.unshift(newReport);
  res.status(201).json({ message: 'Report generated successfully', report: newReport });
});

router.get('/reports/:id/download', (req, res) => {
  const { id } = req.params;
  const report = store.reports.find(r => r.id === id);

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json({
    exportFormat: 'JSON',
    report,
    dataSummary: {
      business: store.businessProfile.name,
      gstin: store.businessProfile.gstin,
      generatedOn: new Date().toISOString(),
      complianceScore: store.complianceData.complianceScore
    }
  });
});

// --- AI ACTION CENTER & AGENT WORKFLOWS ---
router.get('/ai/action-center', (req, res) => {
  const activeActions = store.aiActions.filter(a => a.status === 'ACTIVE');
  res.json({ actions: activeActions });
});

router.post('/ai/action-center/:id/execute', (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  const result = FinGuardAgentEngine.resolveAiAction(id, decision);
  res.json(result);
});

// --- FIN GUARD AI COPILOT & PRODUCTION WEBHOOK WORKFLOW ---
const PRODUCTION_WEBHOOK_URL = process.env.PRODUCTION_WEBHOOK_URL || 'https://api.agents.snsihub.ai/webhook/d8280e0f-0480-43e8-8d3e-a45f301143e3';

router.get('/ai/copilot/messages', (req, res) => {
  res.json({ messages: store.copilotMessages });
});

router.post('/ai/copilot', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt text is required' });

  // Store user message
  const userMsg = {
    id: `msg-${Date.now()}-user`,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: prompt
  };
  store.copilotMessages.push(userMsg);

  // Execute FinGuard AI Agent Query Processor (queries Production Webhook)
  const aiMsg = await FinGuardAgentEngine.processCopilotQuery(prompt);
  aiMsg.id = `msg-${Date.now()}-ai`;
  store.copilotMessages.push(aiMsg);

  res.json({
    userMessage: userMsg,
    aiMessage: aiMsg
  });
});

router.post('/ai/webhook', async (req, res) => {
  try {
    const response = await fetch(PRODUCTION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: store.businessProfile.businessId || 'B001',
        business_name: store.businessProfile.name || 'ABC Grocery',
        ...req.body
      })
    });

    const data = await response.json();
    res.json({ success: true, webhookUrl: PRODUCTION_WEBHOOK_URL, data });
  } catch (err) {
    res.status(500).json({ error: 'Production Webhook request failed', details: err.message });
  }
});

export default router;


