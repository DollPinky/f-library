'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import ActionButton from '../../components/ui/ActionButton';
import NotificationToast from '../../components/ui/NotificationToast';
import DarkModeToggle from '../../components/ui/DarkModeToggle';

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAccountAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        showNotification(result.message, 'success');
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
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-sage-100 dark:bg-sage-800 rounded-2xl">
              <svg className="w-8 h-8 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
            Đăng nhập nhân viên
          </h1>
          <p className="text-sage-600 dark:text-sage-400">
            Đăng nhập vào hệ thống thư viện công ty
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Email
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
              <label htmlFor="password" className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Mật khẩu
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
            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Đăng nhập
            </ActionButton>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-sage-600 dark:text-sage-400">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                Đăng ký ngay
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

export default LoginPage; 