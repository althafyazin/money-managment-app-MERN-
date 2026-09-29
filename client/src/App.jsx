import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';
import Budgets from './pages/Budgets';
import Recurring from './pages/Recurring';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return 'Dashboard Overview';
      case '/expenses':
        return 'Expense Management';
      case '/incomes':
        return 'Income Management';
      case '/budgets':
        return 'Budget Limits & Goals';
      case '/recurring':
        return 'Recurring Transactions';
      default:
        return 'FinanceFlow';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar mobileOpen={mobileOpen} onMobileMenuToggle={() => setMobileOpen((o) => !o)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle={getPageTitle(location.pathname)} onMenuToggle={() => setMobileOpen((o) => !o)} />
        {/* pb-16 md:pb-0 → leaves room for the mobile bottom tab bar */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/expenses"
                element={
                  <AppLayout>
                    <Expenses />
                  </AppLayout>
                }
              />
              <Route
                path="/incomes"
                element={
                  <AppLayout>
                    <Incomes />
                  </AppLayout>
                }
              />
              <Route
                path="/budgets"
                element={
                  <AppLayout>
                    <Budgets />
                  </AppLayout>
                }
              />
              <Route
                path="/recurring"
                element={
                  <AppLayout>
                    <Recurring />
                  </AppLayout>
                }
              />
            </Route>

            {/* Fallback 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
