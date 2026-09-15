import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  FilePlus, 
  Upload,
  AlertCircle,
  ExternalLink,
  LogOut
} from 'lucide-react';

export default function Header({ 
  user,
  onOpenCreateInvoice, 
  onOpenUploadExpense, 
  onSelectAction,
  onLogout,
  unreadNotifications = 3
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userName = user?.name || 'Admin';
  const userEmail = user?.email || 'admin@abctraders.com';
  const userBusiness = user?.business || 'ABC Traders';
  const userInitials = userName
    ? userName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AT';

  const notifications = [
    { id: 1, title: 'Duplicate Invoice APX-9082 Flagged', time: '10m ago', type: 'high' },
    { id: 2, title: 'GSTR-1 Recalculated (₹14,250 Tax Liability)', time: '1h ago', type: 'info' },
    { id: 3, title: 'HDFC Bank Feed auto-matched 6 transactions', time: '2h ago', type: 'success' }
  ];

  return (
    <header className="h-16 bg-[#0b1326]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md gap-4">
      {/* Left: Clean Search Bar */}
      <div className="flex-1 max-w-md sm:max-w-lg relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search invoices, vendors, GST tax codes..."
          className="w-full bg-[#131b2e] border border-slate-800 text-white text-xs rounded-xl pl-9 pr-12 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
        />
        <kbd className="absolute right-2.5 top-2 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Right section: Actions, Notifications, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Action Buttons */}
        <button
          onClick={onOpenCreateInvoice}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>New Invoice</span>
        </button>

        <button
          onClick={onOpenUploadExpense}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#171f33] hover:bg-[#222a3d] border border-slate-700 rounded-xl transition-all"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>Upload Receipt</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#131b2e] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0b1326]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">AI Alerts & System Feed</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#171f33] border border-slate-800 flex items-start gap-2.5">
                    {n.type === 'high' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-slate-200 font-medium leading-snug">{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-400 flex items-center justify-center font-extrabold text-xs text-slate-950">
              {userInitials}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-200">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{userBusiness}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{userEmail}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <button className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-[#171f33] rounded-lg transition-colors flex items-center justify-between">
                  <span>Organization Settings</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
                <button className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-[#171f33] rounded-lg transition-colors">
                  Security & API Keys
                </button>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-between font-semibold"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
