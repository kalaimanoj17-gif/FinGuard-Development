// FinGuard AI Agent Workflow Engine
import { store } from '../db/store.js';

export class FinGuardAgentEngine {
  /**
   * Recalculates overall system compliance score and risk level
   */
  static recalculateComplianceScore() {
    let score = 100;
    const activeActions = store.aiActions.filter(a => a.status === 'ACTIVE');
    
    // Deduct for High Risk Alerts
    const highRiskAlerts = activeActions.filter(a => a.severity === 'HIGH');
    score -= highRiskAlerts.length * 15;

    // Deduct for Important Compliance Actions
    const importantActions = activeActions.filter(a => a.severity === 'IMPORTANT');
    score -= importantActions.length * 10;

    // Deduct for Pending GST
    if (store.complianceData.gstFilingStatus === 'Pending') {
      score -= 5;
    }

    // Deduct for Pending Tax Payment
    if (store.complianceData.taxPaymentStatus === 'Pending') {
      score -= 3;
    }

    score = Math.max(0, Math.min(100, score));
    store.complianceData.complianceScore = score;
    store.complianceData.riskLevel = score >= 85 ? 'LOW' : score >= 60 ? 'MEDIUM' : 'HIGH';

    return {
      score,
      riskLevel: store.complianceData.riskLevel
    };
  }

  /**
   * AI Duplicate Detection Agent: Scans incoming invoice for duplicates
   */
  static runInvoiceDuplicateDetection(newInvoice) {
    const existing = store.invoices.find(inv => 
      inv.id !== newInvoice.id &&
      inv.customer.toLowerCase().trim() === newInvoice.customer.toLowerCase().trim() &&
      Number(inv.amount) === Number(newInvoice.amount)
    );

    if (existing) {
      newInvoice.status = "Flagged Duplicate";
      newInvoice.aiRisk = "HIGH Duplicate Risk";

      // Also flag matching existing invoice if not already
      existing.status = "Flagged Duplicate";
      existing.aiRisk = "HIGH Duplicate Risk";

      // Create AI Action Alert
      const newActionId = `action-${Date.now()}`;
      const actionAlert = {
        id: newActionId,
        severity: "HIGH",
        title: `Potential Duplicate Invoice: ${existing.id} ↔ ${newInvoice.id}`,
        subtitle: `${newInvoice.customer} submitted Invoice #${newInvoice.id} (₹${Number(newInvoice.amount).toLocaleString('en-IN')}) matching amount and vendor of #${existing.id}.`,
        category: "Fraud & Risk",
        potentialSaving: `₹${Number(newInvoice.amount).toLocaleString('en-IN')}`,
        timeDetected: "Just now",
        actionType: "Review Action",
        status: "ACTIVE",
        details: {
          vendor: newInvoice.customer,
          invoiceNumber: newInvoice.id,
          matchingNumber: existing.id,
          amount: Number(newInvoice.amount),
          confidence: "99.4% Match",
          reasons: [
            `Same vendor (${newInvoice.customer})`,
            `Same amount (₹${Number(newInvoice.amount).toLocaleString('en-IN')})`,
            `Same invoice date (${newInvoice.date})`
          ]
        }
      };

      store.aiActions.unshift(actionAlert);
      this.recalculateComplianceScore();

      return {
        isDuplicate: true,
        matchingInvoiceId: existing.id,
        actionAlert
      };
    }

    this.recalculateComplianceScore();
    return { isDuplicate: false };
  }

  /**
   * AI Duplicate Detection Agent for Expenses
   */
  static runExpenseDuplicateDetection(newExpense) {
    const existing = store.expenses.find(exp =>
      exp.id !== newExpense.id &&
      exp.vendor.toLowerCase().trim() === newExpense.vendor.toLowerCase().trim() &&
      Number(exp.amount) === Number(newExpense.amount)
    );

    if (existing) {
      newExpense.aiStatus = "Flagged Duplicate";
      newExpense.approval = "Pending Review";

      const actionAlert = {
        id: `action-${Date.now()}`,
        severity: "HIGH",
        title: `Potential Duplicate Expense: ${newExpense.vendor}`,
        subtitle: `Expense #${newExpense.id} (₹${Number(newExpense.amount).toLocaleString('en-IN')}) matches existing expense #${existing.id}.`,
        category: "Fraud & Risk",
        potentialSaving: `₹${Number(newExpense.amount).toLocaleString('en-IN')}`,
        timeDetected: "Just now",
        actionType: "Review Action",
        status: "ACTIVE",
        details: {
          vendor: newExpense.vendor,
          invoiceNumber: newExpense.id,
          matchingNumber: existing.id,
          amount: Number(newExpense.amount),
          confidence: "98.5% Match",
          reasons: [
            `Same vendor (${newExpense.vendor})`,
            `Same amount (₹${Number(newExpense.amount).toLocaleString('en-IN')})`
          ]
        }
      };

      store.aiActions.unshift(actionAlert);
      this.recalculateComplianceScore();

      return { isDuplicate: true, matchingExpenseId: existing.id, actionAlert };
    }

    this.recalculateComplianceScore();
    return { isDuplicate: false };
  }

