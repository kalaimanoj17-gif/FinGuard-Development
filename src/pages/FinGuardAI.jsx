import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  HelpCircle, 
  BarChart3, 
  FileText,
  Copy
} from 'lucide-react';
import { COPILOT_SUGGESTIONS, COPILOT_INITIAL_MESSAGES } from '../data/mockData';

export default function FinGuardAI() {
  const [messages, setMessages] = useState(COPILOT_INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate AI Copilot Response with realistic FinGuard demo context
    setTimeout(() => {
      let aiReply = "I have analyzed your ledger. Based on ABC Traders' August transactions, your cash balance is ₹1,85,000 with a 72/100 Compliance Score. GST filing is pending for 10 September 2026.";
      
      if (text.toLowerCase().includes('compliance') || text.toLowerCase().includes('score') || text.toLowerCase().includes('72')) {
        aiReply = "Your Compliance Score is 72 / 100 (MEDIUM risk) because:\n1. GST Filing is Pending due 10 September 2026.\n2. Tax Payment is Pending (Last filing was 10 August 2026).\nRecommendation: Complete the pending GST filing before the due date and clear the outstanding tax payment.";
      } else if (text.toLowerCase().includes('review') || text.toLowerCase().includes('flagged') || text.toLowerCase().includes('invoice')) {
        aiReply = "You should review Invoice INV002 from ABC Suppliers for ₹25,000. FinGuard AI flagged it as a HIGH RISK duplicate matching INV001 (same vendor, same amount ₹25,000, same date 03 Sep 2026).";
      } else if (text.toLowerCase().includes('spending') || text.toLowerCase().includes('most') || text.toLowerCase().includes('afford')) {
        aiReply = "Inventory is your largest expense category at ₹85,000 (46% of monthly spend). Regarding a ₹50,000 purchase: Your current cash runway is 7.2 months (₹1,85,000 balance), but review projected outflows before making large purchases.";
      } else if (text.toLowerCase().includes('today') || text.toLowerCase().includes('risk')) {
        aiReply = "Here are your top 3 prioritized actions for today:\n1. HIGH: Review duplicate invoice INV001 ↔ INV002 (₹25,000).\n2. IMPORTANT: Handle pending GST Filing due 10 Sep 2026.\n3. WATCH: Review pending tax payment ledger.";
      }

      const aiMsg = {
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReply
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">FinGuard AI Assistant</h1>
          </div>
          <p className="text-xs text-slate-500">Your AI financial operations assistant — ask natural language questions about your ledger, tax readiness, and risk</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
          <Zap className="w-4 h-4 text-teal-700" />
          <span>FinGuard Financial Engine Active</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Questions</span>
        <div className="flex flex-wrap gap-2">
          {COPILOT_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-teal-800 shadow-xs transition-all text-left"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">FinGuard AI Operations Assistant</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">Active • Connected to ABC Traders Ledger (B001)</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([COPILOT_INITIAL_MESSAGES[0]])}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Clear Conversation
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-teal-700 text-white shadow-xs'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-tr-none shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-1">
                  <span className="font-bold">{msg.sender === 'user' ? 'ABC Traders' : 'FinGuard AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                <span>FinGuard AI is analyzing ledgers & compliance rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask FinGuard AI (e.g. 'Why is my compliance score 72?', 'Which invoice should I review?')..."
            className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-5 py-3 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
