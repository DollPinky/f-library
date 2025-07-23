'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';
import TableView from '../../../../components/ui/TableView';

const ReaderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [reader, setReader] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    totalBorrowings: 0,
    currentBorrowings: 0,
    overdueBooks: 0,
    totalFine: 0
  });

  useEffect(() => {
    fetchReaderDetails();
    fetchReaderBorrowings();
    fetchReaderStats();
  }, [params.id]);

  const fetchReaderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/readers/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReader(data.data);
      } else {
        showNotification(data.message || 'Không thể tải thông tin độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải thông tin độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchReaderBorrowings = async () => {
    try {
      const response = await fetch(`/api/v1/readers/${params.id}/borrowings?size=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setBorrowings(data.data.content || []);
      }
    } catch (error) {
      console.error('Không thể tải lịch sử mượn sách:', error);
    }
  };

  const fetchReaderStats = async () => {
    try {
      const response = await fetch(`/api/v1/readers/${params.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Không thể tải thống kê độc giả:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`/api/v1/readers/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !reader.isActive
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(`Cập nhật trạng thái thành công!`, 'success');
        fetchReaderDetails();
      } else {
        showNotification(data.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteReader = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/readers/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Xóa độc giả thành công!', 'success');
        setTimeout(() => {
          router.push('/admin/readers');
        }, 1500);
      } else {
        showNotification(data.message || 'Không thể xóa độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể xóa độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const getBorrowingStatusColor = (status) => {
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

  const getBorrowingStatusText = (status) => {
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

  // Borrowing history columns
  const borrowingColumns = [
    {
      key: 'bookCopy',
      header: 'Sách',
      render: (value) => (
        <div className="max-w-xs">
          <div className="font-medium text-sage-900 dark:text-sage-100 truncate">
            {value?.book?.title || 'N/A'}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">
            QR: {value?.qrCode || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'borrowedAt',
      header: 'Ngày mượn',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400">
          {new Date(value).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'dueDate',
      header: 'Hạn trả',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400">
          {new Date(value).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBorrowingStatusColor(value)}`}>
          {getBorrowingStatusText(value)}
        </span>
      )
    },
    {
      key: 'fineAmount',
      header: 'Tiền phạt',
      render: (value) => (
        <span className={`font-medium ${value > 0 ? 'text-red-600 dark:text-red-400' : 'text-sage-600 dark:text-sage-400'}`}>
          {value > 0 ? `${value.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
        </span>
      )
    }
  ];

  if (loading && !reader) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin độc giả...</p>
        </div>
      </div>
    );
  }

  if (!reader) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Không tìm thấy thông tin độc giả
          </div>
          <ActionButton onClick={() => router.push('/admin/readers')}>
            Quay lại danh sách
          </ActionButton>
        </div>
      </div>
    );
  }

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
                <Link href="/admin/readers" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Độc giả
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                {reader.name}
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Chi tiết độc giả
                </h1>
                <p className="text-sage-600 dark:text-sage-400">
                  MSSV: {reader.studentId}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <ActionButton
                  variant={reader.isActive ? "warning" : "success"}
                  onClick={handleToggleStatus}
                >
                  {reader.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </ActionButton>
                <Link href={`/admin/readers/${params.id}/edit`}>
                  <ActionButton variant="outline">
                    Chỉnh sửa
                  </ActionButton>
                </Link>
                <ActionButton
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Xóa
                </ActionButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-xl ${getStatusColor(reader.isActive)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Trạng thái: {getStatusText(reader.isActive)}</h3>
                      <p className="text-sm mt-1">Đăng ký: {new Date(reader.registeredAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{reader.name}</div>
                      <div className="text-sm">{reader.studentId}</div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin cơ bản</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Họ tên:</span> <span className="font-medium">{reader.name}</span></p>
                          <p><span className="text-sage-600 dark:text-sage-400">MSSV:</span> {reader.studentId}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Email:</span> {reader.email}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Số điện thoại:</span> {reader.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin học tập</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Khoa:</span> {reader.faculty || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Ngành:</span> {reader.major || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Năm học:</span> {reader.year || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Cơ sở:</span> {reader.campus?.name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Borrowing Statistics */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thống kê mượn sách
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{stats.totalBorrowings}</div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">Tổng lượt mượn</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.currentBorrowings}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">Đang mượn</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdueBooks}</div>
                      <div className="text-sm text-red-600 dark:text-red-400">Quá hạn</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.totalFine?.toLocaleString('vi-VN') || 0}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">Tiền phạt (VNĐ)</div>
                    </div>
                  </div>
                </div>

                {/* Recent Borrowings */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100">
                      Lịch sử mượn sách gần đây
                    </h3>
                    <Link href={`/admin/readers/${params.id}/borrowings`}>
                      <ActionButton variant="outline" size="sm">
                        Xem tất cả
                      </ActionButton>
                    </Link>
                  </div>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl overflow-hidden">
                    <TableView
                      data={borrowings}
                      columns={borrowingColumns}
                      loading={false}
                      className="h-64"
                    />
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
                  <Link href={`/admin/borrowings/create?readerId=${params.id}`}>
                    <ActionButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Mượn sách cho độc giả
                    </ActionButton>
                  </Link>
                  
                  <Link href={`/admin/readers/${params.id}/borrowings`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Xem lịch sử mượn sách
                    </ActionButton>
                  </Link>
                  
                  <Link href={`/admin/readers/${params.id}/edit`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Chỉnh sửa thông tin
                    </ActionButton>
                  </Link>
                  
                  <ActionButton
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/admin/readers')}
                    className="w-full"
                  >
                    Quay lại danh sách
                  </ActionButton>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thông tin tài khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Trạng thái tài khoản</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reader.isActive)}`}>
                      {getStatusText(reader.isActive)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Ngày đăng ký</span>
                    <span className="text-sage-900 dark:text-sage-100">
                      {new Date(reader.registeredAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Email xác thực</span>
                    <span className="text-sage-900 dark:text-sage-100">
                      {reader.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Xác nhận xóa độc giả
            </h3>
            <div className="mb-6 space-y-3">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Họ tên:</strong> {reader?.name}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>MSSV:</strong> {reader?.studentId}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Email:</strong> {reader?.email}
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                ⚠️ Hành động này sẽ xóa vĩnh viễn độc giả và tất cả dữ liệu liên quan!
              </p>
            </div>
            <div className="flex gap-4">
              <ActionButton
                variant="danger"
                onClick={handleDeleteReader}
                loading={loading}
              >
                Xóa độc giả
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
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

export default ReaderDetailsPage; 