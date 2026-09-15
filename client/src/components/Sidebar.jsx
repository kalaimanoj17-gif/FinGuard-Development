import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  ArrowRightLeft, 
  CheckSquare,
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  Sparkles, 
  Zap,
  Settings,
  HelpCircle,
  Shield
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, alertCount = 1 }) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: '1 Flagged', badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800' },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckSquare, badge: '1 Match', badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800' },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, badge: 'Due 10 Sep', badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800' },
    { id: 'fraud', label: 'Fraud & Alerts', icon: AlertTriangle, badge: alertCount, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800' },
    { id: 'forecast', label: 'Cash Forecast', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const aiNav = [
    { id: 'ai-copilot', label: 'FinGuard AI', icon: Sparkles, badge: 'Assistant', badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800' },
    { id: 'action-center', label: 'AI Action Center', icon: Zap, badge: 'Prioritized', badgeColor: 'bg-emerald-400 text-slate-950 font-bold' }
  ];

  const bottomNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-[#0b1326] border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen select-none z-20 font-sans">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">FinGuard</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950">AI</span>
            </div>
            <p className="text-[9px] font-mono font-semibold text-emerald-400/80 tracking-wider uppercase">Connected Financial Ops</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-4">
          {/* Main Financial Ops */}
          <div className="space-y-0.5">
            <span className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Financial Operations
            </span>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#17223b] text-emerald-400 font-bold border border-emerald-500/30 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Intelligence Section */}
          <div className="space-y-0.5 pt-2 border-t border-slate-800/60">
            <span className="px-3 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              AI Intelligence
            </span>
            {aiNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#17223b] text-emerald-400 font-bold border border-emerald-500/30 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="p-3 border-t border-slate-800/80 space-y-0.5">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-xs transition-colors ${
                isActive ? 'bg-[#17223b] text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
              }`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
