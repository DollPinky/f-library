'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAccountAuth } from '../../contexts/AccountAuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  ArrowUpTrayIcon,
  TagIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ darkMode, onToggleDarkMode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAccountAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Quản lý sách', href: '/admin/books', icon: BookOpenIcon },
    { name: 'Bản sách', href: '/admin/book-copies', icon: DocumentDuplicateIcon },
    { name: 'Danh mục', href: '/admin/categories', icon: TagIcon },
    { name: 'Quản lý mượn trả', href: '/admin/borrowings', icon: UserGroupIcon },
    { name: 'Quản lý độc giả', href: '/admin/readers', icon: UserIcon },
    { name: 'Quản lý nhân viên', href: '/admin/staff', icon: UserGroupIcon },
    { name: 'Scanner', href: '/admin/scanner', icon: QrCodeIcon },
    { name: 'Import/Export', href: '/admin/import-export', icon: ArrowUpTrayIcon },
  ];

  const userNavigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Sách', href: '/books', icon: BookOpenIcon },
    { name: 'Mượn trả', href: '/borrowings', icon: ClipboardDocumentListIcon },
    { name: 'Hồ sơ', href: '/profile', icon: UserIcon },
  ];

  let navigation = userNavigation;
  if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
    navigation = adminNavigation;
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white dark:lg:bg-neutral-900 lg:border-r lg:border-sage-200 dark:lg:border-sage-700">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sage-200 dark:border-sage-700">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-400 transition-colors duration-200">
              <BuildingLibraryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                Sage-Librarian
              </h1>
              <p className="text-xs text-sage-600 dark:text-sage-400">
                Hệ thống quản lý thư viện
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 shadow-sm'
                      : 'text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-800 hover:text-sage-700 dark:hover:text-sage-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-sage-600 dark:text-sage-400' : 'text-sage-500 dark:text-sage-500'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="w-1 h-5 bg-sage-600 dark:bg-sage-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 border-t border-sage-200 dark:border-sage-700">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-sage-50 dark:bg-sage-800">
            <div className="w-9 h-9 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sage-900 dark:text-sage-100 truncate">
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-xs text-sage-600 dark:text-sage-400 truncate">
                {user?.email || 'admin@library.com'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-2 space-x-1">
            <button
              onClick={onToggleDarkMode}
              className="flex-1 flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs font-medium text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors duration-200"
            >
              {darkMode ? (
                <>
                  <SunIcon className="w-3.5 h-3.5" />
                  <span>Sáng</span>
                </>
              ) : (
                <>
                  <MoonIcon className="w-3.5 h-3.5" />
                  <span>Tối</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center">
              <BuildingLibraryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sage-900 dark:text-sage-100">
                Sage-Librarian
              </h1>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-strong transform transition-transform duration-300 ease-in-out">
            {/* Mobile Header */}
            <div className="mobile-header">
              <h2 className="mobile-header-title">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="mobile-header-close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="mobile-footer">
              <div className="mobile-user-info">
                <div className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sage-900 dark:text-sage-100 truncate">
                    {user?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-sage-600 dark:text-sage-400 truncate">
                    {user?.email || 'admin@library.com'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Spacing */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navigation; 