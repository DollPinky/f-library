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
  BookOpenIcon, 
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const BorrowedPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showSuccess, showError, removeNotification } = useNotifications();
  const [filters, setFilters] = useState({
    status: 'BORROWED',
    sortBy: 'dueDate,asc',
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
        const borrowedItems = (data.content || data).filter(item => item.status === 'BORROWED');
        setBorrowings(borrowedItems);
      } else {
        showError(response.message || 'Không thể tải danh sách');
      }
    } catch (error) {
      console.error('Error loading borrowings:', error);
      showError('Không thể tải danh sách sách đang mượn');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, borrowingId) => {
    if (!borrowingId) {
      showError('ID mượn sách không hợp lệ');
      return;
    }

    try {
      let response;
      switch (action) {
        case 'return':
          response = await borrowingService.librarianConfirmReturn(borrowingId);
          break;
        case 'lost':
          response = await borrowingService.reportLost(borrowingId);
          break;
        default:
          return;
      }

      if (response.success) {
        const actionMessages = {
          return: 'Trả sách thành công',
          lost: 'Đã báo mất sách'
        };
        showSuccess(actionMessages[action]);
        loadBorrowings(); // Reload data immediately
      } else {
        showError(response.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error('Action error:', error);
      showError(error.message || 'Thao tác thất bại');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, status: 'BORROWED' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };



  const overdueCount = borrowings.filter(b => {
    if (b.status === 'BORROWED' && b.dueDate) {
      return new Date(b.dueDate) < new Date();
    }
    return false;
  }).length;

  return (
    <PageTransition>
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
                <BookOpenIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                Sách đang mượn
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Quản lý sách đang được mượn ({borrowings.length} cuốn)
                {overdueCount > 0 && (
                  <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                    • {overdueCount} cuốn quá hạn
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Warning for overdue books */}
        {overdueCount > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Có {overdueCount} cuốn sách quá hạn trả
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Vui lòng liên hệ với người mượn để thu hồi sách
                </p>
              </div>
            </div>
          </div>
        )}

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
              <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <AnimatedSkeleton lines={4} />
              </div>
            ))}
          </div>
        ) : borrowings.length > 0 ? (
          <StaggeredList className="grid grid-cols-1 lg:grid-cols-2 gap-6" stagger={100}>
            {borrowings.map((borrowing) => (
              <BorrowingCard 
                key={borrowing.borrowingId || borrowing.id} 
                borrowing={borrowing} 
                onAction={handleAction}
              />
            ))}
          </StaggeredList>
        ) : (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-sage-400 dark:text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
              Không có sách đang mượn
            </h3>
            <p className="text-sage-600 dark:text-sage-400">
              Hiện tại không có sách nào đang được mượn.
            </p>
          </div>
        )}
      </div>

      <NotificationContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </PageTransition>
  );
};

const BorrowedPageWithAuth = () => {
  return (
    <ProtectedRoute>
      <BorrowedPage />
    </ProtectedRoute>
  );
};

export default BorrowedPageWithAuth; 