'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../components/ui/ActionButton';
import NotificationToast from '../../components/ui/NotificationToast';
import DarkModeToggle from '../../components/ui/DarkModeToggle';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    studentId: '',
    faculty: '',
    major: '',
    year: '',
    role: 'READER',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp', 'error');
      return false;
    }
    if (formData.password.length < 8) {
      showNotification('Mật khẩu phải có ít nhất 8 ký tự', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Loại bỏ confirmPassword trước khi gửi
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        
        // Chuyển hướng đến trang login sau 2 giây
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        showNotification(data.message || 'Đăng ký thất bại', 'error');
      }
    } catch (error) {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-sage-100 dark:bg-sage-800 rounded-2xl">
              <svg className="w-8 h-8 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-sage-600 dark:text-sage-400">
            Tham gia hệ thống thư viện của chúng tôi
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Mã sinh viên
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập mã sinh viên"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Vai trò *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="READER">Độc giả</option>
                  <option value="LIBRARIAN">Thủ thư</option>
                  <option value="MANAGER">Quản lý</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Khoa
                </label>
                <input
                  type="text"
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập khoa"
                />
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Ngành
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập ngành"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Năm học
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập năm học"
                />
              </div>
            </div>

            {/* Submit Button */}
            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Đăng ký
            </ActionButton>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-sage-600 dark:text-sage-400">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mt-6">
          <DarkModeToggle />
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

export default RegisterPage; 