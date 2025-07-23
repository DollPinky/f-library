'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchCard from '../../../components/ui/SearchCard';
import TableView from '../../../components/ui/TableView';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../components/ui/DarkModeToggle';

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

  // Table columns configuration
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
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="p-2 bg-sage-100 dark:bg-sage-800 rounded-xl mr-3">
                    <svg className="w-6 h-6 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                Quản lý nhân viên
              </h1>
              <p className="text-sage-600 dark:text-sage-400">
                Tổng cộng {pagination.totalElements} nhân viên
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link href="/admin/staff/create">
                <ActionButton variant="primary">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm nhân viên mới
                </ActionButton>
              </Link>
              <Link href="/admin/staff/roles">
                <ActionButton variant="outline">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Quản lý vai trò
                </ActionButton>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
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
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={staff}
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