import React from 'react';

const StatisticCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  className = '',
  color = 'sage',
  trend,
  trendDirection = 'neutral'
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'negative':
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-sage-600 dark:text-sage-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
      case 'up':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'negative':
      case 'down':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        );
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'sage':
        return 'bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400';
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400';
      case 'amber':
        return 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400';
      case 'red':
        return 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400';
      case 'indigo':
        return 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400';
      default:
        return 'bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400';
    }
  };

  // Format value with proper number formatting
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('vi-VN');
    }
    return val;
  };

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 hover:shadow-medium transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-sage-600 dark:text-sage-400 mb-2 leading-relaxed">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-sage-900 dark:text-sage-100 mb-2 leading-tight">
            {formatValue(value)}
          </p>
          {(change || trend) && (
            <div className={`flex items-center ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-xs sm:text-sm font-medium ml-1 leading-relaxed">
                {change || trend}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${getColorClasses()} flex-shrink-0 ml-3 shadow-soft`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticCard; 