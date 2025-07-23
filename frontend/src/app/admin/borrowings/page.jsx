'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import SearchCard from '../../../components/ui/SearchCard';
import TableView from '../../../components/ui/TableView';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../components/ui/DarkModeToggle';

const AdminBorrowingsPage = () => {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [searchParams, setSearchParams] = useState({
    search: '',
    status: '',
    library: '',
    overdue: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    fetchBorrowings();
  }, [pagination.currentPage, searchParams]);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        size: pagination.size,
        ...searchParams
      });

      const response = await fetch(`/api/v1/borrowings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setBorrowings(data.data.content || []);
        setPagination({
          currentPage: data.data.number || 0,
          totalPages: data.data.totalPages || 0,
          totalElements: data.data.totalElements || 0,
          size: data.data.size || 10
        });
      } else {
        showNotification(data.message || 'Không thể tải danh sách mượn sách', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải danh sách mượn sách', 'error');
    } finally {
      setLoading(false);
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

  const handleReturnBook = async () => {
    if (!selectedBorrowing) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/borrowings/${selectedBorrowing.borrowId}/return`, {
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
        setSelectedBorrowing(null);
        fetchBorrowings();
      } else {
        showNotification(data.message || 'Không thể trả sách', 'error');
      }
    } catch (error) {
      showNotification('Không thể trả sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmReturn = (borrowing) => {
    setSelectedBorrowing(borrowing);
    setShowReturnModal(true);
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
      render: (value, row) => {
        const overdue = isOverdue(value);
        return (
          <div>
            <span className={`${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-sage-600 dark:text-sage-400'}`}>
              {new Date(value).toLocaleDateString('vi-VN')}
            </span>
            {overdue && (
              <div className="text-xs text-red-600 dark:text-red-400">
                Quá hạn {Math.ceil((new Date() - new Date(value)) / (1000 * 60 * 60 * 24))} ngày
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusText(value)}
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
          {row.status === 'BORROWED' && (
            <ActionButton
              variant="success"
              size="sm"
              onClick={() => confirmReturn(row)}
            >
              Trả sách
            </ActionButton>
          )}
          {row.status === 'OVERDUE' && (
            <ActionButton
              variant="warning"
              size="sm"
              onClick={() => router.push(`/admin/borrowings/${row.borrowId}/fine`)}
            >
              Xử lý phạt
            </ActionButton>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="p-4 sm:p-6 lg:p-6">
        <div className="max-w-none mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Quản lý mượn trả
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý và theo dõi hoạt động mượn trả sách
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="primary"
                  onClick={() => router.push('/admin/borrowings/create')}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Tạo mượn sách</span>
                  <span className="sm:hidden">Tạo</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8">
            <SearchCard
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              filters={searchParams}
              placeholder="Tìm kiếm theo tên sách, độc giả, QR code..."
            />
          </div>

          {/* Borrowings Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={borrowings}
              columns={columns}
              loading={loading}
              pagination={{
                currentPage: pagination.currentPage + 1,
                totalPages: pagination.totalPages,
                total: pagination.totalElements,
                from: pagination.currentPage * pagination.size + 1,
                to: Math.min((pagination.currentPage + 1) * pagination.size, pagination.totalElements)
              }}
              onPageChange={handlePageChange}
            />
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
                <strong>Sách:</strong> {selectedBorrowing?.bookCopy?.book?.title}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Độc giả:</strong> {selectedBorrowing?.reader?.name}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Ngày mượn:</strong> {new Date(selectedBorrowing?.borrowedAt).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Hạn trả:</strong> {new Date(selectedBorrowing?.dueDate).toLocaleDateString('vi-VN')}
              </p>
              {isOverdue(selectedBorrowing?.dueDate) && (
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

export default AdminBorrowingsPage; 