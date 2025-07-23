'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBook } from '../../../hooks/useBooksApi';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import { 
  BookOpenIcon, 
  ArrowLeftIcon,
  ChevronRightIcon,
  BookmarkIcon,
  PencilIcon,
  ClockIcon,
  MapPinIcon,
  QrCodeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { book, loading, error, loadBook } = useBook(params.id);
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const handleBorrowBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Vui lòng đăng nhập để mượn sách', 'warning');
        router.push('/login');
        return;
      }

      const availableCopies = book.bookCopies?.filter(copy => copy.status === 'AVAILABLE') || [];
      if (availableCopies.length === 0) {
        showNotification('Sách này hiện không có bản sẵn', 'warning');
        return;
      }

      showNotification('Tính năng mượn sách đang được phát triển', 'info');
      
    } catch (error) {
      showNotification('Có lỗi xảy ra khi mượn sách', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'BORROWED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Có sẵn';
      case 'BORROWED':
        return 'Đã mượn';
      case 'RESERVED':
        return 'Đã đặt';
      case 'MAINTENANCE':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
            Không tìm thấy sách
          </h2>
          <p className="text-sage-600 dark:text-sage-400 mb-6">
            {error || 'Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}
          </p>
          <div className="flex gap-3 justify-center">
            <ActionButton onClick={() => router.push('/books')}>
              Quay lại danh sách
            </ActionButton>
            <ActionButton variant="outline" onClick={() => router.push('/')}>
              Về trang chủ
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  const availableCopies = book.bookCopies?.filter(copy => copy.status === 'AVAILABLE') || [];
  const totalCopies = book.bookCopies?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200 flex items-center">
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li>
                <Link href="/books" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Sách
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li className="text-sage-900 dark:text-sage-100 font-medium">
                {book.title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
                {/* Book Header */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-24 h-24 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="w-12 h-12 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-3">
                        {book.title}
                      </h1>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-lg text-sage-600 dark:text-sage-400 flex items-center">
                          <UserIcon className="w-5 h-5 mr-2" />
                          <span className="font-medium text-sage-900 dark:text-sage-100">{book.author || 'N/A'}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(availableCopies.length > 0 ? 'AVAILABLE' : 'BORROWED')}`}>
                          {availableCopies.length > 0 ? 'Có sẵn' : 'Hết sách'}
                        </span>
                      </div>
                      <p className="text-sage-600 dark:text-sage-400">
                        {availableCopies.length} trong số {totalCopies} bản có sẵn để mượn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                        <BookOpenIcon className="w-4 h-4 mr-2" />
                        Nhà xuất bản
                      </label>
                      <p className="text-sage-900 dark:text-sage-100">{book.publisher || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Năm xuất bản
                      </label>
                      <p className="text-sage-900 dark:text-sage-100">{book.publicationYear || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                        <QrCodeIcon className="w-4 h-4 mr-2" />
                        ISBN
                      </label>
                      <p className="text-sage-900 dark:text-sage-100 font-mono">{book.isbn || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Danh mục</label>
                      <p className="text-sage-900 dark:text-sage-100">
                        {book.category?.name || 'Chưa phân loại'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Ngày thêm
                      </label>
                      <p className="text-sage-900 dark:text-sage-100">
                        {book.createdAt ? new Date(book.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Cập nhật lần cuối
                      </label>
                      <p className="text-sage-900 dark:text-sage-100">
                        {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-3">
                      Mô tả
                    </h3>
                    <p className="text-sage-700 dark:text-sage-300 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Book Copies */}
                <div>
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Các bản sách ({totalCopies})
                  </h3>
                  <div className="space-y-3">
                    {book.bookCopies?.map((copy, index) => (
                      <div key={index} className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                              <QrCodeIcon className="w-4 h-4 mr-2" />
                              QR Code
                            </label>
                            <p className="text-sage-900 dark:text-sage-100 font-mono text-sm">{copy.qrCode}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(copy.status)}`}>
                              {getStatusText(copy.status)}
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-2" />
                              Vị trí
                            </label>
                            <p className="text-sage-900 dark:text-sage-100">{copy.shelfLocation || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-sage-700 dark:text-sage-300 flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Ngày tạo
                            </label>
                            <p className="text-sage-900 dark:text-sage-100 text-sm">
                              {copy.createdAt ? new Date(copy.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Actions Card */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thao tác
                </h3>
                <div className="space-y-3">
                  <ActionButton
                    variant="primary"
                    size="lg"
                    onClick={handleBorrowBook}
                    disabled={availableCopies.length === 0}
                    className="w-full group"
                  >
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    {availableCopies.length > 0 ? 'Mượn sách' : 'Hết sách'}
                  </ActionButton>
                  
                  <ActionButton
                    variant="outline"
                    size="lg"
                    onClick={() => router.push(`/admin/books/${book.id}/edit`)}
                    className="w-full group"
                  >
                    <PencilIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                    Chỉnh sửa
                  </ActionButton>
                  
                  <ActionButton
                    variant="outline"
                    size="lg"
                    onClick={() => router.push(`/books/${book.id}/history`)}
                    className="w-full group"
                  >
                    <ClockIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                    Lịch sử mượn
                  </ActionButton>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thống kê nhanh
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                    <span className="text-sage-600 dark:text-sage-400">Tổng số bản</span>
                    <span className="font-semibold text-sage-900 dark:text-sage-100">{totalCopies}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                    <span className="text-emerald-600 dark:text-emerald-400">Có sẵn</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{availableCopies.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                    <span className="text-amber-600 dark:text-amber-400">Đã mượn</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {book.bookCopies?.filter(copy => copy.status === 'BORROWED').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                    <span className="text-red-600 dark:text-red-400">Bảo trì</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {book.bookCopies?.filter(copy => copy.status === 'MAINTENANCE').length || 0}
                    </span>
                  </div>
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

export default BookDetailsPage; 