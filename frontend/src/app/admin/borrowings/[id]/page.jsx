'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

const BorrowingDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);

  useEffect(() => {
    fetchBorrowingDetails();
  }, [params.id]);

  const fetchBorrowingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/borrowings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setBorrowing(data.data);
      } else {
        showNotification(data.message || 'Không thể tải thông tin mượn sách', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải thông tin mượn sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/borrowings/${params.id}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          returnedAt: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Trả sách thành công!', 'success');
        setShowReturnModal(false);
        fetchBorrowingDetails();
      } else {
        showNotification(data.message || 'Không thể trả sách', 'error');
      }
    } catch (error) {
      showNotification('Không thể trả sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessFine = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/borrowings/${params.id}/fine`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fineAmount: fineAmount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Xử lý tiền phạt thành công!', 'success');
        setShowFineModal(false);
        fetchBorrowingDetails();
      } else {
        showNotification(data.message || 'Không thể xử lý tiền phạt', 'error');
      }
    } catch (error) {
      showNotification('Không thể xử lý tiền phạt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BORROWED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'RETURNED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'BORROWED':
        return 'Đang mượn';
      case 'RETURNED':
        return 'Đã trả';
      case 'OVERDUE':
        return 'Quá hạn';
      default:
        return 'Không xác định';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const calculateOverdueDays = (dueDate) => {
    if (!isOverdue(dueDate)) return 0;
    return Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
  };

  const calculateFine = (dueDate) => {
    const overdueDays = calculateOverdueDays(dueDate);
    return overdueDays * 10000;
  };

  if (loading && !borrowing) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin mượn sách...</p>
        </div>
      </div>
    );
  }

  if (!borrowing) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Không tìm thấy thông tin mượn sách
          </div>
          <ActionButton onClick={() => router.push('/admin/borrowings')}>
            Quay lại danh sách
          </ActionButton>
        </div>
      </div>
    );
  }

  const overdueDays = calculateOverdueDays(borrowing.dueDate);
  const calculatedFine = calculateFine(borrowing.dueDate);

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="p-2 bg-sage-100 dark:bg-sage-800 rounded-xl mr-3">
                    <svg className="w-6 h-6 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-xl font-serif font-bold text-sage-900 dark:text-sage-100">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link href="/admin">
                <ActionButton variant="outline" size="sm">
                  Dashboard
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/admin" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Admin
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/admin/borrowings" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Mượn trả sách
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                Chi tiết mượn sách
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Chi tiết mượn sách
                </h1>
                <p className="text-sage-600 dark:text-sage-400">
                  ID: {borrowing.borrowId}
                </p>
              </div>
              
              <div className="flex space-x-3">
                {borrowing.status === 'BORROWED' && (
                  <ActionButton
                    variant="success"
                    onClick={() => setShowReturnModal(true)}
                  >
                    Trả sách
                  </ActionButton>
                )}
                {borrowing.status === 'OVERDUE' && (
                  <ActionButton
                    variant="warning"
                    onClick={() => {
                      setFineAmount(calculatedFine);
                      setShowFineModal(true);
                    }}
                  >
                    Xử lý phạt
                  </ActionButton>
                )}
                <Link href="/admin/borrowings">
                  <ActionButton variant="outline">
                    Quay lại danh sách
                  </ActionButton>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-xl ${getStatusColor(borrowing.status)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Trạng thái: {getStatusText(borrowing.status)}</h3>
                      {borrowing.status === 'OVERDUE' && (
                        <p className="text-sm mt-1">Quá hạn {overdueDays} ngày</p>
                      )}
                    </div>
                    {borrowing.status === 'OVERDUE' && (
                      <div className="text-right">
                        <div className="text-lg font-bold">Tiền phạt: {calculatedFine.toLocaleString('vi-VN')} VNĐ</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin sách
                  </h3>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin cơ bản</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Tên sách:</span> <span className="font-medium">{borrowing.bookCopy?.book?.title}</span></p>
                          <p><span className="text-sage-600 dark:text-sage-400">Tác giả:</span> {borrowing.bookCopy?.book?.author}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Nhà xuất bản:</span> {borrowing.bookCopy?.book?.publisher}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Năm xuất bản:</span> {borrowing.bookCopy?.book?.year}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">ISBN:</span> {borrowing.bookCopy?.book?.isbn}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin bản sách</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">QR Code:</span> <span className="font-mono">{borrowing.bookCopy?.qrCode}</span></p>
                          <p><span className="text-sage-600 dark:text-sage-400">Thư viện:</span> {borrowing.bookCopy?.library?.name}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Vị trí kệ:</span> {borrowing.bookCopy?.shelfLocation}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Trạng thái:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                              borrowing.bookCopy?.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            }`}>
                              {borrowing.bookCopy?.status === 'AVAILABLE' ? 'Có sẵn' : 'Đã mượn'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reader Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin độc giả
                  </h3>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin cá nhân</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Họ tên:</span> <span className="font-medium">{borrowing.reader?.name}</span></p>
                          <p><span className="text-sage-600 dark:text-sage-400">MSSV:</span> {borrowing.reader?.studentId}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Email:</span> {borrowing.reader?.email}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Số điện thoại:</span> {borrowing.reader?.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin học tập</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Khoa:</span> {borrowing.reader?.faculty}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Ngành:</span> {borrowing.reader?.major}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Năm học:</span> {borrowing.reader?.year}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Cơ sở:</span> {borrowing.reader?.campus?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Borrowing Timeline */}
                <div>
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Lịch sử mượn sách
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-emerald-900 dark:text-emerald-100">Mượn sách</div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          {new Date(borrowing.borrowedAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-amber-900 dark:text-amber-100">Hạn trả</div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">
                          {new Date(borrowing.dueDate).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    
                    {borrowing.returnedAt && (
                      <div className="flex items-center space-x-4 p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700">
                        <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sage-900 dark:text-sage-100">Trả sách</div>
                          <div className="text-sm text-sage-600 dark:text-sage-400">
                            {new Date(borrowing.returnedAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thao tác nhanh
                </h3>
                <div className="space-y-3">
                  {borrowing.status === 'BORROWED' && (
                    <ActionButton
                      variant="success"
                      size="lg"
                      onClick={() => setShowReturnModal(true)}
                      className="w-full"
                    >
                      Trả sách
                    </ActionButton>
                  )}
                  
                  {borrowing.status === 'OVERDUE' && (
                    <ActionButton
                      variant="warning"
                      size="lg"
                      onClick={() => {
                        setFineAmount(calculatedFine);
                        setShowFineModal(true);
                      }}
                      className="w-full"
                    >
                      Xử lý phạt
                    </ActionButton>
                  )}
                  
                  <Link href={`/admin/books/${borrowing.bookCopy?.book?.bookId}`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Xem chi tiết sách
                    </ActionButton>
                  </Link>
                  
                  <Link href={`/admin/readers/${borrowing.reader?.readerId}`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Xem chi tiết độc giả
                    </ActionButton>
                  </Link>
                </div>
              </div>

              {/* Fine Information */}
              {borrowing.fineAmount > 0 && (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                  <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin tiền phạt
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {borrowing.fineAmount.toLocaleString('vi-VN')} VNĐ
                      </div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">
                        Tiền phạt hiện tại
                      </div>
                    </div>
                    
                    {borrowing.status === 'OVERDUE' && (
                      <div className="text-center">
                        <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
                          {calculatedFine.toLocaleString('vi-VN')} VNĐ
                        </div>
                        <div className="text-sm text-sage-600 dark:text-sage-400">
                          Tiền phạt tính toán
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Return Confirmation Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Xác nhận trả sách
            </h3>
            <div className="mb-6 space-y-3">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Sách:</strong> {borrowing?.bookCopy?.book?.title}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Độc giả:</strong> {borrowing?.reader?.name}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Ngày mượn:</strong> {new Date(borrowing?.borrowedAt).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Hạn trả:</strong> {new Date(borrowing?.dueDate).toLocaleDateString('vi-VN')}
              </p>
              {isOverdue(borrowing?.dueDate) && (
                <p className="text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Sách đã quá hạn! Cần xử lý tiền phạt.
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <ActionButton
                variant="success"
                onClick={handleReturnBook}
                loading={loading}
              >
                Xác nhận trả sách
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setShowReturnModal(false)}
              >
                Hủy
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Fine Processing Modal */}
      {showFineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Xử lý tiền phạt
            </h3>
            <div className="mb-6 space-y-4">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Sách:</strong> {borrowing?.bookCopy?.book?.title}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Độc giả:</strong> {borrowing?.reader?.name}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Quá hạn:</strong> {overdueDays} ngày
              </p>
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Số tiền phạt (VNĐ)
                </label>
                <input
                  type="number"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số tiền phạt"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <ActionButton
                variant="warning"
                onClick={handleProcessFine}
                loading={loading}
              >
                Xử lý phạt
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setShowFineModal(false)}
              >
                Hủy
              </ActionButton>
            </div>
          </div>
        </div>
      )}

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

export default BorrowingDetailsPage; 