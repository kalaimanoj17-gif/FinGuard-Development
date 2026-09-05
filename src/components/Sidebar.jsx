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
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: '1 Flagged', badgeColor: 'bg-red-50 text-red-700 border border-red-200' },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckSquare, badge: '1 Match', badgeColor: 'bg-teal-50 text-teal-800 border border-teal-200' },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, badge: 'Due 10 Sep', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { id: 'fraud', label: 'Fraud & Alerts', icon: AlertTriangle, badge: alertCount, badgeColor: 'bg-red-50 text-red-700 border border-red-200' },
    { id: 'forecast', label: 'Cash Forecast', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const aiNav = [
    { id: 'ai-copilot', label: 'FinGuard AI', icon: Sparkles, badge: 'Assistant', badgeColor: 'bg-teal-50 text-teal-800 border border-teal-200' },
    { id: 'action-center', label: 'AI Action Center', icon: Zap, badge: 'Prioritized', badgeColor: 'bg-teal-100 text-teal-800 font-bold' }
  ];

  const bottomNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-700 text-white shadow-xs">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">FinGuard</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">AI</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Connected Financial Ops</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-4">
          {/* Main Financial Ops */}
          <div className="space-y-0.5">
            <span className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Financial Operations
            </span>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Intelligence Section */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100">
            <span className="px-3 text-[10px] font-mono font-bold text-teal-800 uppercase tracking-widest block mb-1">
              AI Intelligence
            </span>
            {aiNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
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
      <div className="p-3 border-t border-slate-200 space-y-0.5">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-colors ${
                isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
