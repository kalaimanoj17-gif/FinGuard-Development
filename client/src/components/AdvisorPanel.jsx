import React from "react";
import { Sparkles, TrendingDown, Clock, PiggyBank, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { aiInsights } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

const ICONS = { warning: Clock, alert: Clock, positive: PiggyBank };
const ICON_BY_ID = { 1: TrendingDown, 2: Clock, 3: PiggyBank, 4: CreditCard };

export default function AdvisorPanel({ compact = false }) {
  const { t } = useLanguage();

  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-white dark:bg-[#0C1322]/95 border border-slate-100 dark:border-slate-800/80 p-6 text-slate-900 dark:text-white shadow-card">
      {/* Finzo ambient soft blue glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl animate-pulseGlow" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-100/40 dark:bg-cyan-900/20 blur-3xl" />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 shadow-sm text-blue-600 dark:text-blue-400">
          <Sparkles size={17} />
        </span>
        <div>
          <p className="font-display text-[15px] font-bold text-slate-900 dark:text-white">{t("aiAdvisorTitle", "FinGuard AI Advisor")}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t("aiAdvisorSubtitle", "Live business intelligence & cash alerts")}</p>
        </div>
      </div>

      <div className="relative mt-5 space-y-2.5">
        {(compact ? aiInsights.slice(0, 3) : aiInsights).map((insight) => {
          const Icon = ICON_BY_ID[insight.id] || Sparkles;
          const translatedInsight = t(`insight${insight.id}`, insight.text);
          return (
            <div key={insight.id} className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 px-3.5 py-3 hover:border-blue-200 dark:hover:border-slate-700 transition-colors shadow-sm">
              <Icon size={15} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-[13px] leading-snug text-slate-700 dark:text-slate-200">{translatedInsight}</p>
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 flex gap-2.5">
        <Link
          to="/advisor"
          className="focus-ring flex-1 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t("advisor", "AI Advisor")}
        </Link>
        <Link
          to="/advisor"
          className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-2.5 text-center text-[13px] font-semibold hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-500/25 transition-all"
        >
          {t("advisor", "Open Chat")} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
