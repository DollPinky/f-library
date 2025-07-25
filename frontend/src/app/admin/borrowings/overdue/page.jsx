'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchCard from '../../../../components/ui/SearchCard';
import TableView from '../../../../components/ui/TableView';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';

const OverdueBooksPage = () => {
  const router = useRouter();
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [searchParams, setSearchParams] = useState({
    search: '',
    library: '',
    overdueDays: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [stats, setStats] = useState({
    totalOverdue: 0,
    totalFine: 0,
    averageOverdueDays: 0
  });

  useEffect(() => {
    fetchOverdueBooks();
    fetchOverdueStats();
  }, [pagination.currentPage, searchParams]);

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        size: pagination.size,
        status: 'OVERDUE',
        ...searchParams
      });

      const response = await fetch(`/api/v1/borrowings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setOverdueBooks(data.data.content || []);
        setPagination({
          currentPage: data.data.number || 0,
          totalPages: data.data.totalPages || 0,
          totalElements: data.data.totalElements || 0,
          size: data.data.size || 10
        });
      } else {
        showNotification(data.message || 'Không thể tải danh sách sách quá hạn', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải danh sách sách quá hạn', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/borrowings/overdue/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Không thể tải thống kê sách quá hạn:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchParams(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handleFilterChange = (filters) => {
    setSearchParams(prev => ({ ...prev, ...filters }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const sendReminderEmail = async (borrowingId) => {
    try {
      const response = await fetch(`/api/v1/borrowings/${borrowingId}/remind`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Đã gửi email nhắc nhở thành công!', 'success');
      } else {
        showNotification(data.message || 'Không thể gửi email nhắc nhở', 'error');
      }
    } catch (error) {
      showNotification('Không thể gửi email nhắc nhở', 'error');
    }
  };

  const sendBulkReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/borrowings/overdue/bulk-remind', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          borrowingIds: overdueBooks.map(book => book.borrowId)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(`Đã gửi ${data.data.sentCount} email nhắc nhở!`, 'success');
      } else {
        showNotification(data.message || 'Không thể gửi email nhắc nhở hàng loạt', 'error');
      }
    } catch (error) {
      showNotification('Không thể gửi email nhắc nhở hàng loạt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const calculateOverdueDays = (dueDate) => {
    return Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
  };

  const calculateFine = (dueDate) => {
    const overdueDays = calculateOverdueDays(dueDate);
    return overdueDays * 10000; 
  };

  const columns = [
    {
      key: 'bookCopy',
      header: 'Sách',
      render: (value, row) => (
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
      key: 'reader',
      header: 'Độc giả',
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-sage-900 dark:text-sage-100 truncate">
            {value?.name || 'N/A'}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">
            {value?.studentId || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'dueDate',
      header: 'Hạn trả',
      render: (value, row) => {
        const overdueDays = calculateOverdueDays(value);
        return (
          <div>
            <span className="text-red-600 dark:text-red-400 font-medium">
              {new Date(value).toLocaleDateString('vi-VN')}
            </span>
            <div className="text-xs text-red-600 dark:text-red-400">
              Quá hạn {overdueDays} ngày
            </div>
          </div>
        );
      }
    },
    {
      key: 'fineAmount',
      header: 'Tiền phạt',
      render: (value, row) => {
        const calculatedFine = calculateFine(row.dueDate);
        return (
          <div>
            <div className="font-medium text-red-600 dark:text-red-400">
              {calculatedFine.toLocaleString('vi-VN')} VNĐ
            </div>
            <div className="text-xs text-sage-600 dark:text-sage-400">
              {value > 0 ? `Đã phạt: ${value.toLocaleString('vi-VN')} VNĐ` : 'Chưa xử lý'}
            </div>
          </div>
        );
      }
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-sage-600 dark:text-sage-400">
            {row.reader?.email}
          </div>
          <div className="text-sage-600 dark:text-sage-400">
            {row.reader?.phone}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/borrowings/${row.borrowId}`)}
          >
            Chi tiết
          </ActionButton>
          <ActionButton
            variant="warning"
            size="sm"
            onClick={() => sendReminderEmail(row.borrowId)}
          >
            Nhắc nhở
          </ActionButton>
          <ActionButton
            variant="success"
            size="sm"
            onClick={() => router.push(`/admin/borrowings/${row.borrowId}`)}
          >
            Trả sách
          </ActionButton>
        </div>
      )
    }
  ];

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                Quản lý sách quá hạn
              </h1>
              <p className="text-sage-600 dark:text-sage-400">
                Tổng cộng {pagination.totalElements} sách quá hạn
              </p>
            </div>
            
            <div className="flex space-x-3">
              <ActionButton
                variant="warning"
                onClick={sendBulkReminders}
                loading={loading}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Gửi nhắc nhở hàng loạt
              </ActionButton>
              <Link href="/admin/borrowings">
                <ActionButton variant="outline">
                  Quay lại danh sách
                </ActionButton>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Tổng sách quá hạn</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.totalOverdue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Tổng tiền phạt</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.totalFine?.toLocaleString('vi-VN') || 0} VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <div className="flex items-center">
                <div className="p-3 bg-sage-100 dark:bg-sage-900/30 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Trung bình quá hạn</p>
                  <p className="text-2xl font-bold text-sage-600 dark:text-sage-400">
                    {Math.round(stats.averageOverdueDays || 0)} ngày
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SearchCard
              onSearch={handleSearch}
              filters={[
                {
                  key: 'library',
                  label: 'Thư viện',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả thư viện' },
                    { value: 'main', label: 'Thư viện chính' },
                    { value: 'branch1', label: 'Chi nhánh 1' },
                    { value: 'branch2', label: 'Chi nhánh 2' }
                  ]
                },
                {
                  key: 'overdueDays',
                  label: 'Số ngày quá hạn',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả' },
                    { value: '1-7', label: '1-7 ngày' },
                    { value: '8-14', label: '8-14 ngày' },
                    { value: '15-30', label: '15-30 ngày' },
                    { value: '30+', label: 'Trên 30 ngày' }
                  ]
                }
              ]}
              onFilterChange={handleFilterChange}
              placeholder="Tìm kiếm theo tên sách, độc giả, email..."
            />
          </div>

          {/* Overdue Books Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={overdueBooks}
              columns={columns}
              loading={loading}
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalElements: pagination.totalElements,
                size: pagination.size
              }}
              onPageChange={handlePageChange}
            />
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

export default OverdueBooksPage; 