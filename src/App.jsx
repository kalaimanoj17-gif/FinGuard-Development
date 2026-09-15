import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppShell from "./layout/AppShell";
import { ToastProvider } from "./components/ui";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { FinanceProvider } from "./context/FinanceContext";
import { InvoiceProvider } from "./context/InvoiceContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileModal from "./components/ProfileModal";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Credit from "./pages/Credit";
import Advisor from "./pages/Advisor";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const ROUTE_KEYS = {
  "/": "dashboard",
  "/invoices": "invoices",
  "/expenses": "expenses",
  "/transactions": "transactions",
  "/customers": "customers",
  "/payments": "payments",
  "/credit": "credit",
  "/advisor": "advisor",
  "/reports": "reports",
  "/settings": "settings",
};

function DashboardLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const pathname = location.pathname || "/";
  const pageKey = ROUTE_KEYS[pathname] || "dashboard";
  const title = t(pageKey, "FinGuard AI");

  return (
    <AppShell title={title}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ProfileModal />
    </AppShell>
  );
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <ToastProvider>
          <LanguageProvider>
            <AuthProvider>
              <UserProvider>
                <FinanceProvider>
                  <InvoiceProvider>
                    <MainRoutes />
                  </InvoiceProvider>
                </FinanceProvider>
              </UserProvider>
            </AuthProvider>
          </LanguageProvider>
        </ToastProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
