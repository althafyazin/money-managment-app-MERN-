import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle, AlertTriangle, Info, TrendingUp, Wallet } from 'lucide-react';

const AIInsightsCard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-4"></div>
        <div className="space-y-2">
          <div className="h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
          <div className="h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { healthScore, statusLabel, statusColor, metrics, insights } = data;

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          badge: 'bg-emerald-500 text-white',
          gauge: 'stroke-emerald-500',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          badge: 'bg-blue-500 text-white',
          gauge: 'stroke-blue-500',
        };
      case 'red':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          badge: 'bg-red-500 text-white',
          gauge: 'stroke-red-500',
        };
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-500 text-white',
          gauge: 'stroke-amber-500',
        };
    }
  };

  const activeColor = getColorClasses(statusColor);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              AI Financial Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time health score & automated advice</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activeColor.badge}`}>
          {statusLabel} Health
        </span>
      </div>

      {/* Main Score Card & Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Health Score Gauge Box */}
        <div className={`p-4 rounded-xl border ${activeColor.bg} ${activeColor.border} flex flex-col items-center justify-center text-center`}>
          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${activeColor.gauge} transition-all duration-1000 ease-out`}
                strokeDasharray={`${healthScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-2xl font-bold ${activeColor.text}`}>{healthScore}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Score</span>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Savings Rate:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{metrics.savingsRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, metrics.savingsRate))}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" /> Budget Discipline:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{metrics.budgetComplianceRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.budgetComplianceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Insights Summary List */}
        <div className="md:col-span-1 space-y-2 max-h-40 overflow-y-auto pr-1">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 flex items-start gap-2.5"
            >
              {getInsightIcon(item.type)}
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsCard;
