'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ChartCard from '../../components/ui/ChartCard';
import NotificationToast from '../../components/ui/NotificationToast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    activeBorrowings: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // Chart data - will be populated from API
  const [chartData, setChartData] = useState({
    borrowingTrend: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Sách mượn',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'Sách trả',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }
      ]
    },
    categoryDistribution: {
      labels: ['Văn học', 'Khoa học', 'Lịch sử', 'Kinh tế', 'Công nghệ'],
      datasets: [
        {
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        }
      ]
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data using dashboard service
      const response = await dashboardService.getAllDashboardData();
      
      if (response.success) {
        const { stats: dashboardStats, borrowingTrend, categoryDistribution } = response.data;
        
        setStats({
          totalBooks: dashboardStats.totalBooks,
          totalReaders: dashboardStats.totalReaders,
          activeBorrowings: dashboardStats.activeBorrowings,
          totalCategories: dashboardStats.totalCategories
        });

        setChartData({
          borrowingTrend,
          categoryDistribution
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Không thể tải dữ liệu dashboard: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="STAFF">
        <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
          <div className="p-4 sm:p-6 lg:p-6">
            <div className="max-w-none mx-auto">
              <LoadingSkeleton type="card" count={1} className="mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <LoadingSkeleton type="stat" count={4} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LoadingSkeleton type="chart" count={2} />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="STAFF">
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6 lg:p-6">
          <div className="max-w-none mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                    Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                    Chào mừng trở lại, {user?.fullName || 'Admin'}!
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Tổng sách</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">{stats.totalBooks.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-xl">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Độc giả</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">{stats.totalReaders.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Đang mượn</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">{stats.activeBorrowings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Danh mục</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">{stats.totalCategories}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Xu hướng mượn trả sách"
                type="line"
                data={chartData.borrowingTrend}
                className="bg-white dark:bg-neutral-900"
              />
              <ChartCard
                title="Phân bố danh mục sách"
                type="doughnut"
                data={chartData.categoryDistribution}
                className="bg-white dark:bg-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        <NotificationToast
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard; 