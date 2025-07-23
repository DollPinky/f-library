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
import { CogIcon } from '@heroicons/react/24/outline';

const AdminStaffPage = () => {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [searchParams, setSearchParams] = useState({
    search: '',
    role: '',
    library: '',
    status: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    fetchStaff();
    fetchLibraries();
  }, [pagination.currentPage, searchParams]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        size: pagination.size,
        ...searchParams
      });

      const response = await fetch(`/api/v1/staff?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStaff(data.data.content || []);
        setPagination({
          currentPage: data.data.number || 0,
          totalPages: data.data.totalPages || 0,
          totalElements: data.data.totalElements || 0,
          size: data.data.size || 10
        });
      } else {
        showNotification(data.message || 'Không thể tải danh sách nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải danh sách nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraries = async () => {
    try {
      const response = await fetch('/api/v1/libraries');
      const data = await response.json();
      
      if (data.success) {
        setLibraries(data.data.content || []);
      }
    } catch (error) {
      console.error('Không thể tải danh sách thư viện:', error);
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

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/staff/${selectedStaff.staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Xóa nhân viên thành công!', 'success');
        setShowDeleteModal(false);
        setSelectedStaff(null);
        fetchStaff();
      } else {
        showNotification(data.message || 'Không thể xóa nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Không thể xóa nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const response = await fetch(`/api/v1/staff/${staffId}/status`, {
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
        fetchStaff();
      } else {
        showNotification(data.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật trạng thái', 'error');
    }
  };

  const confirmDelete = (staffMember) => {
    setSelectedStaff(staffMember);
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'LIBRARIAN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MANAGER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'ASSISTANT':
        return 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'LIBRARIAN':
        return 'Thủ thư';
      case 'MANAGER':
        return 'Quản lý';
      case 'ASSISTANT':
        return 'Trợ lý';
      default:
        return 'Không xác định';
    }
  };

  const columns = [
    {
      key: 'account',
      header: 'Nhân viên',
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-sage-900 dark:text-sage-100 truncate">
            {value?.fullName || 'N/A'}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">
            {row.employeeId}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (value, row) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {row.account?.email || 'N/A'}
        </span>
      )
    },
    {
      key: 'staffRole',
      header: 'Vai trò',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(value)}`}>
          {getRoleText(value)}
        </span>
      )
    },
    {
      key: 'library',
      header: 'Thư viện',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {value?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'department',
      header: 'Phòng ban',
      render: (value) => (
        <span className="text-sage-600 dark:text-sage-400 text-sm">
          {value || 'N/A'}
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
            onClick={() => handleToggleStatus(row.staffId, value)}
          >
            {value ? 'Vô hiệu' : 'Kích hoạt'}
          </ActionButton>
        </div>
      )
    },
    {
      key: 'hireDate',
      header: 'Ngày vào làm',
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
            onClick={() => router.push(`/admin/staff/${row.staffId}`)}
          >
            Chi tiết
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/staff/${row.staffId}/edit`)}
          >
            Sửa
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/staff/${row.staffId}/permissions`)}
          >
            Quyền hạn
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
                  Quản lý nhân viên
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý tài khoản nhân viên trong hệ thống
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="outline"
                  onClick={() => router.push('/admin/staff/roles')}
                  className="group min-h-[40px]"
                >
                  <CogIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Quản lý vai trò</span>
                  <span className="sm:hidden">Vai trò</span>
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={() => router.push('/admin/staff/create')}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm nhân viên</span>
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
                  key: 'role',
                  label: 'Vai trò',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả vai trò' },
                    { value: 'ADMIN', label: 'Quản trị viên' },
                    { value: 'LIBRARIAN', label: 'Thủ thư' },
                    { value: 'MANAGER', label: 'Quản lý' },
                    { value: 'ASSISTANT', label: 'Trợ lý' }
                  ]
                },
                {
                  key: 'library',
                  label: 'Thư viện',
                  type: 'select',
                  options: [
                    { value: '', label: 'Tất cả thư viện' },
                    ...libraries.map(library => ({
                      value: library.libraryId,
                      label: library.name
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
              placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
            />
          </div>

          {/* Staff Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={staff}
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
              Xác nhận xóa nhân viên
            </h3>
            <div className="mb-6 space-y-3">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Họ tên:</strong> {selectedStaff?.account?.fullName}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Mã nhân viên:</strong> {selectedStaff?.employeeId}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Email:</strong> {selectedStaff?.account?.email}
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                ⚠️ Hành động này sẽ xóa vĩnh viễn nhân viên và tất cả dữ liệu liên quan!
              </p>
            </div>
            <div className="flex gap-4">
              <ActionButton
                variant="danger"
                onClick={handleDeleteStaff}
                loading={loading}
              >
                Xóa nhân viên
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

export default AdminStaffPage; 