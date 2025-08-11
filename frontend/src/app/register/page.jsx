'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import ActionButton from '../../components/ui/ActionButton';
import NotificationToast from '../../components/ui/NotificationToast';
import DarkModeToggle from '../../components/ui/DarkModeToggle';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

const RegisterPage = () => {
  const router = useRouter();
  const { register, isAuthenticated } = useAccountAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employeeCode: '',
    password: '',
    confirmPassword: '',
    campusId: ''
  });
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/campuses/all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCampuses(data.data);
        } else {
          setCampuses([]);
        }
      } catch (err) {
        setCampuses([]);
      }
    };
    fetchCampuses();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.campusId) {
      showNotification('Vui lòng chọn chi nhánh', 'error');
      return false;
    }
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
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        showNotification(result.message, 'error');
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-sage-100 dark:bg-sage-800 rounded-2xl">
              <svg className="w-8 h-8 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
            Đăng ký nhân viên
          </h1>
          <p className="text-sage-600 dark:text-sage-400">
            Tham gia hệ thống thư viện công ty
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ tên"
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
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label htmlFor="employeeCode" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Mã nhân viên *
                </label>
                <input
                  type="text"
                  id="employeeCode"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập mã nhân viên"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Phòng ban
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập phòng ban"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Chức vụ
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập chức vụ"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="campusId" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Chi nhánh công ty *
                </label>
                <select
                  id="campusId"
                  name="campusId"
                  value={formData.campusId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Chọn chi nhánh công ty</option>
                  {campuses.map(campus => (
                    <option key={campus.campusId} value={campus.campusId}>{campus.name}</option>
                  ))}
                </select>
              </div>
            </div>
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
          <div className="text-center mt-6">
            <p className="text-sm text-sage-600 dark:text-sage-400">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <DarkModeToggle />
        </div>
      </div>
      <NotificationToast {...notification} onClose={() => setNotification({ ...notification, show: false })} />
    </div>
  );
};

export default RegisterPage; 