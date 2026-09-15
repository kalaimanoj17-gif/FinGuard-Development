import React, { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  TrendingDown,
  Clock,
  PiggyBank,
  CreditCard,
  RotateCcw,
  Bot,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import Card from "../components/Card";
import { aiInsights, suggestedQuestions, overviewMetrics, creditScore, creditUtilization } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";
import { isGeminiConfigured, sendGeminiMessage } from "../services/geminiService";

const ICON_BY_ID = { 1: TrendingDown, 2: Clock, 3: PiggyBank, 4: CreditCard };

/**
 * Lightweight formatter for Gemini message content (supports bold, lists, numbers)
 */
function renderFormattedMessage(content) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentList = [];

  function flushList() {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-1.5 space-y-1 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <div className="flex-1">{formatInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  }

  function formatInline(text) {
    // Replace **bold** with bold spans
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Bullet point: "- " or "* " or "• "
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      currentList.push(trimmed.replace(/^[-*•]\s+/, ""));
      return;
    }

    // Numbered list: "1. ", "2. ", etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      currentList.push(numMatch[2]);
      return;
    }

    // Regular line
    flushList();
    elements.push(
      <p key={`p-${index}`} className="my-1 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-200">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}

export default function Advisor() {
  const { language, t } = useLanguage();
  const configured = isGeminiConfigured();

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I am your FinGuard AI Advisor powered by Google Gemini. I have real-time visibility into your invoices, expenses, cash flow, and credit health. What would you like to analyze today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(textToSend) {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const newMessages = [...messages, { role: "user", text: query }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setErrorBanner("");

    try {
      const reply = await sendGeminiMessage(newMessages, language);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      console.error("Advisor send error:", err);
      const errText = err.message || "Failed to reach Gemini API. Please try again.";
      setErrorBanner(errText);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠️ **Error encountered:** ${errText}\n\nIf you haven't yet added your Gemini API key, please configure \`VITE_GEMINI_API_KEY\` in your \`.env\` file.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    setMessages([
      {
        role: "ai",
        text: "Chat cleared. I'm ready to answer any questions regarding your cash flow, overdue invoices, or credit strategy.",
      },
    ]);
    setErrorBanner("");
  }

  // Quick summary figures
  const rev = overviewMetrics.find((m) => m.id === "revenue")?.value || 842300;
  const exp = overviewMetrics.find((m) => m.id === "expenses")?.value || 356900;
  const profit = overviewMetrics.find((m) => m.id === "profit")?.value || 485400;

  return (
    <div className="space-y-5">
      {/* Top Banner: Gemini Configuration Status */}
      {!configured && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 px-4 py-3 text-amber-900 dark:text-amber-200 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <HelpCircle size={18} />
            </span>
            <div>
              <p className="text-xs sm:text-[13px] font-bold">
                Using Contextual FinGuard Simulation Mode
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-300">
                To connect live Google Gemini intelligence, add <code className="rounded bg-amber-200/70 dark:bg-amber-900/80 px-1 py-0.5 font-mono text-[11px] font-bold">VITE_GEMINI_API_KEY</code> to your <code className="rounded bg-amber-200/70 dark:bg-amber-900/80 px-1 py-0.5 font-mono text-[11px] font-bold">.env</code> file.
              </p>
            </div>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            Get Free Gemini Key <ExternalLink size={12} />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Chat area */}
        <Card
          className="flex h-[680px] flex-col lg:col-span-2 shadow-card"
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
                  <Bot size={18} />
                </span>
                <div>
                  <h2 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                    Gemini AI Financial Advisor
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Autonomous reasoning grounded in your live financial ledger
                  </p>
                </div>
              </div>

              {/* Status Indicator & Reset */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                    configured
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      configured ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                    }`}
                  />
                  {configured ? "Gemini Live AI" : "Context Co-Pilot"}
                </div>

                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          }
        >
          {/* Messages list */}
          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1 pt-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {m.role === "ai" && (
                  <span className="mr-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/20">
                    <Sparkles size={15} />
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white font-medium shadow-blue-500/20 rounded-tr-sm"
                      : "bg-blue-50/70 dark:bg-slate-900/80 border border-blue-100/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="text-white text-[13.5px] leading-relaxed whitespace-pre-wrap">
                      {m.text}
                    </p>
                  ) : (
                    renderFormattedMessage(m.text)
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 animate-fadeIn">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
                  <Sparkles size={14} className="animate-spin" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-blue-100 dark:border-slate-800 bg-blue-50/70 dark:bg-slate-900/80 px-4 py-2.5 text-xs text-blue-700 dark:text-blue-300 font-medium">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>Analyzing ledger with Gemini…</span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Suggested Financial Inquiries
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  disabled={isLoading}
                  onClick={() => handleSend(q)}
                  className="focus-ring rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/60 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
          >
            <input
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini about overdue invoices, expense spikes, or credit optimization…"
              className="flex-1 rounded-lg bg-transparent px-2 py-1 text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send query"
            >
              <Send size={15} />
            </button>
          </form>
        </Card>

        {/* Right column: Real-Time Ledger Summary & Insight Feed */}
        <div className="space-y-5">
          {/* Quick Ledger Snapshot Card */}
          <Card title="Live Ledger Snapshot" subtitle="Data fed to Gemini context">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Revenue (MoM)</span>
                <p className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{(rev / 100000).toFixed(2)}L
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">▲ +8.4%</span>
              </div>
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Net Profit</span>
                <p className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{(profit / 100000).toFixed(2)}L
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">5.1% margin</span>
              </div>
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Credit Score</span>
                <p className="mt-0.5 text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {creditScore.score} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ {creditScore.max}</span>
                </p>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Utilization: {creditUtilization.percent}%</span>
              </div>
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Overdue Invoices</span>
                <p className="mt-0.5 text-base font-extrabold text-rose-600 dark:text-rose-400">
                  ₹91.2K
                </p>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">INV-2454 Critical</span>
              </div>
            </div>
          </Card>

          {/* Financial Insight Cards */}
          <Card title="Active System Alerts" subtitle="Autonomous anomaly detection">
            <ul className="space-y-2.5">
              {aiInsights.map((insight) => {
                const Icon = ICON_BY_ID[insight.id] || Sparkles;
                return (
                  <li
                    key={insight.id}
                    className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3 hover:border-blue-200 dark:hover:border-slate-700 transition-colors shadow-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <Icon size={14} />
                      </span>
                      <div className="flex-1">
                        <p className="text-[12.5px] leading-snug text-slate-700 dark:text-slate-300">
                          {insight.text}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSend(`Tell me more about this alert: ${insight.text}`)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          Ask Gemini <Sparkles size={11} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
