'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  TagIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Sách', href: '/books', icon: BookOpenIcon },
    { name: 'Quản lý', href: '/admin', icon: CogIcon },
    { name: 'Báo cáo', href: '/admin/reports', icon: ChartBarIcon },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Quản lý sách', href: '/admin/books', icon: BookOpenIcon },
    { name: 'Danh mục', href: '/admin/categories', icon: TagIcon },
    { name: 'Quản lý mượn trả', href: '/admin/borrowings', icon: UserGroupIcon },
    { name: 'Quản lý độc giả', href: '/admin/readers', icon: UserIcon },
    { name: 'Quản lý nhân viên', href: '/admin/staff', icon: UserGroupIcon },
    { name: 'Scanner', href: '/admin/scanner', icon: QrCodeIcon },
    { name: 'Import/Export', href: '/admin/import-export', icon: ArrowUpTrayIcon },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const currentNavigation = pathname.startsWith('/admin') ? adminNavigation : navigation;

  return (
    <>
      <nav className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-sage-200 dark:border-sage-700 sticky top-0 z-40 safe-area-top shadow-soft">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <BuildingLibraryIcon className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-serif font-bold text-sage-900 dark:text-sage-100">
                    Sage-Librarian
                  </h1>
                  <p className="text-xs text-sage-600 dark:text-sage-400">
                    Hệ thống quản lý thư viện
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-serif font-bold text-sage-900 dark:text-sage-100">
                    Sage
                  </h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    isActive(item.href)
                      ? 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 shadow-soft'
                      : 'text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-800 hover:text-sage-700 dark:hover:text-sage-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {/* User menu - hidden on mobile */}
              <div className="hidden sm:block">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200 min-h-[44px]">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200 min-h-[44px] min-w-[44px]"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="mobile-nav">
          <div 
            className="mobile-nav-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className={`mobile-nav-content ${isOpen ? 'open' : 'closed'}`}>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="mobile-header">
                <h2 className="mobile-header-title">
                  Menu
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mobile-header-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {currentNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="mobile-footer">
                {/* User info */}
                <div className="mobile-user-info">
                  <UserIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                  <div>
                    <p className="text-sm font-medium text-sage-900 dark:text-sage-100">Admin</p>
                    <p className="text-xs text-sage-600 dark:text-sage-400">Quản trị viên</p>
                  </div>
                </div>
                
                {/* Logout option */}
                <button className="mobile-logout-btn">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation; 