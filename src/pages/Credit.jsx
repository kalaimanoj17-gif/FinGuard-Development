import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ShieldCheck, Lightbulb } from "lucide-react";
import Card from "../components/Card";
import { ProgressRing } from "../components/ui";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { creditHistory, creditRecommendations } from "../data/mockData";

export default function Credit() {
  const { period, data } = useFinance();
  const { isDark } = useTheme();
  const { creditScore, creditUtilization } = data;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white transition-colors">
          Credit
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
          Your business credit health for{" "}
          <span className="font-bold text-slate-900 dark:text-white">{period}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Credit score">
          <div className="flex flex-col items-center py-3">
            <ProgressRing
              value={creditScore.score}
              max={creditScore.max}
              size={128}
              stroke={11}
              label={creditScore.score}
              sublabel={`/ ${creditScore.max}`}
              color="#2563EB"
            />
            <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white transition-colors">
              {creditScore.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
              {creditScore.delta > 0 ? "+" : ""}
              {creditScore.delta} pts vs previous period
            </p>
          </div>
        </Card>

        <Card title="Credit utilization">
          <div className="flex flex-col items-center py-3">
            <ProgressRing
              value={creditUtilization.percent}
              size={128}
              stroke={11}
              label={`${creditUtilization.percent}%`}
              color="#F59E0B"
            />
            <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white transition-colors">
              Of available credit limit
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
              {creditUtilization.delta > 0 ? "+" : ""}
              {creditUtilization.delta} pts vs previous period
            </p>
          </div>
        </Card>

        <Card title="Credit history" subtitle="Last 6 months">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creditHistory}>
                <CartesianGrid vertical={false} stroke={isDark ? "#1E293B" : "#F1F5F9"} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[680, 780]}
                  tick={{ fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    color: isDark ? "#F8FAFC" : "#0F172A",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={2.4}
                  dot={{ r: 4, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm">
            <ShieldCheck size={17} />
          </span>
          <div>
            <h3 className="font-display text-[15px] font-bold text-slate-900 dark:text-white transition-colors">
              Credit recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
              Personalized guidance based on your credit activity
            </p>
          </div>
        </div>
        <ul className="space-y-2.5">
          {creditRecommendations.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
            >
              <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-500" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
