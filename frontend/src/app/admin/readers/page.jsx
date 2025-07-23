'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import SearchCard from '../../../components/ui/SearchCard';
import TableView from '../../../components/ui/TableView';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../components/ui/DarkModeToggle';

const AdminReadersPage = () => {
  const router = useRouter();
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [searchParams, setSearchParams] = useState({
    search: '',
    faculty: '',
    campus: '',
    status: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedReader, setSelectedReader] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    fetchReaders();
    fetchFilterData();
  }, [pagination.currentPage, searchParams]);

  const fetchReaders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        size: pagination.size,
        ...searchParams
      });

      const response = await fetch(`/api/v1/readers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReaders(data.data.content || []);
        setPagination({
          currentPage: data.data.number || 0,
          totalPages: data.data.totalPages || 0,
          totalElements: data.data.totalElements || 0,
          size: data.data.size || 10
        });
      } else {
        showNotification(data.message || 'Không thể tải danh sách độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải danh sách độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const [facultiesResponse, campusesResponse] = await Promise.all([
        fetch('/api/v1/faculties'),
        fetch('/api/v1/campuses')
      ]);

      const facultiesData = await facultiesResponse.json();
      const campusesData = await campusesResponse.json();

      if (facultiesData.success) {
        setFaculties(facultiesData.data.content || []);
      }
      if (campusesData.success) {
        setCampuses(campusesData.data.content || []);
      }
    } catch (error) {
      console.error('Không thể tải dữ liệu filter:', error);
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

  const handleDeleteReader = async () => {
    if (!selectedReader) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/readers/${selectedReader.readerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Xóa độc giả thành công!', 'success');
        setShowDeleteModal(false);
        setSelectedReader(null);
        fetchReaders();
      } else {
        showNotification(data.message || 'Không thể xóa độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể xóa độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (readerId, currentStatus) => {
    try {
      const response = await fetch(`/api/v1/readers/${readerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(`Cập nhật trạng thái thành công!`, 'success');
        fetchReaders();
      } else {
        showNotification(data.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật trạng thái', 'error');
    }
  };

  const confirmDelete = (reader) => {
    setSelectedReader(reader);
    setShowDeleteModal(true);
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

  const columns = [
    {
      key: 'name',
      header: 'Họ tên',
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-sage-900 dark:text-sage-100 truncate">
            {value}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">
            {row.studentId}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {value}
        </span>
      )
    },
    {
      key: 'faculty',
      header: 'Khoa/Ngành',
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="text-sage-900 dark:text-sage-100 text-sm">
            {value || 'N/A'}
          </div>
          <div className="text-xs text-sage-600 dark:text-sage-400">
            {row.major || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'year',
      header: 'Năm học',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400">
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'campus',
      header: 'Cơ sở',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {value?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {getStatusText(value)}
          </span>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(row.readerId, value)}
          >
            {value ? 'Vô hiệu' : 'Kích hoạt'}
          </ActionButton>
        </div>
      )
    },
    {
      key: 'registeredAt',
      header: 'Ngày đăng ký',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'}
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
            onClick={() => router.push(`/admin/readers/${row.readerId}`)}
          >
            Chi tiết
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/readers/${row.readerId}/edit`)}
          >
            Sửa
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/readers/${row.readerId}/borrowings`)}
          >
            Lịch sử
          </ActionButton>
          <ActionButton
            variant="danger"
            size="sm"
            onClick={() => confirmDelete(row)}
          >
            Xóa
          </ActionButton>
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
                  Quản lý độc giả
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý thông tin độc giả trong hệ thống
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="outline"
                  onClick={() => router.push('/admin/readers/import')}
                  className="group min-h-[40px]"
                >
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Import Excel</span>
                  <span className="sm:hidden">Import</span>
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={() => router.push('/admin/readers/create')}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm độc giả</span>
                  <span className="sm:hidden">Thêm</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8">
            <SearchCard
              onSearch={handleSearch}
              filters={[
                {
                  key: 'faculty',
                  label: 'Khoa',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả khoa' },
                    ...faculties.map(faculty => ({
                      value: faculty.name,
                      label: faculty.name
                    }))
                  ]
                },
                {
                  key: 'campus',
                  label: 'Cơ sở',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả cơ sở' },
                    ...campuses.map(campus => ({
                      value: campus.campusId,
                      label: campus.name
                    }))
                  ]
                },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'true', label: 'Hoạt động' },
                    { value: 'false', label: 'Không hoạt động' }
                  ]
                }
              ]}
              onFilterChange={handleFilterChange}
              placeholder="Tìm kiếm theo tên, email, mã số sinh viên..."
            />
          </div>

          {/* Readers Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={readers}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Xác nhận xóa độc giả
            </h3>
            <div className="mb-6 space-y-3">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Họ tên:</strong> {selectedReader?.name}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>MSSV:</strong> {selectedReader?.studentId}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Email:</strong> {selectedReader?.email}
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

export default AdminReadersPage; 