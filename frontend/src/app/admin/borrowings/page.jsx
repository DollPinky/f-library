'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../../services/borrowingService';
import BorrowingCard from '../../../components/ui/BorrowingCard';
import FilterBar from '../../../components/ui/FilterBar';
import NotificationToast from '../../../components/ui/NotificationToast';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { 
  BookOpenIcon, 
  ArrowLeftIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminBorrowingsPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt,desc',
    page: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBorrowings();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadBorrowings, 30000);
    return () => clearInterval(interval);
  }, [filters, searchQuery]);

  const loadBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getAllBorrowings({
        ...filters,
        query: searchQuery
      });
      
      if (response.success) {
        const data = response.data || [];
        setBorrowings(data.content || data);
      } else {
        showNotification(response.message || 'Không thể tải danh sách', 'error');
      }
    } catch (error) {
      console.error('Error loading borrowings:', error);
      showNotification('Không thể tải danh sách mượn sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, borrowingId) => {
    if (!borrowingId) {
      showNotification('ID mượn sách không hợp lệ', 'error');
      return;
    }

    try {
      let response;
      switch (action) {
        case 'confirm':
          response = await borrowingService.confirmBorrowing(borrowingId);
          break;
        case 'return':
          response = await borrowingService.returnBook(borrowingId);
          break;
        case 'lost':
          response = await borrowingService.reportLost(borrowingId);
          break;
        case 'cancel':
          response = await borrowingService.cancelReservation(borrowingId);
          break;
        default:
          return;
      }

      if (response.success) {
        const actionMessages = {
          confirm: 'Xác nhận mượn sách thành công',
          return: 'Trả sách thành công',
          lost: 'Đã báo mất sách',
          cancel: 'Hủy đặt sách thành công'
        };
        showNotification(actionMessages[action], 'success');
        loadBorrowings(); // Reload data immediately
      } else {
        showNotification(response.message || 'Thao tác thất bại', 'error');
      }
    } catch (error) {
      console.error('Action error:', error);
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

  const getStatusCounts = () => {
    const counts = {
      PENDING_LIBRARIAN: 0,
      BORROWED: 0,
      RETURNED: 0,
      OVERDUE: 0,
      LOST: 0
    };
    
    borrowings.forEach(borrowing => {
      if (counts.hasOwnProperty(borrowing.status)) {
        counts[borrowing.status]++;
      }
    });
    
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
              href="/admin" 
              className="p-2 text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 dark:text-sage-100 flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                Quản lý mượn sách
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Tổng quan tất cả hoạt động mượn sách ({borrowings.length} bản ghi)
              </p>
            </div>
            <Link href="/admin/borrowings/create">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200">
                <PlusIcon className="w-5 h-5" />
                Tạo mới
              </button>
            </Link>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.PENDING_LIBRARIAN}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Chờ xác nhận</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.BORROWED}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Đang mượn</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{statusCounts.RETURNED}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Đã trả</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.OVERDUE}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Quá hạn</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statusCounts.LOST}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300">Mất sách</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {borrowings.map((borrowing) => (
              <BorrowingCard 
                key={borrowing.borrowingId || borrowing.id} 
                borrowing={borrowing} 
                onAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-sage-400 dark:text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
              Không có dữ liệu mượn sách
            </h3>
            <p className="text-sage-600 dark:text-sage-400">
              Hiện tại không có bản ghi mượn sách nào.
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

const AdminBorrowingsPageWithAuth = () => {
  return (
    <ProtectedRoute>
      <AdminBorrowingsPage />
    </ProtectedRoute>
  );
};

export default AdminBorrowingsPageWithAuth; 