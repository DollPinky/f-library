'use client';

import React, { useState, useEffect } from 'react';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import borrowingService from '../../services/borrowingService';
import ActionButton from '../../components/ui/ActionButton';
import NotificationToast from '../../components/ui/NotificationToast';
import { 
  UserIcon, 
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useAccountAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    if (user) {
      loadUserBorrowings();
    }
  }, [user]);

  const loadUserBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getUserBorrowings(user.accountId);
      if (response.success) {
        setBorrowings(response.data || []);
      }
    } catch (error) {
      console.error('Error loading user borrowings:', error);
      showNotification('Không thể tải danh sách sách đã mượn', 'error');
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-sage-600 dark:text-sage-400">
            Bạn cần đăng nhập để xem thông tin cá nhân
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-lg text-sage-600 dark:text-sage-400">
                  Thông tin tài khoản và sách đã mượn
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin cá nhân
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Họ và tên</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium">{user.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Email</label>
                    <p className="text-sage-900 dark:text-sage-100">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Số điện thoại</label>
                    <p className="text-sage-900 dark:text-sage-100">{user.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Phòng ban</label>
                    <p className="text-sage-900 dark:text-sage-100">{user.department || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Chức vụ</label>
                    <p className="text-sage-900 dark:text-sage-100">{user.position || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Mã nhân viên</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono">{user.employeeCode}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Vai trò</label>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : user.role === 'LIBRARIAN'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role === 'ADMIN' ? 'Quản trị viên' : 
                       user.role === 'LIBRARIAN' ? 'Thủ thư' : 'Độc giả'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrowed Books */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft">
                <div className="p-6 border-b border-sage-200 dark:border-sage-700">
                  <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100">
                    Sách đã mượn ({borrowings.length})
                  </h2>
                </div>

                <div className="divide-y divide-sage-200 dark:divide-sage-700">
                  {loading ? (
                    <div className="p-6">
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-sage-200 dark:bg-sage-700 rounded-xl"></div>
                        ))}
                      </div>
                    </div>
                  ) : borrowings.length === 0 ? (
                    <div className="p-8 text-center">
                      <BookOpenIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-2">
                        Chưa có sách nào được mượn
                      </h3>
                      <p className="text-sage-600 dark:text-sage-400">
                        Hãy khám phá thư viện và mượn sách để bắt đầu
                      </p>
                    </div>
                  ) : (
                    borrowings.map((borrowing) => (
                      <div key={borrowing.borrowingId} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              {getStatusIcon(borrowing.status)}
                              <div>
                                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                                  {borrowing.bookCopy?.book?.title}
                                </h3>
                                <p className="text-sage-600 dark:text-sage-400">
                                  Tác giả: {borrowing.bookCopy?.book?.author}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-sage-500 dark:text-sage-400">QR Code:</span>
                                <p className="text-sage-900 dark:text-sage-100 font-mono">
                                  {borrowing.bookCopy?.qrCode}
                                </p>
                              </div>
                              <div>
                                <span className="text-sage-500 dark:text-sage-400">Ngày mượn:</span>
                                <p className="text-sage-900 dark:text-sage-100">
                                  {borrowing.borrowedDate ? new Date(borrowing.borrowedDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-sage-500 dark:text-sage-400">Hạn trả:</span>
                                <p className="text-sage-900 dark:text-sage-100">
                                  {borrowing.dueDate ? new Date(borrowing.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                              </div>
                              {borrowing.fineAmount > 0 && (
                                <div>
                                  <span className="text-sage-500 dark:text-sage-400">Phí phạt:</span>
                                  <p className="text-red-600 dark:text-red-400 font-medium">
                                    {borrowing.fineAmount.toLocaleString('vi-VN')} VND
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(borrowing.status)}`}>
                              {getStatusText(borrowing.status)}
                            </span>
                            
                            {borrowing.isOverdue && (
                              <span className="text-xs text-red-600 dark:text-red-400">
                                Quá hạn {borrowing.overdueDays} ngày
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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

export default ProfilePage; 