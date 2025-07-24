'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../../services/borrowingService';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import { 
  BookOpenIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const BorrowingManagementPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    loadBorrowings();
  }, []);

  const loadBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getAllBorrowings();
      if (response.success) {
        setBorrowings(response.data || []);
      } else {
        showNotification(response.message || 'Không thể tải danh sách mượn sách', 'error');
      }
    } catch (error) {
      console.error('Error loading borrowings:', error);
      showNotification('Không thể tải danh sách mượn sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBorrowing = async (borrowingId) => {
    try {
      const response = await borrowingService.confirmBorrowing(borrowingId);
      if (response.success) {
        showNotification('Xác nhận mượn sách thành công', 'success');
        loadBorrowings();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleReturnBook = async (borrowingId) => {
    try {
      const response = await borrowingService.returnBook(borrowingId);
      if (response.success) {
        showNotification('Trả sách thành công', 'success');
        loadBorrowings();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleCancelReservation = async (borrowingId) => {
    try {
      const response = await borrowingService.cancelReservation(borrowingId);
      if (response.success) {
        showNotification('Hủy đặt sách thành công', 'success');
        loadBorrowings();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleReportLost = async (borrowingId) => {
    try {
      const response = await borrowingService.reportLost(borrowingId);
      if (response.success) {
        showNotification('Đã báo mất sách', 'success');
        loadBorrowings();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESERVED':
        return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case 'BORROWED':
        return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
      case 'RETURNED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'OVERDUE':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'LOST':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'RESERVED':
        return 'Đã đặt';
      case 'BORROWED':
        return 'Đang mượn';
      case 'RETURNED':
        return 'Đã trả';
      case 'OVERDUE':
        return 'Quá hạn';
      case 'LOST':
        return 'Mất sách';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESERVED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'BORROWED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'RETURNED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'LOST':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-1/3"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-sage-200 dark:bg-sage-700 rounded-xl"></div>
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
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/admin" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200 flex items-center">
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li className="text-sage-900 dark:text-sage-100 font-medium">
                Quản lý mượn sách
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100">
                  Quản lý mượn sách
                </h1>
                <p className="text-lg text-sage-600 dark:text-sage-400">
                  Theo dõi và quản lý tất cả hoạt động mượn sách
                </p>
              </div>
            </div>
          </div>

          {/* Borrowings List */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft">
            <div className="p-6 border-b border-sage-200 dark:border-sage-700">
              <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100">
                Danh sách mượn sách ({borrowings.length})
              </h2>
            </div>

            <div className="divide-y divide-sage-200 dark:divide-sage-700">
              {borrowings.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpenIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-2">
                    Chưa có hoạt động mượn sách
                  </h3>
                  <p className="text-sage-600 dark:text-sage-400">
                    Khi có người mượn sách, thông tin sẽ hiển thị ở đây
                  </p>
                </div>
              ) : (
                borrowings.map((borrowing) => (
                  <div key={borrowing.borrowingId} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          {getStatusIcon(borrowing.status)}
                          <div>
                            <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                              {borrowing.bookCopy.book.title}
                            </h3>
                            <p className="text-sage-600 dark:text-sage-400">
                              Tác giả: {borrowing.bookCopy.book.author}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500 dark:text-sage-400">Người mượn:</span>
                            <p className="text-sage-900 dark:text-sage-100 font-medium">
                              {borrowing.borrower.username} ({borrowing.borrower.email})
                            </p>
                          </div>
                          <div>
                            <span className="text-sage-500 dark:text-sage-400">QR Code:</span>
                            <p className="text-sage-900 dark:text-sage-100 font-mono">
                              {borrowing.bookCopy.qrCode}
                            </p>
                          </div>
                          <div>
                            <span className="text-sage-500 dark:text-sage-400">Ngày hẹn trả:</span>
                            <p className="text-sage-900 dark:text-sage-100">
                              {new Date(borrowing.dueDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(borrowing.status)}`}>
                          {getStatusText(borrowing.status)}
                        </span>
                        
                        <div className="flex space-x-2">
                          {borrowing.status === 'RESERVED' && (
                            <>
                              <ActionButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleConfirmBorrowing(borrowing.borrowingId)}
                              >
                                Xác nhận
                              </ActionButton>
                              <ActionButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelReservation(borrowing.borrowingId)}
                              >
                                Hủy
                              </ActionButton>
                            </>
                          )}
                          
                          {borrowing.status === 'BORROWED' && (
                            <>
                              <ActionButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleReturnBook(borrowing.borrowingId)}
                              >
                                Trả sách
                              </ActionButton>
                              <ActionButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleReportLost(borrowing.borrowingId)}
                              >
                                Báo mất
                              </ActionButton>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
  );
};

export default BorrowingManagementPage; 