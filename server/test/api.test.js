// Automated Integration Test Suite for FinGuard AI Backend Server
import assert from 'node:assert/strict';
import express from 'express';
import apiRouter from '../routes/api.js';
import { store } from '../db/store.js';

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

async function runTests() {
  console.log('🧪 Starting FinGuard AI Backend Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  // Helper for internal HTTP request simulation
  const request = async (method, path, body = null) => {
    return new Promise((resolve, reject) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const url = `http://localhost:${port}/api${path}`;
        
        try {
          const opts = {
            method,
            headers: { 'Content-Type': 'application/json' }
          };
          if (body) opts.body = JSON.stringify(body);

          const res = await fetch(url, opts);
          const data = await res.json();
          server.close();
          resolve({ status: res.status, data });
        } catch (err) {
          server.close();
          reject(err);
        }
      });
    });
  };

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };

  // 1. Health
  await test('GET /api/health returns 200 OK', async () => {
    const res = await request('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'OK');
  });

  // 2. Auth Login & Signup
  await test('POST /api/auth/login with valid demo credentials', async () => {
    const res = await request('POST', '/auth/login', {
      email: 'admin@abctraders.com',
      password: 'FinGuard@123'
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.user.email, 'admin@abctraders.com');
    assert.ok(res.data.token);
  });

  await test('POST /api/auth/signup registers a new user', async () => {
    const res = await request('POST', '/auth/signup', {
      email: 'testuser@finguard.ai',
      password: 'Password@123',
      name: 'Test Founder',
      businessName: 'Test Ventures'
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.user.email, 'testuser@finguard.ai');
    assert.equal(res.data.user.business, 'Test Ventures');
  });

  // 3. Settings & Business Profile
  await test('GET /api/settings and PUT /api/settings', async () => {
    const getRes = await request('GET', '/settings');
    assert.equal(getRes.status, 200);
    assert.ok(getRes.data.settings);

    const putRes = await request('PUT', '/settings', {
      name: 'ABC Traders Updated',
      sensitivity: 90,
      emailAlerts: true
    });
    assert.equal(putRes.status, 200);
    assert.equal(putRes.data.businessProfile.name, 'ABC Traders Updated');
    assert.equal(putRes.data.settings.sensitivity, 90);
  });

  // 4. Dashboard
  await test('GET /api/dashboard returns financial metrics', async () => {
    const res = await request('GET', '/dashboard');
    assert.equal(res.status, 200);
    assert.ok(res.data.complianceScore);
    assert.ok(res.data.cashOverview);
    assert.ok(res.data.invoiceOverview);
  });

  // 5. Invoices CRUD & AI Duplicate Detection
  await test('POST /api/invoices detects duplicate invoice', async () => {
    const dupRes = await request('POST', '/invoices', {
      customer: 'ABC Suppliers',
      amount: 25000,
      date: '2026-09-03'
    });
    assert.equal(dupRes.status, 201);
    assert.equal(dupRes.data.aiAnalysis.isDuplicate, true);
    assert.equal(dupRes.data.invoice.status, 'Flagged Duplicate');
  });

  await test('PATCH /api/invoices/:id/status updates invoice status', async () => {
    const patchRes = await request('PATCH', `/invoices/${store.invoices[0].id}/status`, {
      status: 'Paid'
    });
    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.data.invoice.status, 'Paid');
  });

  await test('DELETE /api/invoices/:id deletes invoice', async () => {
    const invId = store.invoices[0].id;
    const delRes = await request('DELETE', `/invoices/${invId}`);
    assert.equal(delRes.status, 200);
    assert.equal(delRes.data.invoice.id, invId);
  });

  // 6. Expenses CRUD
  await test('POST /api/expenses and DELETE /api/expenses/:id', async () => {
    const postRes = await request('POST', '/expenses', {
      vendor: 'Fresh Logistics',
      amount: 15000,
      category: 'Transport'
    });
    assert.equal(postRes.status, 201);
    const createdId = postRes.data.expense.id;

    const delRes = await request('DELETE', `/expenses/${createdId}`);
    assert.equal(delRes.status, 200);
    assert.equal(delRes.data.expense.id, createdId);
  });

  // 7. Transactions & Auto-Reconcile
  await test('POST /api/transactions/auto-reconcile batch reconciles txns', async () => {
    const res = await request('POST', '/transactions/auto-reconcile');
    assert.equal(res.status, 200);
    assert.ok(typeof res.data.reconciledCount === 'number');
  });

  // 8. Compliance GST Filing
  await test('POST /api/compliance/file-gst files return & updates score', async () => {
    const res = await request('POST', '/compliance/file-gst');
    assert.equal(res.status, 200);
    assert.equal(res.data.compliance.gstFilingStatus, 'Completed');
  });

  // 9. Cash Forecast & Scenario Simulation
  await test('GET /api/cashflow/forecast returns 8-week projections and runway metrics', async () => {
    const res = await request('GET', '/cashflow/forecast');
    assert.equal(res.status, 200);
    assert.equal(res.data.forecast.length, 8);
    assert.ok(typeof res.data.runwayMonths === 'number');
    assert.ok(typeof res.data.optimizedRunwayMonths === 'number');
    assert.ok(typeof res.data.est90DayCashPosition === 'number');
    assert.ok(Array.isArray(res.data.insights));
  });

  await test('GET /api/cashflow/forecast?delayPayables=true calculates scenario runway', async () => {
    const res = await request('GET', '/cashflow/forecast?delayPayables=true');
    assert.equal(res.status, 200);
    assert.equal(res.data.scenariosApplied.delayPayables, true);
    assert.ok(res.data.optimizedRunwayMonths > res.data.runwayMonths);
  });

  await test('POST /api/cashflow/forecast/scenario processes interactive simulation', async () => {
    const res = await request('POST', '/cashflow/forecast/scenario', {
      delayPayables: true,
      surgeExpenses: true
    });
    assert.equal(res.status, 200);
    assert.ok(res.data.scenariosApplied.delayPayables);
    assert.ok(res.data.scenariosApplied.surgeExpenses);
  });


  // 10. Reports & Download
  await test('POST /api/reports/generate and GET /api/reports/:id/download', async () => {
    const genRes = await request('POST', '/reports/generate', {
      title: 'Q3 Tax Audit',
      type: 'Tax'
    });
    assert.equal(genRes.status, 201);
    const repId = genRes.data.report.id;

    const downRes = await request('GET', `/reports/${repId}/download`);
    assert.equal(downRes.status, 200);
    assert.equal(downRes.data.report.id, repId);
  });

  // 11. AI Action Center & Copilot NLP
  await test('POST /api/ai/copilot processes natural language query', async () => {
    const res = await request('POST', '/ai/copilot', {
      prompt: 'What is my current compliance score?'
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.aiMessage.sender, 'ai');
    assert.ok(res.data.aiMessage.text.length > 0);
  });

  // 12. Production Webhook Integration
  await test('POST /api/ai/webhook triggers production agent webhook', async () => {
    const res = await request('POST', '/ai/webhook', {
      prompt: 'Check cash flow analysis'
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.webhookUrl.includes('snsihub.ai'));
  });

  // 13. Financial Intelligence Dashboard APIs
  await test('GET /api/reports and GET /api/reports/profit-loss return valid reporting metrics', async () => {
    const repRes = await request('GET', '/reports');
    assert.equal(repRes.status, 200);
    assert.ok(Array.isArray(repRes.data.reports));

    const plRes = await request('GET', '/reports/profit-loss?business_id=B001');
    assert.equal(plRes.status, 200);
    assert.equal(plRes.data.businessId, 'B001');
    assert.ok(typeof plRes.data.totalIncome === 'number');
    assert.ok(typeof plRes.data.totalExpenses === 'number');
    assert.ok(typeof plRes.data.netProfit === 'number');
    assert.ok(typeof plRes.data.profitMargin === 'number');
  });

  await test('GET /api/dashboard/overview returns aggregated overview structure', async () => {
    const res = await request('GET', '/dashboard/overview?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(typeof res.data.financialHealth.score === 'number');
    assert.ok(res.data.financialHealth.status);
    assert.ok(typeof res.data.financialSummary.totalIncome === 'number');
    assert.ok(typeof res.data.cashFlow.actualIncome === 'number');
    assert.ok(typeof res.data.invoiceHealth.potentialDuplicates === 'number');
    assert.ok(res.data.compliance.gstFilingStatus);
    assert.ok(typeof res.data.inventory.criticalItems === 'number');
  });

  await test('GET /api/financial-health returns calculated 5-component health score', async () => {
    const res = await request('GET', '/financial-health');
    assert.equal(res.status, 200);
    assert.ok(typeof res.data.score === 'number');
    assert.ok(res.data.components.cashFlow);
    assert.ok(res.data.components.invoice);
    assert.ok(res.data.components.compliance);
    assert.ok(res.data.components.inventory);
    assert.ok(res.data.components.risk);
  });

  await test('GET /api/ai/actions returns prioritized AI action items', async () => {
    const res = await request('GET', '/ai/actions?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(Array.isArray(res.data.actions));
  });

  await test('GET /api/invoices/summary returns invoice breakdown summary', async () => {
    const res = await request('GET', '/invoices/summary?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(typeof res.data.totalInvoices === 'number');
    assert.ok(typeof res.data.potentialDuplicates === 'number');
  });

  await test('GET /api/inventory/summary returns stock status and restock priorities', async () => {
    const res = await request('GET', '/inventory/summary?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(typeof res.data.criticalItems === 'number');
    assert.ok(Array.isArray(res.data.restockPriority));
  });

  await test('GET /api/compliance/summary returns compliance score & filing statuses', async () => {
    const res = await request('GET', '/compliance/summary?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(typeof res.data.complianceScore === 'number');
    assert.ok(res.data.gstFilingStatus);
  });

  await test('GET /api/cash-flow/summary returns actual and expected cash flows', async () => {
    const res = await request('GET', '/cash-flow/summary?business_id=B001');
    assert.equal(res.status, 200);
    assert.equal(res.data.businessId, 'B001');
    assert.ok(typeof res.data.actualIncome === 'number');
    assert.ok(typeof res.data.expectedIncome === 'number');
  });



  console.log(`\n====================================================`);
  console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
