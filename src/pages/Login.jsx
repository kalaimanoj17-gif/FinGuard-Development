import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { useToast } from "../components/ui";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Login() {
  const { login, signup, isAuthenticated, usersDb } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useToast();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState("Business Owner");
  const [rememberMe, setRememberMe] = useState(true);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setMode("signin");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (mode === "signin") {
        const res = login(email, password);
        if (res.success) {
          push(`Welcome back, ${res.user.name}!`, "success");
          const destination = location.state?.from?.pathname || "/";
          navigate(destination, { replace: true });
        } else {
          setError(res.message);
          push(res.message, "warning");
        }
      } else {
        if (!name.trim() || !email.trim() || !password) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }

        const res = signup({
          name,
          email,
          password,
          businessName,
          role,
        });

        if (res.success) {
          push(`Account created successfully! Welcome, ${res.user.name}.`, "success");
          navigate("/", { replace: true });
        } else {
          setError(res.message);
          push(res.message, "warning");
        }
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white overflow-hidden bg-[#F8FAFC] font-body"
    >
      {/* Dynamic Ambient Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm backdrop-blur-md mb-2.5">
            <Logo dark={false} size="lg" />
          </div>
          <h2 className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900">
            {mode === "signin" ? "Sign In to FinGuard" : "Create Your Account"}
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-slate-500 font-medium">
            Autonomous financial intelligence & credit governance
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 mb-4">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3.5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 animate-[fadeIn_.15s_ease-out]">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <User size={13} className="text-blue-600" />
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Janarthanan V"
                    className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Building size={13} className="text-blue-600" />
                      Business name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. MJ Solutions"
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Sparkles size={13} className="text-blue-600" />
                      Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Financial CEO"
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Mail size={13} className="text-blue-600" />
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Lock size={13} className="text-blue-600" />
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => push("Use the 1-click demo buttons below to fill credentials.", "info")}
                    className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signin" && (
              <div className="flex items-center justify-between py-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember my session</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all disabled:opacity-50 mt-1 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign in to Dashboard" : "Register & Enter"}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-4 border-t border-slate-100 pt-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
              <KeyRound size={13} className="text-blue-600" />
              <span>1-Click Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill("janarthananv456@gmail.com", "Jana@Project")}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50/60 p-2 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600">Janarthanan</span>
                  <span className="text-[9px] rounded bg-blue-50 text-blue-700 border border-blue-200/80 px-1 py-0.2 font-bold">CEO</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate w-full">janarthananv...</span>
                <span className="text-[9px] text-blue-600 font-medium">Jana@Project</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("riya@handloomexports.in", "Admin@123")}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50/60 p-2 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600">Riya Shah</span>
                  <span className="text-[9px] rounded bg-blue-50 text-blue-700 border border-blue-200/80 px-1 py-0.2 font-bold">CFO</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate w-full">riya@handloom...</span>
                <span className="text-[9px] text-blue-600 font-medium">Admin@123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("demo@finguard.ai", "Demo@123")}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50/60 p-2 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600">Aman Verma</span>
                  <span className="text-[9px] rounded bg-blue-50 text-blue-700 border border-blue-200/80 px-1 py-0.2 font-bold">Analyst</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate w-full">demo@finguard...</span>
                <span className="text-[9px] text-blue-600 font-medium">Demo@123</span>
              </button>
            </div>
          </div>

          {/* Database & Security indicator */}
          <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
            <div className="flex items-center gap-1.5">
              <Database size={13} className="text-blue-600" />
              <span>Dummy DB: {usersDb?.length || 3} accounts</span>
            </div>
            <div className="flex items-center gap-1 text-blue-700 font-semibold">
              <Shield size={13} />
              <span>Protected Gate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
