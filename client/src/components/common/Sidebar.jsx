import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowDownLeft, PieChart, Repeat, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Incomes', path: '/incomes', icon: ArrowDownLeft },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Recurring', path: '/recurring', icon: Repeat },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700/60 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">FinanceFlow</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-700/60">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
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
  );
};

export default Sidebar;
