import {
  overviewMetrics,
  revenueVsExpenses,
  expenseBreakdown,
  paymentStatus,
  transactions,
  invoices,
  creditScore,
  creditUtilization,
  creditRecommendations,
  aiInsights,
} from "../data/mockData";

/**
 * Checks if a valid Google Gemini API key is configured in the environment.
 */
export function isGeminiConfigured() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(key && key.trim() && key !== "your_gemini_api_key_here");
}

/**
 * Retrieves the configured Gemini API key.
 */
export function getGeminiApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
}

/**
 * Builds a comprehensive real-time financial context snapshot from FinGuard business data.
 */
function buildFinancialContext() {
  const rev = overviewMetrics.find((m) => m.id === "revenue")?.value || 842300;
  const exp = overviewMetrics.find((m) => m.id === "expenses")?.value || 356900;
  const profit = overviewMetrics.find((m) => m.id === "profit")?.value || 485400;
  const outstanding = overviewMetrics.find((m) => m.id === "outstanding")?.value || 128650;

  const overdueInvoices = invoices
    .filter((inv) => inv.status === "Overdue" || inv.status === "Due soon")
    .map((inv) => `- ${inv.id}: ${inv.customer} (₹${inv.amount.toLocaleString("en-IN")}), Due: ${inv.dueDate}, Status: ${inv.status}`)
    .join("\n");

  const recentTxns = transactions
    .slice(0, 6)
    .map((t) => `- ${t.date}: ${t.party} (${t.category}) ${t.type === "credit" ? "+" : "-"}₹${Math.abs(t.amount).toLocaleString("en-IN")} [${t.status}]`)
    .join("\n");

  const expenseCategories = expenseBreakdown
    .map((e) => `- ${e.name}: ${e.value}%`)
    .join("\n");

  const insightsList = aiInsights
    .map((ins) => `- ${ins.text}`)
    .join("\n");

  return `
[CURRENT BUSINESS FINANCIAL SNAPSHOT - FINGUARD AI]
Currency: INR (₹ - Indian Rupees)
- Total Monthly Revenue: ₹${rev.toLocaleString("en-IN")} (+8.4% vs last month)
- Total Monthly Expenses: ₹${exp.toLocaleString("en-IN")} (+12.0% vs last month, primarily inventory restocking)
- Net Profit: ₹${profit.toLocaleString("en-IN")} (+5.1% margin)
- Total Outstanding Receivables: ₹${outstanding.toLocaleString("en-IN")}

[INVOICE STATUS]
${overdueInvoices}
(Notice: INV-2454 for Blue Harbor Exports of ₹91,200 is critically overdue!)

[CREDIT PROFILE & HEALTH]
- FinGuard Business Credit Score: ${creditScore.score} / ${creditScore.max} (Rating: ${creditScore.label})
- Credit Utilization: ${creditUtilization.percent}% (Recommended limit: under 35%)
- Key Recommendation: ${creditRecommendations[0] || "Lower utilization to under 35%"}

[EXPENSE DISTRIBUTION]
${expenseCategories}

[RECENT TRANSACTIONS]
${recentTxns}

[SYSTEM INSIGHTS & ANOMALIES]
${insightsList}
`;
}

/**
 * Builds the full system instructions for Gemini.
 */
function buildSystemInstruction(language = "en") {
  const financialData = buildFinancialContext();

  return `You are FinGuard AI, an elite autonomous financial advisor and credit co-pilot for Indian MSMEs, businesses, and finance executives.
You are embedded directly into the user's FinGuard AI dashboard.

Here is the user's real-time business financial data:
${financialData}

GUIDELINES FOR YOUR RESPONSES:
1. Ground your answers directly in the real business data provided above whenever relevant.
2. Cite exact invoice IDs (e.g. INV-2454), customer names (e.g. Blue Harbor Exports), amounts in ₹ (Indian Rupees), and percentages.
3. Be concise, executive, and actionable. Use bullet points for recommendations and next steps.
4. If asked about cutting costs, analyze their top expense categories (inventory spike, marketing via AdReach Media, shipping vendors).
5. If asked about improving credit score, advise on reducing credit utilization from 46% to under 35% and keeping payment streaks.
6. If the user asks in Hindi, Tamil, Telugu, or another language, respond fluently in that requested language. Active UI language preference: ${language}.
7. Do not invent fictitious financial figures; if data is not available, mention that based on current records.
8. Maintain a supportive, confident, and professional fintech co-pilot tone.`;
}

