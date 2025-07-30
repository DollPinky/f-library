'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TableView from '../../../../components/ui/TableView';
import DetailDrawer from '../../../../components/ui/DetailDrawer';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import LoadingSkeleton from '../../../../components/ui/LoadingSkeleton';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDebounce } from '../../../../hooks/useDebounce';

const StaffTab = () => {
  const router = useRouter();
  
  // Mock data for staff accounts
  const [staffAccounts, setStaffAccounts] = useState([
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@university.edu.vn',
      phone: '0123456789',
      employeeCode: 'NV001',
      department: 'Phòng Hành chính',
      position: 'Chuyên viên',
      isActive: true,
      createdAt: '2023-01-15T08:30:00Z',
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      email: 'tranthib@university.edu.vn',
      phone: '0987654321',
      employeeCode: 'NV002',
      department: 'Phòng Kế toán',
      position: 'Kế toán viên',
      isActive: true,
      createdAt: '2023-02-20T09:15:00Z',
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      email: 'levanc@university.edu.vn',
      phone: '0345678912',
      employeeCode: 'NV003',
      department: 'Phòng Nhân sự',
      position: 'Chuyên viên tuyển dụng',
      isActive: false,
      createdAt: '2023-03-10T10:45:00Z',
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    page: 0,
    size: 10
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
  }, []);

  // Handle search
  useEffect(() => {
    // In a real app, this would call an API
    console.log('Searching for:', debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Table columns
  const columns = [
    { 
      key: 'employeeCode', 
      title: 'Mã nhân viên', 
      sortable: true,
      render: (value, row) => (
        <div className="font-medium text-sage-900 dark:text-sage-100">{value}</div>
      )
    },
    { 
      key: 'fullName', 
      title: 'Họ và tên', 
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-sage-900 dark:text-sage-100">{value}</div>
          <div className="text-sage-500 dark:text-sage-400 text-sm">{row.email}</div>
        </div>
      )
    },
    { 
      key: 'department', 
      title: 'Phòng ban', 
      sortable: true,
      render: (value) => (
        <div className="text-sage-900 dark:text-sage-100">{value}</div>
      )
    },
    { 
      key: 'position', 
      title: 'Chức vụ', 
      sortable: true,
      render: (value) => (
        <div className="text-sage-900 dark:text-sage-100">{value}</div>
      )
    },
    { 
      key: 'phone', 
      title: 'Số điện thoại', 
      sortable: false,
      render: (value) => (
        <div className="text-sage-900 dark:text-sage-100">{value}</div>
      )
    },
    { 
      key: 'isActive', 
      title: 'Trạng thái', 
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {value ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (value, row) => (
        <div className="flex space-x-2">
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(row)}
            className="p-1.5"
          >
            <EyeIcon className="w-4 h-4" />
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => handleEditAccount(row)}
            className="p-1.5"
          >
            <PencilIcon className="w-4 h-4" />
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => handleDeleteAccount(row)}
            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="w-4 h-4" />
          </ActionButton>
        </div>
      )
    }
  ];

  // Handle view details
  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setIsDrawerOpen(true);
  };

  // Handle edit account
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  // Handle delete account
  const handleDeleteAccount = (account) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${account.fullName}?`)) {
      // In a real app, this would call an API to delete the account
      setStaffAccounts(staffAccounts.filter(acc => acc.id !== account.id));
      showNotification('Xóa tài khoản thành công', 'success');
    }
  };

  // Handle clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      department: '',
      page: 0,
      size: 10
    });
  };

  // Handle create new account
  const handleCreateAccount = () => {
    router.push('/admin/accounts/staff/create');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-sage-200 dark:border-sage-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-sage-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                className="block w-full pl-10 pr-3 py-2 border border-sage-300 dark:border-sage-700 rounded-lg bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-sage-300 dark:border-sage-700 rounded-lg text-sage-700 dark:text-sage-300 bg-white dark:bg-neutral-800 hover:bg-sage-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Bộ lọc
            </button>
            
            <ActionButton
              onClick={handleCreateAccount}
              className="inline-flex items-center px-4 py-2"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Thêm nhân viên
            </ActionButton>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">Trạng thái</label>
                <select
                  className="block w-full rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">Phòng ban</label>
                <select
                  className="block w-full rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <option value="">Tất cả</option>
                  <option value="Phòng Hành chính">Phòng Hành chính</option>
                  <option value="Phòng Kế toán">Phòng Kế toán</option>
                  <option value="Phòng Nhân sự">Phòng Nhân sự</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-sage-300 dark:border-sage-700 rounded-lg text-sage-700 dark:text-sage-300 bg-white dark:bg-neutral-800 hover:bg-sage-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Staff Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-sage-200 dark:border-sage-800 overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <TableView
            data={staffAccounts}
            columns={columns}
            pagination={{
              page: filters.page,
              size: filters.size,
              totalElements: staffAccounts.length,
              totalPages: Math.ceil(staffAccounts.length / filters.size)
            }}
            onPageChange={(page) => setFilters({...filters, page})}
            onSort={(key, direction) => {
              // Handle sorting
              console.log('Sorting by:', key, direction);
            }}
          />
        )}
      </div>
      
      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Thông tin chi tiết nhân viên"
      >
        {selectedAccount && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Họ và tên</label>
                <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedAccount.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Mã nhân viên</label>
                <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedAccount.employeeCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Email</label>
                <p className="text-sage-900 dark:text-sage-100">{selectedAccount.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Số điện thoại</label>
                <p className="text-sage-900 dark:text-sage-100">{selectedAccount.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Phòng ban</label>
                <p className="text-sage-900 dark:text-sage-100">{selectedAccount.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Chức vụ</label>
                <p className="text-sage-900 dark:text-sage-100">{selectedAccount.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAccount.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {selectedAccount.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                <p className="text-sage-900 dark:text-sage-100">
                  {new Date(selectedAccount.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
              <ActionButton
                variant="outline"
                onClick={() => handleEditAccount(selectedAccount)}
                className="group min-h-[40px]"
              >
                <PencilIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                <span>Chỉnh sửa</span>
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="min-h-[40px]"
              >
                Đóng
              </ActionButton>
            </div>
          </div>
        )}
      </DetailDrawer>
      
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

export default StaffTab;
