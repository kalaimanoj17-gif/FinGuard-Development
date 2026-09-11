import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Email format regex validation
  const isValidEmail = (emailStr) => {
    if (!emailStr || typeof emailStr !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = (email || '').trim();
    const trimmedPassword = password || '';

    // CASE 5: Empty or invalid email check
    if (!trimmedEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // CASE 5: Empty password check
    if (!trimmedPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      
      // 1. Check registered users in localStorage
      let registeredUsers = [];
      try {
        const stored = localStorage.getItem('finguard_users');
        if (stored) registeredUsers = JSON.parse(stored);
      } catch (err) {}

      const foundUser = registeredUsers.find(
        (u) => u.email && u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (foundUser) {
        if (foundUser.password && foundUser.password !== trimmedPassword) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
          return;
        }

        const success = onLogin(
          {
            name: foundUser.name || 'Business Owner',
            email: foundUser.email,
            role: foundUser.role || 'Business Owner / Admin',
            business: foundUser.business || 'My Business',
            businessId: foundUser.businessId || 'B001'
          },
          rememberMe
        );

        if (!success) {
          setErrorMessage('Login failed. Please check your credentials and try again.');
        }
        return;
      }

      // 2. Demo credential check
      if (trimmedEmail.toLowerCase() === 'admin@abctraders.com') {
        if (trimmedPassword !== 'FinGuard@123') {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
          return;
        }
        onLogin(
          {
            name: 'Business Owner',
            email: 'admin@abctraders.com',
            role: 'Business Owner / Admin',
            business: 'ABC Traders',
            businessId: 'B001'
          },
          rememberMe
        );
        return;
      }

      // 3. Dynamic account login for any valid email & password
      const emailPrefix = trimmedEmail.split('@')[0];
      const formattedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      const dynamicUser = {
        name: formattedName,
        email: trimmedEmail,
        role: 'Business Owner / Admin',
        business: `${formattedName}'s Business`,
        businessId: 'B' + Math.floor(100 + Math.random() * 900)
      };

      const success = onLogin(dynamicUser, rememberMe);
      if (!success) {
        setErrorMessage('Invalid email or password. Please check your credentials and try again.');
      }
    }, 400);
  };

  // Demo credential autofill handler (does NOT bypass login)
  const handleAutofillDemo = () => {
    setErrorMessage('');
    setEmail('admin@abctraders.com');
    setPassword('FinGuard@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between items-center p-4 sm:p-6 select-none">
      {/* Top Spacer */}
      <div className="w-full max-w-[440px] pt-4 sm:pt-8"></div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-[440px] bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Top Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-teal-700 text-white shadow-xs mb-1">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">FinGuard</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">AI</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
              AI-Native Financial Operations
            </p>
          </div>
        </div>

        {/* Login Title */}
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your FinGuard account</p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-teal-700 rounded cursor-pointer border-slate-300"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline transition-all"
            >
              Forgot password?
            </button>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating credentials...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        {/* Demo Account Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        {/* Demo Credential Autofill Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="w-full py-2.5 px-4 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            <Sparkles className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
            <span>Use Demo Credentials</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 font-medium">
            Demo credentials are filled for testing.
          </p>
        </div>

        {/* Sign Up Navigation Link */}
        <div className="text-center text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500">Don't have a FinGuard account? </span>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Create an account
          </button>
        </div>

        {/* Security Message Badge */}
        <div className="pt-2 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
            🔒 Your financial workspace is protected.
          </span>
        </div>
      </div>

      {/* Screen Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
          <a href="#privacy" className="hover:text-slate-800 transition-colors">Privacy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-slate-800 transition-colors">Terms</a>
          <span>•</span>
          <a href="#help" className="hover:text-slate-800 transition-colors">Help</a>
        </div>
        <p className="text-[11px]">© 2026 FinGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
