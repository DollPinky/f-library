'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../../services/borrowingService';
import BorrowingCard from '../../../components/ui/BorrowingCard';
import NotificationToast from '../../../components/ui/NotificationToast';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { 
  MagnifyingGlassIcon, 
  ArrowLeftIcon,
  UserIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const SearchPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // all, user, book

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showNotification('Vui lòng nhập từ khóa tìm kiếm', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await borrowingService.getAllBorrowings({
        query: searchQuery,
        page: 0,
        size: 50
      });
      
      if (response.success) {
        const data = response.data || {};
        setBorrowings(data.content || []);
        
        if ((data.content || []).length === 0) {
          showNotification('Không tìm thấy kết quả nào', 'info');
        }
      } else {
        showNotification(response.message || 'Không thể tìm kiếm', 'error');
      }
    } catch (error) {
      console.error('Error searching borrowings:', error);
      showNotification('Không thể thực hiện tìm kiếm', 'error');
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
        handleSearch(); // Reload search results
      } else {
        showNotification(response.message || 'Thao tác thất bại', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Thao tác thất bại', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'user':
        return 'Tìm theo tên, email người mượn...';
      case 'book':
        return 'Tìm theo tên sách, tác giả...';
      default:
        return 'Tìm kiếm theo tên sách, tác giả, người mượn...';
    }
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
                <MagnifyingGlassIcon className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                Tìm kiếm
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Tìm kiếm giao dịch mượn trả sách
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
          <div className="space-y-4">
            {/* Search Type */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Loại tìm kiếm
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="all"
                    checked={searchType === 'all'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 focus:ring-sage-500 dark:focus:ring-sage-600 dark:ring-offset-sage-800 focus:ring-2 dark:bg-sage-700 dark:border-sage-600"
                  />
                  <span className="ml-2 text-sm text-sage-700 dark:text-sage-300">Tất cả</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="user"
                    checked={searchType === 'user'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 focus:ring-sage-500 dark:focus:ring-sage-600 dark:ring-offset-sage-800 focus:ring-2 dark:bg-sage-700 dark:border-sage-600"
                  />
                  <span className="ml-2 text-sm text-sage-700 dark:text-sage-300">Theo người mượn</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="book"
                    checked={searchType === 'book'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 focus:ring-sage-500 dark:focus:ring-sage-600 dark:ring-offset-sage-800 focus:ring-2 dark:bg-sage-700 dark:border-sage-600"
                  />
                  <span className="ml-2 text-sm text-sage-700 dark:text-sage-300">Theo sách</span>
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {borrowings.length > 0 && (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100">
                  Kết quả tìm kiếm ({borrowings.length} giao dịch)
                </h2>
                <div className="text-sm text-sage-600 dark:text-sage-400">
                  Từ khóa: "{searchQuery}"
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
            </div>

            {/* Borrowings List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {borrowings.map((borrowing) => (
                <BorrowingCard 
                  key={borrowing.id} 
                  borrowing={borrowing} 
                  onAction={handleAction}
                />
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && searchQuery && borrowings.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-sage-400 dark:text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-sage-600 dark:text-sage-400 mb-4">
              Không tìm thấy giao dịch nào phù hợp với từ khóa "{searchQuery}"
            </p>
            <div className="text-sm text-sage-500 dark:text-sage-400">
              <p>Gợi ý:</p>
              <ul className="mt-2 space-y-1">
                <li>• Kiểm tra lại chính tả</li>
                <li>• Thử từ khóa khác</li>
                <li>• Tìm kiếm với từ khóa ngắn hơn</li>
              </ul>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
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

const SearchPageWithAuth = () => {
  return (
    <ProtectedRoute>
      <SearchPage />
    </ProtectedRoute>
  );
};

export default SearchPageWithAuth; 