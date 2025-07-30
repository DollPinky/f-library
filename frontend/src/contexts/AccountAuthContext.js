'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import accountAuthService from '../services/accountAuthService';

const AccountAuthContext = createContext();

export const useAccountAuth = () => {
  const context = useContext(AccountAuthContext);
  if (!context) {
    throw new Error('useAccountAuth must be used within an AccountAuthProvider');
  }
  return context;
};

export const AccountAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('account');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await accountAuthService.getCurrentAccount();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        localStorage.setItem('account', JSON.stringify(response.data));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('account');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('account');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await accountAuthService.login(credentials);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        localStorage.setItem('account', JSON.stringify(response.data));
        // Role-based redirect
        if (response.data.role === 'ADMIN' || response.data.role === 'LIBRARIAN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        return { success: true, message: 'Đăng nhập thành công' };
      } else {
        return { success: false, message: response.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      return { success: false, message: 'Không thể kết nối đến máy chủ' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await accountAuthService.register(userData);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        localStorage.setItem('account', JSON.stringify(response.data));
        // Role-based redirect
        if (response.data.role === 'ADMIN' || response.data.role === 'LIBRARIAN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        return { success: true, message: 'Đăng ký thành công' };
      } else {
        return { success: false, message: response.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      return { success: false, message: 'Không thể kết nối đến máy chủ' };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('http://localhost:8080/api/v1/accounts/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error calling backend logout:', error);
    } finally {
      // Clear local state regardless of backend call success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('account');
      router.push('/login');
      return { success: true, message: 'Đăng xuất thành công' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AccountAuthContext.Provider value={value}>
      {children}
    </AccountAuthContext.Provider>
  );
};