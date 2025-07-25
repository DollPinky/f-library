'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../services/borrowingService';
import BorrowingCard from '../../components/ui/BorrowingCard';
import FilterBar from '../../components/ui/FilterBar';
import StatsCard from '../../components/ui/StatsCard';
import NotificationToast from '../../components/ui/NotificationToast';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { 
  BookOpenIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const LibrarianDashboard = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    borrowed: 0,
    pending: 0,
    returned: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt,desc',
    page: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [filters, searchQuery]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getAllBorrowings({
        ...filters,
        query: searchQuery
      });
      
      if (response.success) {
        const data = response.data || [];
        setBorrowings(data.content || data);
        
        // Calculate stats
        const statsData = {
          total: data.totalElements || data.length,
          borrowed: data.content?.filter(b => b.status === 'BORROWED').length || 0,
          pending: data.content?.filter(b => b.status === 'PENDING_LIBRARIAN').length || 0,
          returned: data.content?.filter(b => b.status === 'RETURNED').length || 0,
          overdue: data.content?.filter(b => {
            if (b.status === 'BORROWED' && b.dueDate) {
              return new Date(b.dueDate) < new Date();
            }
            return false;
          }).length || 0
        };
        setStats(statsData);
      } else {
        showNotification(response.message || 'Không thể tải dữ liệu', 'error');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showNotification('Không thể tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, borrowingId) => {
    try {
      let response;
      switch (action) {
        case 'confirm':
          response = await borrowingService.confirmBorrowing(borrowingId);
          break;
        case 'return':
          response = await borrowingService.returnBook(borrowingId);
          break;
        case 'cancel':
          response = await borrowingService.cancelReservation(borrowingId);
          break;
        case 'lost':
          response = await borrowingService.reportLost(borrowingId);
          break;
        default:
          return;
      }

      if (response.success) {
        const actionMessages = {
          confirm: 'Xác nhận mượn sách thành công',
          return: 'Trả sách thành công',
          cancel: 'Hủy đặt sách thành công',
          lost: 'Đã báo mất sách'
        };
        showNotification(actionMessages[action], 'success');
        loadDashboardData(); // Reload data immediately
      } else {
        showNotification(response.message || 'Thao tác thất bại', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Thao tác thất bại', 'error');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
  };

  const statsCards = [
    {
      title: 'Tổng số mượn',
      value: stats.total,
      icon: BookOpenIcon,
      color: 'blue',
      description: 'Tất cả giao dịch mượn trả'
    },
    {
      title: 'Đang mượn',
      value: stats.borrowed,
      icon: BookOpenIcon,
      color: 'green',
      description: 'Sách đang được mượn'
    },
    {
      title: 'Chờ xác nhận',
      value: stats.pending,
      icon: ExclamationTriangleIcon,
      color: 'amber',
      description: 'Yêu cầu chờ xác nhận'
    },
    {
      title: 'Quá hạn',
      value: stats.overdue,
      icon: ClockIcon,
      color: 'red',
      description: 'Sách quá hạn trả'
    }
  ];

  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="p-2 text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 dark:text-sage-100 flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                Dashboard Thủ thư
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Quản lý và theo dõi hoạt động mượn trả sách
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/librarian/borrowed" className="group">
              <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-700 dark:group-hover:bg-green-400 transition-colors duration-200">
                    <BookOpenIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                      Đang mượn
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      Xem sách đang mượn
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/librarian/pending" className="group">
              <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-600 dark:bg-amber-500 rounded-xl flex items-center justify-center group-hover:bg-amber-700 dark:group-hover:bg-amber-400 transition-colors duration-200">
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                      Chờ xác nhận
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      Xác nhận mượn sách
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/librarian/all" className="group">
              <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-700 dark:group-hover:bg-blue-400 transition-colors duration-200">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                      Tất cả
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      Xem tất cả giao dịch
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/librarian/search" className="group">
              <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-400 transition-colors duration-200">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                      Tìm kiếm
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      Tìm theo người dùng
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Borrowings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100">
              Giao dịch gần đây ({borrowings.length})
            </h2>
            <Link 
              href="/librarian/all"
              className="text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 text-sm font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          
          <FilterBar 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            filters={filters}
            searchQuery={searchQuery}
          />
        </div>

        {/* Borrowings List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 animate-pulse">
                <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded mb-4"></div>
                <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded mb-6"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded"></div>
                  <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : borrowings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {borrowings.slice(0, 6).map((borrowing) => (
              <BorrowingCard 
                key={borrowing.id} 
                borrowing={borrowing} 
                onAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-sage-400 dark:text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
              Không có giao dịch nào
            </h3>
            <p className="text-sage-600 dark:text-sage-400">
              Chưa có giao dịch mượn trả nào được thực hiện.
            </p>
          </div>
        )}
      </div>

      <NotificationToast 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />
    </>
  );
};

const LibrarianDashboardWithAuth = () => {
  return (
    <ProtectedRoute>
      <LibrarianDashboard />
    </ProtectedRoute>
  );
};

export default LibrarianDashboardWithAuth; 