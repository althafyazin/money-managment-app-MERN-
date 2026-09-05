import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import budgetApi from '../api/budgetApi';
import categoryApi from '../api/categoryApi';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ totalBudgeted: 0, totalSpentInBudgets: 0, overallPercentageUsed: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month & Year Selection
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amountLimit: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getBudgets({ month, year });
      setBudgets(res.data.budgets);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories('expense');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category?._id || '',
        amountLimit: budget.amountLimit,
        month: budget.month,
        year: budget.year,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        category: categories[0]?._id || '',
        amountLimit: '',
        month,
        year,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await budgetApi.updateBudget(editingBudget._id, formData.amountLimit);
      } else {
        await budgetApi.createOrUpdateBudget(formData);
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this budget target?')) return;
    try {
      await budgetApi.deleteBudget(id);
      fetchBudgets();
    } catch (err) {
      alert(err.message || 'Failed to delete budget');
    }
  };

  const getStatusBadge = (status, percentage) => {
    if (status === 'exceeded') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <AlertCircle className="w-3 h-3" /> Exceeded ({percentage}%)
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <AlertTriangle className="w-3 h-3" /> Warning ({percentage}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> On Track ({percentage}%)
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Budgets</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Overall Progress: <span className="font-semibold text-indigo-600">${summary.totalSpentInBudgets.toFixed(2)}</span> / ${summary.totalBudgeted.toFixed(2)} ({summary.overallPercentageUsed}%)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="py-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="py-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all text-xs"
          >
            <Plus className="w-4 h-4" /> Set Budget
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-12 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400">No budgets set for this month.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl"
          >
            Set a Category Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: b.category?.color || '#6366F1' }}
                  >
                    {b.category?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{b.category?.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Limit: ${b.amountLimit.toFixed(2)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(b.status, b.percentageUsed)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-600 dark:text-slate-300">Spent: ${b.spentAmount.toFixed(2)}</span>
                  <span className="text-gray-500 dark:text-slate-400">Remains: ${b.remainingAmount.toFixed(2)}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.status === 'exceeded'
                        ? 'bg-rose-500'
                        : b.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700/60">
                <button
                  onClick={() => handleOpenModal(b)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? 'Edit Budget Limit' : 'Set Category Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Category</label>
            <select
              required
              disabled={!!editingBudget}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm disabled:opacity-60"
            >
              <option value="">Select Expense Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Monthly Limit ($)</label>
            <input
              type="number"
              step="1"
              required
              min="1"
              value={formData.amountLimit}
              onChange={(e) => setFormData({ ...formData, amountLimit: e.target.value })}
              placeholder="e.g. 500"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Month</label>
              <select
                disabled={!!editingBudget}
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm disabled:opacity-60"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('en', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Year</label>
              <select
                disabled={!!editingBudget}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm disabled:opacity-60"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium">
              Save Budget Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
