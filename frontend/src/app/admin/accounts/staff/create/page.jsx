'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActionButton from '../../../../../components/ui/ActionButton';
import NotificationToast from '../../../../../components/ui/NotificationToast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateStaffPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeCode: '',
    department: '',
    position: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Department options
  const departmentOptions = [
    { value: 'Phòng Hành chính', label: 'Phòng Hành chính' },
    { value: 'Phòng Kế toán', label: 'Phòng Kế toán' },
    { value: 'Phòng Nhân sự', label: 'Phòng Nhân sự' },
    { value: 'Phòng IT', label: 'Phòng IT' },
    { value: 'Phòng Tài chính', label: 'Phòng Tài chính' },
  ];
  
  // Position options
  const positionOptions = [
    { value: 'Giám đốc', label: 'Giám đốc' },
    { value: 'Phó giám đốc', label: 'Phó giám đốc' },
    { value: 'Trưởng phòng', label: 'Trưởng phòng' },
    { value: 'Phó phòng', label: 'Phó phòng' },
    { value: 'Chuyên viên', label: 'Chuyên viên' },
    { value: 'Kế toán viên', label: 'Kế toán viên' },
    { value: 'Nhân viên', label: 'Nhân viên' },
  ];
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Mã nhân viên là bắt buộc';
    }
    
    if (!formData.department) {
      newErrors.department = 'Phòng ban là bắt buộc';
    }
    
    if (!formData.position) {
      newErrors.position = 'Chức vụ là bắt buộc';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to create the staff account
      console.log('Creating staff account:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        show: true,
        message: 'Tạo nhân viên thành công',
        type: 'success'
      });
      
      // Redirect to staff list after a short delay
      setTimeout(() => {
        router.push('/admin/accounts/staff');
      }, 1500);
    } catch (error) {
      setNotification({
        show: true,
        message: 'Có lỗi xảy ra khi tạo nhân viên: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push('/admin/accounts/staff');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <ActionButton
          variant="outline"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </ActionButton>
        <div>
          <h1 className="text-2xl font-bold text-sage-900 dark:text-sage-100">
            Thêm nhân viên mới
          </h1>
          <p className="text-sage-600 dark:text-sage-400 mt-1">
            Điền thông tin nhân viên để thêm vào hệ thống
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-sage-200 dark:border-sage-800 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.fullName ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.phone ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )
            }
            </div>
            
            {/* Employee Code */}
            <div>
              <label htmlFor="employeeCode" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Mã nhân viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="employeeCode"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.employeeCode ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.employeeCode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeCode}</p>
              )}
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Phòng ban <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.department ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              >
                <option value="">Chọn phòng ban</option>
                {departmentOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
              )}
            </div>
            
            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Chức vụ <span className="text-red-500">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.position ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              >
                <option value="">Chọn chức vụ</option>
                {positionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.password ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-sage-300 dark:border-sage-700'} bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 shadow-sm focus:ring-sage-500 focus:border-sage-500`}                
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-sage-200 dark:border-sage-800">
            <ActionButton
              variant="outline"
              onClick={handleCancel}
              type="button"
              disabled={isSubmitting}
              className="min-h-[40px]"
            >
              Hủy
            </ActionButton>
            <ActionButton
              type="submit"
              disabled={isSubmitting}
              className="min-h-[40px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                'Tạo nhân viên'
              )}
            </ActionButton>
          </div>
        </form>
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