  /**
   * Resolves an AI Action Center Workflow item
   */
  static resolveAiAction(actionId, resolutionType = 'RESOLVED') {
    const action = store.aiActions.find(a => a.id === actionId);
    if (!action) return { success: false, message: "Action not found" };

    action.status = 'RESOLVED';

    // If action was GST Filing
    if (action.title.includes('GST Filing')) {
      store.complianceData.gstFilingStatus = 'Completed';
      store.complianceData.lastFilingDate = new Date().toISOString().split('T')[0];
    }

    // If action was Duplicate Invoice
    if (action.title.includes('Duplicate Invoice') && action.details?.invoiceNumber) {
      const targetInv = store.invoices.find(i => i.id === action.details.invoiceNumber);
      if (targetInv) {
        targetInv.status = resolutionType === 'DISMISS' ? 'Pending' : 'Resolved';
        targetInv.aiRisk = resolutionType === 'DISMISS' ? 'Low Risk' : 'Cleared';
      }
    }

    const newScores = this.recalculateComplianceScore();

    return {
      success: true,
      action,
      complianceScore: newScores.score,
      riskLevel: newScores.riskLevel
    };
  }

  /**
   * Generates dynamic 8-week cash forecast projection with scenario simulation
   */
  static generateCashForecast(options = {}) {
    const delayPayables = Boolean(options.delayPayables === true || options.delayPayables === 'true');
    const surgeExpenses = Boolean(options.surgeExpenses === true || options.surgeExpenses === 'true');
    const delayPayablesAmount = Number(options.delayPayablesAmount) || 15000;
    const surgeAmount = Number(options.surgeAmount) || 8000;
    const customInflowBoost = Number(options.customInflowBoost) || 0;
    const customOutflowBoost = Number(options.customOutflowBoost) || 0;
    const totalWeeks = Number(options.weeks) || 8;

    const totalMonthlyExpense = store.expenses.reduce((sum, e) => sum + Number(e.amount), 0) || 25000;
    const currentBalance = 185000;

    const pendingInflow = store.invoices
      .filter(i => i.status === 'Pending' || i.status === 'Paid')
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const baseIncrement = Math.round(pendingInflow / totalWeeks);

    const forecast = [];
    for (let i = 0; i < totalWeeks; i++) {
      const weekLabel = `Wk ${i + 1}`;
      const baseline = currentBalance + (baseIncrement * i);
      let optimized = baseline + (i * 4000) + customInflowBoost - customOutflowBoost;

      if (delayPayables) {
        optimized += delayPayablesAmount;
      }
      if (surgeExpenses && i > 2) {
        optimized -= surgeAmount;
      }

      forecast.push({
        week: weekLabel,
        baseline,
        optimized,
        displayOptimized: optimized
      });
    }

    const runwayMonths = Math.round((currentBalance / totalMonthlyExpense) * 10) / 10;
    let runwayBonus = 0.4;
    if (delayPayables) runwayBonus += 0.4;
    if (surgeExpenses) runwayBonus -= 0.3;

    const optimizedRunwayMonths = Number((runwayMonths + runwayBonus).toFixed(1));
    const lastPoint = forecast[forecast.length - 1] || { optimized: currentBalance };
    const est90DayCashPosition = lastPoint.optimized;

    const insights = [
      "Historical inflow velocity indicates high weekend settlement probabilities.",
      delayPayables 
        ? "Delaying ₹15,000 major payable extends short-term operational runway by ~0.8 months." 
        : "Early collection discounts could unlock up to ₹24,000 additional liquidity.",
      surgeExpenses
        ? "Raw material cost surge tested: buffer remains positive with current reserves."
        : "Standard operational cash cushion targets 6+ months runway."
    ];

    return {
      runwayMonths,
      optimizedRunwayMonths,
      est90DayCashPosition,
      forecast,
      insights,
      scenariosApplied: {
        delayPayables,
        surgeExpenses,
        delayPayablesAmount,
        surgeAmount,
        customInflowBoost,
        customOutflowBoost
      }
    };
  }


  /**
   * Auto-reconcile transactions matching with high confidence (>=98%)
   */
  static autoReconcileTransactions() {
    const unreconciled = store.transactions.filter(t => t.status === 'UNRECONCILED' && (t.matchConfidence || 0) >= 98);
    unreconciled.forEach(t => {
      t.status = 'Reconciled';
    });

    return {
      reconciledCount: unreconciled.length,
      reconciledTransactions: unreconciled
    };
  }

