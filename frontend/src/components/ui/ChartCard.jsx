import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartCard = ({ 
  title, 
  description,
  chartType = 'line',
  data,
  children, 
  className = '',
  loading = false 
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#5a735a',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: chartType === 'line' ? {
      x: {
        grid: {
          color: 'rgba(90, 115, 90, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(90, 115, 90, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      }
    } : undefined
  };

  const renderChart = () => {
    if (!data) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-sage-500 dark:text-sage-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">Không có dữ liệu</p>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-2/3 mb-4"></div>
          <div className="h-64 bg-sage-200 dark:bg-sage-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 hover:shadow-medium transition-all duration-300 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2 leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-sage-600 dark:text-sage-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="h-64">
        {children || renderChart()}
      </div>
    </div>
  );
};

export default ChartCard; 