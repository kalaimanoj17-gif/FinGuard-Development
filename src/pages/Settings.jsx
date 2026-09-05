import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Save, 
  CheckCircle2, 
  Globe, 
  Lock,
  Landmark
} from 'lucide-react';
import { BUSINESS_PROFILE } from '../data/mockData';

export default function SettingsPage() {
  const [profile, setProfile] = useState(BUSINESS_PROFILE);
  const [sensitivity, setSensitivity] = useState(85);
  const [autoApproveMatches, setAutoApproveMatches] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-slate-700" />
            <h1 className="text-2xl font-extrabold text-slate-900">Platform Settings & Rules</h1>
          </div>
          <p className="text-xs text-slate-500">Configure business profiles, connected bank feeds, and AI anomaly thresholds</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Settings updated successfully! Changes applied to live ledger.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Business Profile & GST */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-teal-700" />
              Business Profile & Tax Identifiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Legal Registered Entity</label>
                <input
                  type="text"
                  value={profile.legalName}
                  onChange={(e) => setProfile({ ...profile, legalName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">GSTIN Number</label>
                <input
                  type="text"
                  value={profile.gstin}
                  onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 font-mono text-xs text-teal-800 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Compliance Jurisdiction</label>
                <input
                  type="text"
                  readOnly
                  value={profile.complianceRegion}
                  className="w-full bg-slate-100 border border-slate-200 text-xs text-slate-500 rounded-xl px-3.5 py-2"
                />
              </div>
            </div>
          </div>

          {/* Connected Bank Feeds */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Landmark className="w-4 h-4 text-blue-600" />
              Connected Bank Feeds & APIs
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">HDFC Platinum Corporate Account (#8892)</h4>
                  <p className="text-[11px] text-slate-500">Direct Open Banking API • Synced 2m ago</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Rules & Thresholds */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-teal-700" />
              AI Risk Thresholds
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Anomaly Detection Sensitivity</span>
                  <span className="font-bold text-teal-800">{sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">High sensitivity flags minor price surges (&gt; 15%)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 font-medium">Auto-Reconcile 98%+ Confidence Txns</span>
                  <input
                    type="checkbox"
                    checked={autoApproveMatches}
                    onChange={(e) => setAutoApproveMatches(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 font-medium">Instant Email Alert for HIGH Severity Duplicate Invoices</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
