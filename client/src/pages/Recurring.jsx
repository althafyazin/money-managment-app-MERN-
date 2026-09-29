import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Trash2, Calendar, RefreshCw, CheckCircle2, Clock, Tag, AlertCircle } from 'lucide-react';
import { recurringApi } from '../api/recurringApi';
import categoryApi from '../api/categoryApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const Recurring = () => {
  const [recurringList, setRecurringList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processResult, setProcessResult] = useState(null);
  const [modalError, setModalError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    nextDueDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const catRes = await categoryApi.getCategories();
      const catList =
        catRes?.data?.categories ||
        catRes?.categories ||
        catRes?.data ||
        (Array.isArray(catRes) ? catRes : []);
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchRecurring = async () => {
    try {
      const recData = await recurringApi.getRecurring();
      setRecurringList(recData || []);
    } catch (err) {
      console.error('Failed to load recurring list:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await recurringApi.processDue();
    } catch (err) {
      console.error('Auto-processing recurring items failed:', err);
    }
    await Promise.all([fetchRecurring(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  // Auto-select first category when modal opens or type changes
  useEffect(() => {
    if (isModalOpen) {
      const available = filteredCategories.length > 0 ? filteredCategories : categories;
      if (available.length > 0) {
        const firstCatId = available[0]._id || available[0].id;
        if (!formData.category || !available.some((c) => (c._id || c.id) === formData.category)) {
          setFormData((prev) => ({ ...prev, category: firstCatId }));
        }
      }
    }
  }, [isModalOpen, formData.type, categories]);

  const handleOpenModal = () => {
    setModalError('');
    const available = filteredCategories.length > 0 ? filteredCategories : categories;
    const initialCatId = available.length > 0 ? (available[0]._id || available[0].id) : '';
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: initialCatId,
      frequency: 'monthly',
      nextDueDate: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.category) {
      setModalError('Please select a valid category');
      return;
    }

    try {
      setSubmitting(true);
      await recurringApi.createRecurring({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        frequency: 'monthly',
        nextDueDate: new Date().toISOString().split('T')[0],
        description: '',
      });
      await recurringApi.processDue();
      fetchRecurring();
    } catch (err) {
      console.error('Failed to create recurring transaction:', err);
      setModalError(err.message || 'Failed to create recurring transaction template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recurring template?')) return;
    try {
      await recurringApi.deleteRecurring(id);
      fetchRecurring();
    } catch (err) {
      console.error('Failed to delete recurring item:', err);
    }
  };

  const handleProcessDue = async () => {
    try {
      setProcessing(true);
      const result = await recurringApi.processDue();
      // result = { processedCount, records }
      setProcessResult(result);
      await fetchRecurring();
    } catch (err) {
      console.error('Failed to process due recurring items:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Recurring Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automate your recurring bills, subscriptions, and income schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProcessDue}
            disabled={processing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            {processing ? 'Processing...' : 'Process Due Transactions'}
          </button>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Template
          </button>
        </div>
      </div>

      {/* Process Notification Result Banner */}
      {processResult && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {processResult.processedCount > 0
                ? `Successfully generated ${processResult.processedCount} transaction record(s)!`
                : 'All recurring transactions are up to date.'}
            </span>
          </div>
          <button onClick={() => setProcessResult(null)} className="text-xs text-emerald-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Cards Grid of Recurring Templates */}
      {recurringList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <Repeat className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Recurring Transactions Set Up</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Add recurring subscriptions, monthly rent, or automatic salaries to track your automated cashflow.
          </p>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Create First Recurring Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recurringList.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/70 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      item.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {item.type} • {item.frequency}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.title}</h3>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100 my-2">
                  ${item.amount.toFixed(2)}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Category: {item.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Next Due: {new Date(item.nextDueDate).toLocaleDateString()}</span>
                  </div>
                  {item.lastProcessedDate && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Last generated: {new Date(item.lastProcessedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Recurring Template Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Recurring Transaction Template">
        <form onSubmit={handleCreate} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix Subscription, Apartment Rent"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
            >
              {(filteredCategories.length > 0 ? filteredCategories : categories).map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Next Due Date</label>
            <input
              type="date"
              required
              value={formData.nextDueDate}
              onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Creating...' : 'Create Recurring Template'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Recurring;
