import React from 'react';

const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const renderCardSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-3/4"></div>
        <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-1/2"></div>
        <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-1/4"></div>
      </div>
    </div>
  );

  const renderStatCardSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-24"></div>
          <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-16"></div>
          <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-12"></div>
        </div>
        <div className="w-12 h-12 bg-sage-200 dark:bg-sage-700 rounded-xl"></div>
      </div>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-5 bg-sage-200 dark:bg-sage-700 rounded w-1/3"></div>
        <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-2/3"></div>
        <div className="h-64 bg-sage-200 dark:bg-sage-700 rounded"></div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 animate-pulse">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-sage-200 dark:bg-sage-700 rounded w-32"></div>
          <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/4"></div>
              <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/3"></div>
              <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/6"></div>
              <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-sage-200 dark:bg-sage-700 rounded w-1/3"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sage-200 dark:bg-sage-700 rounded-lg"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-3/4"></div>
                <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'stat-card':
        return renderStatCardSkeleton();
      case 'chart':
        return renderChartSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'card':
      default:
        return renderCardSkeleton();
    }
  };

  if (count === 1) {
    return (
      <div className={className}>
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(count, 4)} gap-4 sm:gap-6 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton; 