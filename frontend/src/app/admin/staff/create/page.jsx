'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';

const CreateStaffPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  
  const [formData, setFormData] = useState({
    // Account information
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    
    // Staff information
    employeeId: '',
    staffRole: '',
    libraryId: '',
    department: '',
    position: '',
    specialization: '',
    workSchedule: ''
  });

  const [libraries, setLibraries] = useState([]);
  const [permissions, setPermissions] = useState({
    canManageBooks: false,
    canManageUsers: false,
    canManageStaff: false,
    canViewReports: false,
    canProcessBorrowings: false
  });

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await fetch('/api/v1/libraries');
      const data = await response.json();
      
      if (data.success) {
        setLibraries(data.data.content || []);
      }
    } catch (error) {
      showNotification('Không thể tải danh sách thư viện', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const employeeId = `NV${timestamp}${random}`;
    setFormData(prev => ({ ...prev, employeeId }));
  };

  const validateForm = () => {
    const errors = [];

    // Account validation
    if (!formData.username.trim()) {
      errors.push('Tên đăng nhập là bắt buộc');
    }

    if (!formData.email.trim()) {
      errors.push('Email là bắt buộc');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email không hợp lệ');
    }

    if (!formData.password) {
      errors.push('Mật khẩu là bắt buộc');
    } else if (formData.password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    if (!formData.fullName.trim()) {
      errors.push('Họ tên là bắt buộc');
    }

    // Staff validation
    if (!formData.employeeId.trim()) {
      errors.push('Mã nhân viên là bắt buộc');
    }

    if (!formData.staffRole) {
      errors.push('Vai trò là bắt buộc');
    }

    if (!formData.libraryId) {
      errors.push('Thư viện là bắt buộc');
    }

    if (!formData.department.trim()) {
      errors.push('Phòng ban là bắt buộc');
    }

    if (!formData.position.trim()) {
      errors.push('Chức vụ là bắt buộc');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showNotification(errors.join(', '), 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/v1/staff', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            userType: 'STAFF'
          },
          staff: {
            employeeId: formData.employeeId,
            staffRole: formData.staffRole,
            libraryId: formData.libraryId,
            department: formData.department,
            position: formData.position,
            specialization: formData.specialization,
            workSchedule: formData.workSchedule,
            isActive: true,
            ...permissions
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Tạo nhân viên thành công!', 'success');
        setTimeout(() => {
          router.push('/admin/staff');
        }, 1500);
      } else {
        showNotification(data.message || 'Không thể tạo nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Không thể tạo nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

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
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
                <Link href="/admin/staff" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Nhân viên
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                Thêm nhân viên mới
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Thêm nhân viên mới
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Tạo tài khoản và thông tin nhân viên mới
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Account Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin tài khoản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Tên đăng nhập *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="example@library.edu.vn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập họ tên đầy đủ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="0123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin nhân viên
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Mã nhân viên *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập mã nhân viên"
                      />
                      <ActionButton
                        type="button"
                        variant="outline"
                        onClick={generateEmployeeId}
                      >
                        Tạo mã
                      </ActionButton>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Vai trò *
                    </label>
                    <select
                      name="staffRole"
                      value={formData.staffRole}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn vai trò</option>
                      <option value="ADMIN">Quản trị viên</option>
                      <option value="LIBRARIAN">Thủ thư</option>
                      <option value="MANAGER">Quản lý</option>
                      <option value="ASSISTANT">Trợ lý</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Thư viện *
                    </label>
                    <select
                      name="libraryId"
                      value={formData.libraryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn thư viện</option>
                      {libraries.map((library) => (
                        <option key={library.libraryId} value={library.libraryId}>
                          {library.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Phòng ban *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập phòng ban"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Chức vụ *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập chức vụ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Chuyên môn
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập chuyên môn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Lịch làm việc
                    </label>
                    <input
                      type="text"
                      name="workSchedule"
                      value={formData.workSchedule}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ví dụ: Thứ 2-6, 8h-17h"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Quyền hạn
                </h3>
                
                <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.canManageBooks}
                        onChange={() => handlePermissionChange('canManageBooks')}
                        className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                      />
                      <span className="text-sage-900 dark:text-sage-100">Quản lý sách</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.canManageUsers}
                        onChange={() => handlePermissionChange('canManageUsers')}
                        className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                      />
                      <span className="text-sage-900 dark:text-sage-100">Quản lý người dùng</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.canManageStaff}
                        onChange={() => handlePermissionChange('canManageStaff')}
                        className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                      />
                      <span className="text-sage-900 dark:text-sage-100">Quản lý nhân viên</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.canViewReports}
                        onChange={() => handlePermissionChange('canViewReports')}
                        className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                      />
                      <span className="text-sage-900 dark:text-sage-100">Xem báo cáo</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.canProcessBorrowings}
                        onChange={() => handlePermissionChange('canProcessBorrowings')}
                        className="w-4 h-4 text-sage-600 bg-sage-100 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                      />
                      <span className="text-sage-900 dark:text-sage-100">Xử lý mượn trả</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                <ActionButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Tạo nhân viên
                </ActionButton>
                <Link href="/admin/staff">
                  <ActionButton
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </ActionButton>
                </Link>
              </div>
            </form>
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

export default CreateStaffPage; 