'use client';

import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  QrCodeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { AnimatedCard } from './AnimatedContainer';

const BorrowingCard = ({ borrowing, onAction }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'RESERVED':
        return {
          icon: ClockIcon,
          text: 'Đã đặt',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
          borderColor: 'border-amber-200 dark:border-amber-700'
        };
      case 'PENDING_LIBRARIAN':
        return {
          icon: ExclamationTriangleIcon,
          text: 'Chờ xác nhận',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-700'
        };
      case 'BORROWED':
        return {
          icon: BookOpenIcon,
          text: 'Đang mượn',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-700'
        };
      case 'PENDING_RETURN':
        return {
          icon: ExclamationTriangleIcon,
          text: 'Chờ trả',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          borderColor: 'border-purple-200 dark:border-purple-700'
        };
      case 'RETURNED':
        return {
          icon: CheckCircleIcon,
          text: 'Đã trả',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
      case 'OVERDUE':
        return {
          icon: ExclamationTriangleIcon,
          text: 'Quá hạn',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-700'
        };
      case 'LOST':
        return {
          icon: XCircleIcon,
          text: 'Đã mất',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-700'
        };
      case 'CANCELLED':
        return {
          icon: XCircleIcon,
          text: 'Đã hủy',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
      default:
        return {
          icon: ClockIcon,
          text: status,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  const statusConfig = getStatusConfig(borrowing.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getActionButtons = () => {
    // Sử dụng borrowingId hoặc id tùy theo response từ API
    const borrowingId = borrowing.borrowingId || borrowing.id;
    
    switch (borrowing.status) {
      case 'PENDING_LIBRARIAN':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('confirm', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Xác nhận
            </button>
            <button
              onClick={() => handleAction('cancel', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Từ chối
            </button>
          </div>
        );
      case 'BORROWED':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('return', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Trả sách
            </button>
            <button
              onClick={() => handleAction('lost', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Báo mất
            </button>
          </div>
        );
      case 'RESERVED':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('confirm', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Xác nhận
            </button>
            <button
              onClick={() => handleAction('cancel', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Hủy
            </button>
          </div>
        );
      case 'PENDING_RETURN':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('return', borrowingId)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isActionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Xác nhận trả
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleAction = async (action, borrowingId) => {
    setIsActionLoading(true);
    try {
      await onAction(action, borrowingId);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <AnimatedCard className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-sage-200 dark:border-sage-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-1">
              {borrowing.bookCopy?.book?.title}
            </h3>
            <p className="text-sm text-sage-600 dark:text-sage-400">
              Tác giả: {borrowing.bookCopy?.book?.author}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.color} ${statusConfig.borderColor} border`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{statusConfig.text}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="bg-sage-50 dark:bg-sage-800 rounded-xl p-4 border border-sage-200 dark:border-sage-700">
              <div className="flex items-center gap-2 mb-3">
                <QrCodeIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="text-sm font-medium text-sage-700 dark:text-sage-300">Mã QR</span>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-sage-200 dark:border-sage-600">
                <div className="w-full h-24 bg-sage-100 dark:bg-sage-700 rounded-lg flex items-center justify-center">
                  <QrCodeIcon className="w-8 h-8 text-sage-400 dark:text-sage-500" />
                </div>
                <p className="text-xs text-sage-600 dark:text-sage-400 mt-2 text-center font-mono">
                  {borrowing.bookCopy?.qrCode}
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Borrower Info */}
            <div className="flex items-center gap-3 p-3 bg-sage-50 dark:bg-sage-800 rounded-xl">
              <div className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sage-900 dark:text-sage-100">
                  {borrowing.borrower?.fullName}
                </p>
                <p className="text-sm text-sage-600 dark:text-sage-400">
                  {borrowing.borrower?.email}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-sage-50 dark:bg-sage-800 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <div>
                  <p className="text-sm text-sage-600 dark:text-sage-400">Ngày hẹn trả</p>
                  <p className="font-medium text-sage-900 dark:text-sage-100">
                    {formatDate(borrowing.dueDate)}
                  </p>
                </div>
              </div>
              
              {borrowing.returnDate && (
                <div className="flex items-center gap-2 p-3 bg-sage-50 dark:bg-sage-800 rounded-xl">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-sage-600 dark:text-sage-400">Ngày trả</p>
                    <p className="font-medium text-sage-900 dark:text-sage-100">
                      {formatDate(borrowing.returnDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {getActionButtons() && (
              <div className="pt-2">
                {getActionButtons()}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default BorrowingCard; 