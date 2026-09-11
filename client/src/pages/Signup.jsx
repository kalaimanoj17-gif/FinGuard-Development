import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Building2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Signup({ onNavigate, onLogin }) {
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = (email || '').trim();
    const trimmedPassword = password || '';

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 3) {
      setErrorMessage('Password must be at least 3 characters long.');
      return;
    }

    const newUser = {
      name: name.trim() || 'Business Owner',
      email: trimmedEmail,
      password: trimmedPassword,
      role: 'Business Owner / Admin',
      business: businessName.trim() || 'My Business',
      businessId: 'B' + Math.floor(100 + Math.random() * 900)
    };

    // Save to localStorage users
    try {
      const storedUsers = JSON.parse(localStorage.getItem('finguard_users') || '[]');
      const filtered = storedUsers.filter(u => u.email.toLowerCase() !== trimmedEmail.toLowerCase());
      filtered.push(newUser);
      localStorage.setItem('finguard_users', JSON.stringify(filtered));
    } catch (err) {}

    const success = onLogin({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      business: newUser.business,
      businessId: newUser.businessId
    });

    if (!success) {
      setErrorMessage('Account creation failed. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-[440px] pt-4"></div>

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
          <h1 className="text-xl font-extrabold text-slate-900">Create your account</h1>
          <p className="text-xs text-slate-500 mt-1">Start connected AI financial management for your business</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. ABC Traders"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Create FinGuard Account</span>
          </button>
        </form>

        <div className="text-center text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500">Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Log in
          </button>
        </div>
      </div>

      <footer className="w-full text-center py-4 text-xs text-slate-400">
        <p className="text-[11px]">© 2026 FinGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