/**
 * Calls Google Gemini API using multi-turn conversational history.
 * 
 * @param {Array<{role: string, text: string}>} messages - Array of past messages.
 * @param {string} [language="en"] - Active user interface language.
 * @returns {Promise<string>} The AI response text.
 */
export async function sendGeminiMessage(messages, language = "en") {
  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Fallback to intelligent local simulation if API key is not configured
    return simulateContextualReply(messages[messages.length - 1]?.text || "");
  }

  // Convert UI chat history to Gemini's format (user | model)
  // Take last 12 messages to keep prompt token efficient while preserving context
  const recentHistory = messages.slice(-12);
  const contents = recentHistory.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const systemInstruction = buildSystemInstruction(language);

  // Preferred models: gemini-3.6-flash (current generation), with fallback to gemini-flash-latest
  const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash", "gemini-1.5-flash"];

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.35,
      topP: 0.85,
      maxOutputTokens: 1024,
    },
  };

  let lastError = null;

  for (const modelName of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        // Model not found for this key/version, try next candidate
        continue;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData?.error?.message || response.statusText;

        if (response.status === 400) {
          throw new Error(`Gemini API Key error: ${errorMsg}. Please verify VITE_GEMINI_API_KEY in your .env file.`);
        } else if (response.status === 429) {
          throw new Error("Gemini API rate limit reached. Please wait a moment and try again.");
        } else {
          throw new Error(`Gemini Error (${response.status}): ${errorMsg}`);
        }
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];

      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        if (candidate?.finishReason === "SAFETY") {
          return "I apologize, but this response was flagged by safety filters. Please try rephrasing your financial inquiry.";
        }
        return "I analyzed your financial records, but couldn't generate a clear response. Please try rephrasing your question.";
      }

      return candidate.content.parts[0].text.trim();
    } catch (err) {
      lastError = err;
      // If it's a key validation error or rate limit, break and throw directly
      if (err.message.includes("API Key") || err.message.includes("rate limit")) {
        throw err;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error("No supported Gemini model endpoint responded. Please check your network or API permissions.");
}

/**
 * Intelligent local contextual fallback when API key is not yet set in .env
 */
function simulateContextualReply(question = "") {
  const q = question.toLowerCase();

  if (q.includes("expense") || q.includes("spend") || q.includes("cost")) {
    return "Your expenses rose **12.0%** this month to **₹3,56,900**, mainly driven by an **18% increase in inventory restocking** (₹21,500 from Nova Packaging) and the AdReach Media marketing campaign (₹12,000). Payroll remained steady at 42% of total spend.\n\n**Actionable Advice:**\n- Consider reviewing the AdReach Media contract — that spend has shown low conversion over the past 60 days.\n- Consolidating shipping with Sundar Logistics could save an estimated ₹8,500/month.";
  }

  if (q.includes("invoice") || q.includes("overdue") || q.includes("follow up") || q.includes("owe")) {
    return "You have **₹1,28,650** in outstanding receivables. Here is your priority follow-up queue:\n\n1. **INV-2454 (Blue Harbor Exports - ₹91,200)**: Critically overdue! Recommend sending an automated WhatsApp reminder immediately.\n2. **INV-2452 (Aarav Retail Co. - ₹32,100)**: Due in 3 days.\n3. **INV-2453 (Kiran Wholesale - ₹57,800)**: Due soon.";
  }

  if (q.includes("credit") || q.includes("score") || q.includes("rating")) {
    return "Your FinGuard Credit Score is **785 / 900 (Excellent)**.\n\n- **Utilization**: Currently at **46%**, which is above the optimal 35% threshold.\n- **Payment Streak**: 98% on-time record.\n\n**Recommendation:** Paying down ₹28,000 against your primary credit facility will bring utilization to 34%, potentially boosting your score by +15 to +25 points within 30 days.";
  }

  if (q.includes("profit") || q.includes("revenue") || q.includes("cash flow")) {
    return "Your business generated **₹8,42,300** in revenue (+8.4% MoM) and retained **₹4,85,400** in net profit (+5.1% margin). Net cash inflow for September is tracking positively at +₹27,000. If Blue Harbor Exports settles their overdue ₹91,200, liquidity will hit a 6-month high.";
  }

  return "Based on your current FinGuard financial records, your net cash flow is healthy (+₹4.85L profit), but you have **₹91,200 overdue** from Blue Harbor Exports (INV-2454) and your credit utilization is slightly elevated at **46%**. How can I help you optimize your cash flow or invoices today?";
}