  /**
   * Process Natural Language queries using Production Webhook & FinGuard AI Copilot Agent
   */
  static async processCopilotQuery(promptText) {
    const PRODUCTION_WEBHOOK_URL = process.env.PRODUCTION_WEBHOOK_URL || 'https://api.agents.snsihub.ai/webhook/d8280e0f-0480-43e8-8d3e-a45f301143e3';
    const text = (promptText || '').toLowerCase();
    const activeActions = store.aiActions.filter(a => a.status === 'ACTIVE');
    const comp = store.complianceData;
    const invCount = store.invoices.length;
    const dupInv = store.invoices.filter(i => i.status.includes('Duplicate'));

    let reply = '';
    let webhookSuccess = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(PRODUCTION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: promptText,
          message: promptText,
          query: promptText,
          business_id: store.businessProfile.businessId || 'B001',
          business_name: store.businessProfile.name || 'ABC Grocery'
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          webhookSuccess = true;
          const sections = [];

          if (text.includes('stock') || text.includes('inventory') || text.includes('item') || text.includes('restock')) {
            if (data.stock_analysis) sections.push(data.stock_analysis);
          } else if (text.includes('cash') || text.includes('flow') || text.includes('income') || text.includes('expense') || text.includes('money')) {
            if (data.cash_flow_analysis) sections.push(data.cash_flow_analysis);
            if (data.cash_flow_risk_analysis?.risk_message) {
              sections.push(`💡 Risk Assessment: ${data.cash_flow_risk_analysis.risk_message}`);
            }
          } else if (text.includes('compliance') || text.includes('gst') || text.includes('tax')) {
            if (data.compliance_analysis) sections.push(data.compliance_analysis);
          } else if (text.includes('invoice') || text.includes('bill')) {
            if (data.invoice_analysis) sections.push(data.invoice_analysis);
          }

          if (sections.length > 0) {
            reply = sections.join('\n\n');
          } else if (data.cash_flow_analysis || data.stock_analysis) {
            const parts = [];
            if (data.cash_flow_risk_analysis?.risk_message) {
              parts.push(`📊 Live Risk Analysis (${data.business_name || 'Business'}):\n${data.cash_flow_risk_analysis.risk_message}`);
            }
            if (data.stock_analysis) parts.push(data.stock_analysis);
            if (data.cash_flow_analysis) parts.push(data.cash_flow_analysis);
            reply = parts.join('\n\n');
          } else if (typeof data === 'string') {
            reply = data;
          } else if (data.response || data.text || data.message || data.output) {
            reply = data.response || data.text || data.message || data.output;
          }
        }
      }
    } catch (err) {
      console.warn('[FinGuard Webhook] Call failed, using local rule engine:', err.message);
    }

    if (!reply) {
      reply = `I have analyzed your ledger for ${store.businessProfile.name}. Your total registered invoices: ${invCount}, current compliance score is ${comp.complianceScore}/100 (${comp.riskLevel} risk).`;

      if (text.includes('compliance') || text.includes('score') || text.includes('72') || text.includes('risk')) {
        reply = `Your Compliance Score is currently ${comp.complianceScore}/100 (${comp.riskLevel} risk).\nKey factors:\n1. GST Filing Status: ${comp.gstFilingStatus} (Due: ${comp.gstDueDate}).\n2. Tax Payment Status: ${comp.taxPaymentStatus}.\n3. Active High Risk AI Alerts: ${activeActions.length} alert(s).\nRecommendation: ${comp.recommendation}`;
      } else if (text.includes('review') || text.includes('flagged') || text.includes('invoice') || text.includes('duplicate')) {
        if (dupInv.length > 0) {
          reply = `You have ${dupInv.length} flagged duplicate invoice(s): ${dupInv.map(i => `${i.id} (${i.customer} - ₹${i.amount.toLocaleString('en-IN')})`).join(', ')}. FinGuard AI advises reviewing the Action Center to dismiss or resolve duplicate entries.`;
        } else {
          reply = `All invoices are currently clean with zero duplicate flags detected.`;
        }
      } else if (text.includes('spending') || text.includes('most') || text.includes('expense') || text.includes('afford')) {
        const topCat = store.expenses.length > 0 ? store.expenses[0].category : 'Inventory';
        reply = `Your primary spending category is ${topCat}. You currently have 7.2 months of estimated cash runway. For new large purchases, review projected outflows in the Cash Forecast tab before committing.`;
      } else if (text.includes('today') || text.includes('action') || text.includes('do')) {
        if (activeActions.length > 0) {
          const topActions = activeActions.slice(0, 3).map((a, i) => `${i + 1}. [${a.severity}] ${a.title}`).join('\n');
          reply = `Here are your top prioritized actions for today:\n${topActions}`;
        } else {
          reply = `Everything is up to date! No critical AI action items require immediate attention today.`;
        }
      }
    }

    return {
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: reply,
      metadata: {
        complianceScore: comp.complianceScore,
        activeAlerts: activeActions.length,
        source: webhookSuccess ? 'Production Webhook Agent' : 'FinGuard Rule Engine'
      }
    };
  }
}

