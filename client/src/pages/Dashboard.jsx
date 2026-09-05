import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, CreditCard, PiggyBank, ArrowUpRight, TrendingUp } from 'lucide-react';
import dashboardApi from '../api/dashboardApi';
import StatCard from '../components/common/StatCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, chartRes, recentRes] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getCharts('6months'),
          dashboardApi.getRecent(5),
        ]);
        setSummary(sumRes.data);
        setCharts(chartRes.data);
        setRecent(recentRes.data.transactions || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { lifetime, currentMonth, growthMoM } = summary || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Financial KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Lifetime Income"
          amount={lifetime?.totalIncome}
          icon={ArrowDownLeft}
          color="emerald"
          trend={growthMoM?.incomeGrowthPercentage}
          trendLabel="MoM"
        />
        <StatCard
          title="Total Lifetime Expenses"
          amount={lifetime?.totalExpense}
          icon={CreditCard}
          color="rose"
          trend={growthMoM?.expenseGrowthPercentage}
          trendLabel="MoM"
        />
        <StatCard
          title="Net Savings"
          amount={lifetime?.netSavings}
          icon={Wallet}
          color="indigo"
        />
        <StatCard
          title="Savings Rate"
          amount={lifetime?.savingsRate ? `${lifetime.savingsRate}%` : '0%'}
          icon={PiggyBank}
          color="amber"
        />
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Monthly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financial Trends</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Income vs Expenses over last 6 months</p>
            </div>
          </div>
          <MonthlyTrendChart data={charts?.monthlyTrends || []} />
        </div>

        {/* Expense Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Category Breakdown</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Spending proportion by category</p>
            </div>
          </div>
          <CategoryPieChart data={charts?.categoryBreakdown || []} />
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent transactions recorded</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {recent.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
