import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowDownLeft, PieChart, Repeat, LogOut, Wallet, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: CreditCard },
  { name: 'Incomes', path: '/incomes', icon: ArrowDownLeft },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Recurring', path: '/recurring', icon: Repeat },
];

// ─── Shared nav link renderer ─────────────────────────────────────────────────
const NavItems = ({ onNavigate }) => {
  const { logout } = useAuth();
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {item.name}
          </NavLink>
        );
      })}
    </>
  );
};

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const Sidebar = ({ onMobileMenuToggle, mobileOpen }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {/* ── Desktop sidebar (md+) ───────────────────────────────────────────── */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700/60 flex-col justify-between hidden md:flex min-h-screen shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">FinanceFlow</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1.5">
            <NavItems />
          </nav>
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Drawer (slide-in from left) ──────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 z-50 flex flex-col justify-between shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">FinanceFlow</span>
            </div>
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            <NavItems onNavigate={onMobileMenuToggle} />
          </nav>
        </div>

        {/* Drawer user footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar ────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-[10px] font-medium transition-all duration-150 min-w-0 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/60' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
