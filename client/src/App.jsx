import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import Reconciliation from './pages/Reconciliation';
import Compliance from './pages/Compliance';
import FraudAlerts from './pages/FraudAlerts';
import CashForecast from './pages/CashForecast';
import Reports from './pages/Reports';
import FinGuardAI from './pages/FinGuardAI';
import AiActionCenterPage from './pages/AiActionCenterPage';
import SettingsPage from './pages/Settings';
import Help from './pages/Help';
import Unauthorized from './pages/Unauthorized';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';

import ActionModal from './components/ActionModal';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import UploadExpenseModal from './components/UploadExpenseModal';

import { INVOICES_LIST, EXPENSES_LIST } from './data/mockData';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'forgot-password' | 'signup'

  // Clean up legacy or invalid session storage keys
  const clearAuthStorage = () => {
    try {
      sessionStorage.removeItem('finguard_session');
      localStorage.removeItem('finguard_session');
      ['auth', 'authenticated', 'isAuthenticated', 'user', 'session', 'demoUser'].forEach(key => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      });
    } catch (e) {
      // Storage access error fallback
    }
  };

  // Perform session check on app startup
  useEffect(() => {
    try {
      // 1. Check current tab session in sessionStorage first
      const sessionData = sessionStorage.getItem('finguard_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsAuthenticated(true);
          setIsAuthInitializing(false);
          return;
        } else {
          sessionStorage.removeItem('finguard_session');
        }
      }

      // 2. Check persisted session in localStorage (only if rememberMe was explicitly checked)
      const localData = localStorage.getItem('finguard_session');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed && parsed.email && parsed.rememberMe === true) {
          sessionStorage.setItem('finguard_session', localData);
          setUser(parsed);
          setIsAuthenticated(true);
          setIsAuthInitializing(false);
          return;
        } else {
          localStorage.removeItem('finguard_session');
        }
      }

      // 3. No valid session found -> default to unauthenticated /login
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      clearAuthStorage();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsAuthInitializing(false);
    }
  }, []);

  // Workspace Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoicesList, setInvoicesList] = useState(INVOICES_LIST);
  const [expensesList, setExpensesList] = useState(EXPENSES_LIST);

  const fetchLists = () => {
    api.getInvoices()
      .then(res => {
        if (res && res.invoices) setInvoicesList(res.invoices);
      })
      .catch(() => {});

    api.getExpenses()
      .then(res => {
        if (res && res.expenses) setExpensesList(res.expenses);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Modals state
  const [selectedActionModal, setSelectedActionModal] = useState(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isUploadExpenseOpen, setIsUploadExpenseOpen] = useState(false);

  // Auth Actions
  const handleLoginSuccess = (userData, rememberMe = false) => {
    if (!userData || !userData.email) {
      setIsAuthenticated(false);
      setUser(null);
      clearAuthStorage();
      return false;
    }

    const sessionPayload = { ...userData, rememberMe: !!rememberMe };

    setUser(sessionPayload);
    setIsAuthenticated(true);
    setActiveTab('dashboard');

    // Always set active tab session in sessionStorage
    sessionStorage.setItem('finguard_session', JSON.stringify(sessionPayload));

    // Set localStorage ONLY if Remember Me is checked
    if (rememberMe) {
      localStorage.setItem('finguard_session', JSON.stringify(sessionPayload));
    } else {
      localStorage.removeItem('finguard_session');
    }
    return true;
  };

  const handleLogout = () => {
    clearAuthStorage();
    setIsAuthenticated(false);
    setUser(null);
    setAuthScreen('login');
  };

  const handleCreateInvoice = (newInv) => {
    setInvoicesList((prev) => [newInv, ...prev]);
    fetchLists();
  };

  const handleAddExpense = (newExp) => {
    setExpensesList((prev) => [newExp, ...prev]);
    fetchLists();
  };

  const handleResolveAction = (actionId) => {
    fetchLists();
  };

  // Role Permission Checker
  const isAuthorized = (tabId) => {
    if (!user || user.role === 'Business Owner / Admin') return true;
    if (user.role === 'Finance Manager') {
      return ['dashboard', 'invoices', 'expenses', 'transactions', 'reconciliation', 'compliance', 'fraud', 'forecast', 'reports', 'ai-copilot', 'action-center', 'help'].includes(tabId);
    }
    if (user.role === 'Employee') {
      return ['dashboard', 'expenses', 'ai-copilot', 'help'].includes(tabId);
    }
    return true;
  };

  // Auth Initialization Guard
  if (isAuthInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Flow
  if (!isAuthenticated) {
    if (authScreen === 'forgot-password') {
      return <ForgotPassword onNavigate={(scr) => setAuthScreen(scr)} />;
    }
    if (authScreen === 'signup') {
      return (
        <Signup 
          onNavigate={(scr) => setAuthScreen(scr)} 
          onLogin={(usrData) => handleLoginSuccess(usrData, false)}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLoginSuccess}
        onNavigate={(scr) => setAuthScreen(scr)}
      />
    );
  }

  // Render Protected Active Page
  const renderActivePage = () => {
    if (!isAuthorized(activeTab)) {
      return <Unauthorized onBackToDashboard={() => setActiveTab('dashboard')} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSelectAction={setSelectedActionModal} setActiveTab={setActiveTab} />;
      case 'invoices':
        return (
          <Invoices 
            onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)} 
            invoicesList={invoicesList}
            onSelectAction={setSelectedActionModal}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            onOpenUploadExpense={() => setIsUploadExpenseOpen(true)} 
            expensesList={expensesList}
          />
        );
      case 'transactions':
        return <Transactions setActiveTab={setActiveTab} />;
      case 'reconciliation':
        return <Reconciliation />;
      case 'compliance':
        return <Compliance onSelectAction={setSelectedActionModal} />;
      case 'fraud':
        return <FraudAlerts onSelectAction={setSelectedActionModal} />;
      case 'forecast':
        return <CashForecast />;
      case 'reports':
        return <Reports />;
      case 'ai-copilot':
        return <FinGuardAI />;
      case 'action-center':
        return <AiActionCenterPage onSelectAction={setSelectedActionModal} />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <Help setActiveTab={setActiveTab} />;
      default:
        return <Dashboard onSelectAction={setSelectedActionModal} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user}
          onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
          onOpenUploadExpense={() => setIsUploadExpenseOpen(true)}
          onSelectAction={setSelectedActionModal}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Interactive Modals */}
      {selectedActionModal && (
        <ActionModal 
          action={selectedActionModal} 
          onClose={() => setSelectedActionModal(null)}
          onResolveSuccess={handleResolveAction}
        />
      )}

      {isCreateInvoiceOpen && (
        <CreateInvoiceModal 
          onClose={() => setIsCreateInvoiceOpen(false)}
          onSave={handleCreateInvoice}
        />
      )}

      {isUploadExpenseOpen && (
        <UploadExpenseModal 
          onClose={() => setIsUploadExpenseOpen(false)}
          onAddExpense={handleAddExpense}
        />
      )}
    </div>
  );
}
