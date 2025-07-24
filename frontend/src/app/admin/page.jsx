'use client';

import React, { useEffect, useState } from 'react';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import { useRouter } from 'next/navigation';
import StatisticCard from '../../components/ui/StatisticCard';
import ChartCard from '../../components/ui/ChartCard';
import useDashboardData from '../../hooks/useDashboardData';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading } = useAccountAuth();
  const router = useRouter();
  const { dashboardData, loading: dataLoading, error } = useDashboardData();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-sage-600 dark:text-sage-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sage-900 dark:text-sage-100">
            Dashboard
          </h1>
          <p className="text-sage-600 dark:text-sage-400 mt-1">
            Chào mừng {user?.fullName || 'Admin'} đến với hệ thống quản lý thư viện
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-600 dark:text-red-400">
            Có lỗi xảy ra khi tải dữ liệu: {error}
          </p>
        </div>
      )}

      {dashboardData && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatisticCard
              title="Tổng số sách"
              value={dashboardData.totalBooks || 0}
              icon="📚"
              trend="+12%"
              trendDirection="up"
            />
            <StatisticCard
              title="Bản sách"
              value={dashboardData.totalBookCopies || 0}
              icon="📖"
              trend="+8%"
              trendDirection="up"
            />
            <StatisticCard
              title="Mượn trả"
              value={dashboardData.totalBorrowings || 0}
              icon="🔄"
              trend="+15%"
              trendDirection="up"
            />
            <StatisticCard
              title="Quá hạn"
              value={dashboardData.overdueBooks || 0}
              icon="⚠️"
              trend="-5%"
              trendDirection="down"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Thống kê mượn trả theo tháng"
              data={dashboardData.monthlyStats || []}
              type="line"
            />
            <ChartCard
              title="Phân bố sách theo danh mục"
              data={dashboardData.categoryStats || []}
              type="pie"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard; 