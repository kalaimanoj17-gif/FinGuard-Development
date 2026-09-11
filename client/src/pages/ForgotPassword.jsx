import React, { useState } from 'react';
import { Shield, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-[440px] pt-8"></div>

      <div className="w-full max-w-[440px] bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-teal-700 text-white shadow-xs mb-1">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">FinGuard</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">AI</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900">Reset your password</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your registered email address to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Reset link sent!</h4>
            <p className="text-xs text-slate-600">Check <span className="font-semibold text-slate-900">{email}</span> for instructions to reset your password.</p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log in</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Back to Log in</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className="w-full text-center py-4 text-xs text-slate-400">
        <p className="text-[11px]">© 2026 FinGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
