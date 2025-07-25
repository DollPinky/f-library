'use client';

import React from 'react';
import { 
  BookOpenIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const StatsCard = ({ title, value, icon: Icon, color, trend, description }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'bg-green-600 dark:bg-green-500',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-700'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'bg-blue-600 dark:bg-blue-500',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-700'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          icon: 'bg-amber-600 dark:bg-amber-500',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-700'
        };
      case 'red':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          icon: 'bg-red-600 dark:bg-red-500',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-700'
        };
      default:
        return {
          bg: 'bg-sage-50 dark:bg-sage-900/20',
          icon: 'bg-sage-600 dark:bg-sage-500',
          text: 'text-sage-700 dark:text-sage-300',
          border: 'border-sage-200 dark:border-sage-700'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl border ${colorClasses.border} shadow-soft p-6 hover:shadow-medium transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 ${colorClasses.icon} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${colorClasses.text}`}>
                {title}
              </p>
              {trend && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                  <span className="text-xs text-sage-500">so với hôm qua</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-3xl font-bold text-sage-900 dark:text-sage-100">
              {value}
            </p>
          </div>
          
          {description && (
            <p className="text-sm text-sage-600 dark:text-sage-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 