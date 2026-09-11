import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CASH_FORECAST_DATA, CASH_OVERVIEW } from '../data/mockData';
import { api } from '../services/api';

export default function CashForecast() {
  const [activeScenario, setActiveScenario] = useState('baseline');
  const [delayPayables, setDelayPayables] = useState(false);
  const [surgeExpenses, setSurgeExpenses] = useState(false);
  const [forecastList, setForecastList] = useState(CASH_FORECAST_DATA);
  const [runwayMonths, setRunwayMonths] = useState(CASH_OVERVIEW.runwayMonths);
  const [optimizedRunway, setOptimizedRunway] = useState(CASH_OVERVIEW.runwayMonths + 0.4);
  const [backendEndPosition, setBackendEndPosition] = useState(null);

  useEffect(() => {
    api.getCashForecast({ delayPayables, surgeExpenses })
      .then((res) => {
        if (res) {
          if (res.forecast && Array.isArray(res.forecast) && res.forecast.length > 0) {
            setForecastList(res.forecast);
          }
          if (res.runwayMonths) {
            setRunwayMonths(res.runwayMonths);
          }
          if (res.optimizedRunwayMonths) {
            setOptimizedRunway(res.optimizedRunwayMonths);
          }
          if (res.est90DayCashPosition) {
            setBackendEndPosition(res.est90DayCashPosition);
          }
        }
      })
      .catch(() => {});
  }, [delayPayables, surgeExpenses]);

  // Dynamic scenario calculation
  const forecastChartData = (forecastList || CASH_FORECAST_DATA).map((item) => {
    return {
      ...item,
      displayOptimized: item.displayOptimized || item.optimized || item.baseline || 0
    };
  });

  const lastForecastItem = forecastChartData[forecastChartData.length - 1] || { displayOptimized: 0 };
  const endPosition = backendEndPosition !== null ? backendEndPosition : (lastForecastItem.displayOptimized || 0);


  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">AI Cash Runway & 90-Day Projection</h1>
          </div>
          <p className="text-xs text-slate-500">Predictive liquidity modeling based on historical inflow velocity and scheduled recurring payables</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
          <Zap className="w-4 h-4 text-teal-700" />
          <span>Monte Carlo Simulation Model</span>
        </div>
      </div>

      {/* Runway Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Current Cash Runway</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{runwayMonths} Months</h3>
          <span className="text-[11px] text-emerald-700 font-medium">Safe buffer (&gt; 6 months target)</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-teal-800 font-bold uppercase">AI-Optimized Runway</span>
          <h3 className="text-2xl font-extrabold text-teal-800 mt-1">
            {optimizedRunway} Months
          </h3>
          <span className="text-[11px] text-teal-700 font-medium">With early collection discount & terms tweak</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Est 90-Day Cash Position</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
            ₹{endPosition.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] text-slate-500">Projected net liquidity end of Q3</span>
        </div>
      </div>

      {/* Interactive Scenario Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900">Interactive Scenario Planner</h3>
          <span className="text-[11px] text-slate-500 font-mono">(Toggle parameters to test cash resilience)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Delay ₹15,000 Major Payable by 15 Days</span>
              <span className="text-[11px] text-slate-500">Negotiate payment terms extension with Apex Logistics</span>
            </div>
            <input
              type="checkbox"
              checked={delayPayables}
              onChange={(e) => setDelayPayables(e.target.checked)}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Simulate +20% Surge in Raw Material Costs</span>
              <span className="text-[11px] text-slate-500">Test cash cushion against supplier price inflation</span>
            </div>
            <input
              type="checkbox"
              checked={surgeExpenses}
              onChange={(e) => setSurgeExpenses(e.target.checked)}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Main Forecast Recharts Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              8-Week Projected Cash Balance vs Baseline
            </h3>
            <p className="text-xs text-slate-500">Comparing standard cashflow against AI recommended adjustments</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-0.5 bg-slate-400"></span> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-teal-800">
              <span className="w-3 h-0.5 bg-teal-600"></span> AI Optimized Projection
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="baseline" name="Baseline Cash" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              <Area type="monotone" dataKey="displayOptimized" name="AI Optimized Cash" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

