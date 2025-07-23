'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '../../hooks/useBooksApi';
import ActionButton from '../../components/ui/ActionButton';
import StatisticCard from '../../components/ui/StatisticCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CogIcon,
  BuildingLibraryIcon,
  QrCodeIcon,
  ArrowUpTrayIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const router = useRouter();
  const { books, loading } = useBooks();

  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalReaders: 0,
    totalStaff: 0,
    overdueBooks: 0
  });

  useEffect(() => {
    if (books.length > 0) {
      const totalBooks = books.length;
      const availableBooks = books.filter(book => 
        book.bookCopies?.some(copy => copy.status === 'AVAILABLE')
      ).length;
      const borrowedBooks = books.filter(book => 
        book.bookCopies?.some(copy => copy.status === 'BORROWED')
      ).length;

      setStats({
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalReaders: 1250, 
        totalStaff: 45, 
        overdueBooks: 23 
      });
    } else {
      // Mock data khi không có books
      setStats({
        totalBooks: 15420,
        availableBooks: 12350,
        borrowedBooks: 3070,
        totalReaders: 1250, 
        totalStaff: 45, 
        overdueBooks: 23 
      });
    }
  }, [books]);

  const quickActions = [
    {
      title: 'Thêm sách mới',
      description: 'Thêm sách và bản sách vào hệ thống',
      icon: PlusIcon,
      color: 'sage',
      href: '/admin/books/create'
    },
    {
      title: 'Quản lý sách',
      description: 'Xem và chỉnh sửa thông tin sách',
      icon: BookOpenIcon,
      color: 'blue',
      href: '/admin/books'
    },
    {
      title: 'Quản lý mượn trả',
      description: 'Theo dõi hoạt động mượn trả sách',
      icon: UserGroupIcon,
      color: 'emerald',
      href: '/admin/borrowings'
    },
    {
      title: 'Quản lý độc giả',
      description: 'Quản lý thông tin độc giả',
      icon: UserIcon,
      color: 'amber',
      href: '/admin/readers'
    },
    {
      title: 'Quản lý nhân viên',
      description: 'Quản lý tài khoản nhân viên',
      icon: UserGroupIcon,
      color: 'purple',
      href: '/admin/staff'
    },
    {
      title: 'Scanner QR',
      description: 'Quét mã QR để mượn/trả sách',
      icon: QrCodeIcon,
      color: 'indigo',
      href: '/admin/scanner'
    }
  ];

  const recentActivities = [
    {
      type: 'borrow',
      title: 'Nguyễn Văn A mượn sách "Clean Code"',
      time: '2 phút trước',
      icon: BookOpenIcon,
      color: 'emerald'
    },
    {
      type: 'return',
      title: 'Trần Thị B trả sách "Design Patterns"',
      time: '15 phút trước',
      icon: CheckCircleIcon,
      color: 'blue'
    },
    {
      type: 'overdue',
      title: 'Lê Văn C quá hạn trả sách "Refactoring"',
      time: '1 giờ trước',
      icon: ExclamationTriangleIcon,
      color: 'red'
    },
    {
      type: 'add',
      title: 'Thêm 5 bản sách mới "System Design"',
      time: '2 giờ trước',
      icon: PlusIcon,
      color: 'sage'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      sage: 'bg-sage-100 text-sage-600 dark:bg-sage-900 dark:text-sage-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
      amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
    };
    return colors[color] || colors.sage;
  };

  // Chart data
  const monthlyBorrowData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Sách mượn',
        data: [120, 150, 180, 200, 170, 220],
        borderColor: '#5a735a',
        backgroundColor: 'rgba(90, 115, 90, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryDistributionData = {
    labels: ['Khoa học máy tính', 'Văn học', 'Lịch sử', 'Kinh tế', 'Y học'],
    datasets: [
      {
        data: [300, 250, 180, 200, 150],
        backgroundColor: [
          '#5a735a',
          '#7a907a',
          '#a3b3a3',
          '#c7d0c7',
          '#e3e7e3'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              {/* Header Skeleton */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage-200 dark:bg-sage-700 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-48"></div>
                  <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-64"></div>
                </div>
              </div>
              
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-4 sm:p-6 border border-sage-200 dark:border-sage-700">
                    <div className="space-y-3">
                      <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-24"></div>
                      <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center shadow-soft">
                <CogIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý hệ thống thư viện Sage-Librarian
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatisticCard
              title="Tổng số sách"
              value={stats.totalBooks}
              icon={<BookOpenIcon className="w-6 h-6" />}
              color="sage"
              trend="+12%"
              changeType="up"
            />
            <StatisticCard
              title="Sách có sẵn"
              value={stats.availableBooks}
              icon={<CheckCircleIcon className="w-6 h-6" />}
              color="emerald"
              trend="+5%"
              changeType="up"
            />
            <StatisticCard
              title="Sách đã mượn"
              value={stats.borrowedBooks}
              icon={<UserGroupIcon className="w-6 h-6" />}
              color="amber"
              trend="-2%"
              changeType="down"
            />
            <StatisticCard
              title="Sách quá hạn"
              value={stats.overdueBooks}
              icon={<ExclamationTriangleIcon className="w-6 h-6" />}
              color="red"
              trend="+8%"
              changeType="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4 sm:mb-6">
                  Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(action.href)}
                      className="p-3 sm:p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700 cursor-pointer hover:shadow-medium transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(action.color)} group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors duration-200 text-sm sm:text-base">
                            {action.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4 sm:mb-6">
                  Hoạt động gần đây
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(activity.color)}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-sage-900 dark:text-sage-100 line-clamp-2">
                          {activity.title}
                        </p>
                        <p className="text-xs text-sage-500 dark:text-sage-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-sage-200 dark:border-sage-700">
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin/activities')}
                    className="w-full min-h-[40px]"
                  >
                    Xem tất cả hoạt động
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
            <ChartCard
              title="Thống kê mượn sách theo tháng"
              description="Biểu đồ thể hiện số lượng sách được mượn trong 6 tháng gần đây"
              chartType="line"
              data={monthlyBorrowData}
            />
            
            <ChartCard
              title="Phân bố sách theo danh mục"
              description="Biểu đồ thể hiện số lượng sách theo từng danh mục"
              chartType="doughnut"
              data={categoryDistributionData}
            />
          </div>

          {/* System Status */}
          <div className="mt-6 sm:mt-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4 sm:mb-6">
                Trạng thái hệ thống
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sage-900 dark:text-sage-100 text-sm sm:text-base">Database</p>
                    <p className="text-xs sm:text-sm text-sage-600 dark:text-sage-400">Hoạt động bình thường</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sage-900 dark:text-sage-100 text-sm sm:text-base">Cache</p>
                    <p className="text-xs sm:text-sm text-sage-600 dark:text-sage-400">Hoạt động bình thường</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sage-900 dark:text-sage-100 text-sm sm:text-base">API</p>
                    <p className="text-xs sm:text-sm text-sage-600 dark:text-sage-400">Hoạt động bình thường</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 