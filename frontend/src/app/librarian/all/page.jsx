'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../../services/borrowingService';
import BorrowingCard from '../../../components/ui/BorrowingCard';
import FilterBar from '../../../components/ui/FilterBar';
import { NotificationContainer } from '../../../components/ui/NotificationToast';
import { useNotifications } from '../../../hooks/useNotifications';
import { PageTransition, StaggeredList, AnimatedSkeleton } from '../../../components/ui/AnimatedContainer';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { 
  DocumentTextIcon, 
  ArrowLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AllBorrowingsPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showSuccess, showError, removeNotification } = useNotifications();
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt,desc',
    page: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12
  });

  useEffect(() => {
    loadBorrowings();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadBorrowings, 30000);
    return () => clearInterval(interval);
  }, [filters, searchQuery, pagination.currentPage]);

  const loadBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getAllBorrowings({
        ...filters,
        query: searchQuery,
        page: pagination.currentPage,
        size: pagination.size
      });
      
      if (response.success) {
        const data = response.data || {};
        setBorrowings(data.content || []);
        setPagination({
          currentPage: data.number || 0,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          size: data.size || 12
        });
      } else {
        showError(response.message || 'Không thể tải danh sách');
      }
    } catch (error) {
      console.error('Error loading borrowings:', error);
      showError('Không thể tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, borrowingId) => {
    try {
      let response;
      switch (action) {
        case 'confirm':
          response = await borrowingService.librarianConfirmBorrowing(borrowingId);
          break;
        case 'return':
          response = await borrowingService.librarianConfirmReturn(borrowingId);
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
        showSuccess(actionMessages[action]);
        loadBorrowings(); // Reload data immediately
      } else {
        showError(response.message || 'Thao tác thất bại');
      }
    } catch (error) {
      showError(error.message || 'Thao tác thất bại');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };



  const getStatusCounts = () => {
    const counts = {
      total: borrowings.length,
      borrowed: borrowings.filter(b => b.status === 'BORROWED').length,
      pending: borrowings.filter(b => b.status === 'PENDING_LIBRARIAN').length,
      returned: borrowings.filter(b => b.status === 'RETURNED').length,
      reserved: borrowings.filter(b => b.status === 'RESERVED').length,
      lost: borrowings.filter(b => b.status === 'LOST').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/librarian" 
              className="p-2 text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 dark:text-sage-100 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Tất cả giao dịch
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Xem toàn bộ giao dịch mượn trả sách ({pagination.totalElements} giao dịch)
              </p>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-sage-200 dark:border-sage-700 p-4 text-center">
            <div className="text-2xl font-bold text-sage-900 dark:text-sage-100">{statusCounts.total}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Tổng cộng</div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-green-200 dark:border-green-700 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.borrowed}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Đang mượn</div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-amber-200 dark:border-amber-700 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statusCounts.pending}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Chờ xác nhận</div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-blue-200 dark:border-blue-700 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.returned}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Đã trả</div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-purple-200 dark:border-purple-700 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{statusCounts.reserved}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Đã đặt</div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-red-200 dark:border-red-700 p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.lost}</div>
            <div className="text-sm text-sage-600 dark:text-sage-400">Đã mất</div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          filters={filters}
          searchQuery={searchQuery}
        />

        {/* Borrowings List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {borrowings.map((borrowing) => (
                <BorrowingCard 
                  key={borrowing.id} 
                  borrowing={borrowing} 
                  onAction={handleAction}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 p-4">
                <div className="text-sm text-sage-600 dark:text-sage-400">
                  Hiển thị {pagination.currentPage * pagination.size + 1} - {Math.min((pagination.currentPage + 1) * pagination.size, pagination.totalElements)} trong tổng số {pagination.totalElements} giao dịch
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="px-3 py-2 text-sm font-medium text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index;
                      const isCurrent = page === pagination.currentPage;
                      const isNearCurrent = Math.abs(page - pagination.currentPage) <= 1;
                      const isFirst = page === 0;
                      const isLast = page === pagination.totalPages - 1;
                      
                      if (isCurrent || isNearCurrent || isFirst || isLast) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              isCurrent
                                ? 'bg-sage-600 text-white'
                                : 'text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100'
                            }`}
                          >
                            {page + 1}
                          </button>
                        );
                      } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                        return <span key={page} className="px-2 text-sage-400">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages - 1}
                    className="px-3 py-2 text-sm font-medium text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-sage-400 dark:text-sage-600 mx-auto mb-4" />
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

const AllBorrowingsPageWithAuth = () => {
  return (
    <ProtectedRoute>
      <AllBorrowingsPage />
    </ProtectedRoute>
  );
};

export default AllBorrowingsPageWithAuth; 