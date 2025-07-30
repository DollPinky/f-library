'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  DocumentDuplicateIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ darkMode, onToggleDarkMode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAccountAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isLibrarian = user?.role === 'LIBRARIAN';
  const isAdmin = user?.role === 'ADMIN';

  const librarianNavigation = [
    { name: 'Dashboard', href: '/librarian', icon: ChartBarIcon },
    { name: 'Đang mượn', href: '/librarian/borrowed', icon: BookOpenIcon },
    { name: 'Chờ trả', href: '/librarian/pending', icon: ClockIcon },
    { name: 'Tất cả', href: '/librarian/all', icon: DocumentTextIcon },
    { name: 'Tìm kiếm', href: '/librarian/search', icon: MagnifyingGlassIcon },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Quản lý sách', href: '/admin/books', icon: BookOpenIcon },
    { name: 'Bản sách', href: '/admin/book-copies', icon: DocumentDuplicateIcon },
    { name: 'Danh mục', href: '/admin/categories', icon: TagIcon },
    { name: 'Quản lý độc giả', href: '/admin/readers', icon: UserIcon },
    { name: 'Quản lý nhân viên', href: '/admin/staff', icon: UserGroupIcon },
    { name: 'Scanner', href: '/admin/scanner', icon: QrCodeIcon },
    { name: 'Import/Export', href: '/admin/import-export', icon: ArrowUpTrayIcon },
  ];

  // User navigation
  const userNavigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Sách', href: '/books', icon: BookOpenIcon },
    { name: 'Hồ sơ', href: '/profile', icon: UserIcon },
  ];

  // Determine which navigation to show
  const getNavigationItems = () => {
    if (isLibrarian) {
      return librarianNavigation;
    } else if (isAdmin) {
      return adminNavigation;
    } else {
      return userNavigation;
    }
  };

  const navigationItems = getNavigationItems();

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

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const navItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <motion.div 
        className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white dark:lg:bg-neutral-900 lg:border-r lg:border-sage-200 dark:lg:border-sage-700"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Section */}
        <motion.div 
          className="flex items-center justify-between h-16 px-4 border-b border-sage-200 dark:border-sage-700"
          variants={navItemVariants}
        >
          <motion.div
            variants={logoVariants}
            whileHover="hover"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-9 h-9 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-400 transition-colors duration-200"
                variants={iconVariants}
                whileHover="hover"
              >
                <BuildingLibraryIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                  Sage-Librarian
                </h1>
                <p className="text-xs text-sage-600 dark:text-sage-400">
                  Hệ thống quản lý thư viện
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <motion.div 
            className="space-y-1"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.name}
                  variants={navItemVariants}
                  custom={index}
                >
                  <Link
                    href={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-sage-600 dark:bg-sage-500 rounded-r"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </nav>

        {/* User Profile Section */}
        <motion.div 
          className="p-4 border-t border-sage-200 dark:border-sage-700"
          variants={navItemVariants}
        >
          <div className="user-info">
            <motion.div 
              className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center"
              variants={iconVariants}
              whileHover="hover"
            >
              <UserIcon className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sage-900 dark:text-sage-100 truncate">
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-xs text-sage-600 dark:text-sage-400 truncate">
                {user?.email || 'admin@library.com'}
              </p>
            </div>
          </div>
          
          <div className="user-actions">
            <motion.button
              onClick={onToggleDarkMode}
              className="user-action-btn flex items-center justify-center"
              aria-label={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
              variants={iconVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SunIcon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoonIcon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              onClick={handleLogout}
              className="user-action-btn flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
              aria-label="Đăng xuất"
              variants={iconVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Top Navigation */}
      <motion.div 
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <motion.div
            variants={logoVariants}
            whileHover="hover"
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-9 h-9 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center"
                variants={iconVariants}
                whileHover="hover"
              >
                <BuildingLibraryIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-sage-900 dark:text-sage-100">
                  Sage-Librarian
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SunIcon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoonIcon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bars3Icon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMobileMenu}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            
            {/* Mobile Menu */}
            <motion.div 
              className="fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-strong"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Mobile Header */}
              <motion.div 
                className="mobile-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="mobile-header-title">Menu</h2>
                <motion.button
                  onClick={closeMobileMenu}
                  className="mobile-header-close flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <motion.div 
                  className="space-y-1"
                  initial="hidden"
                  animate="visible"
                  variants={sidebarVariants}
                >
                  {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.name}
                        variants={navItemVariants}
                        custom={index}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                          <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <span>{item.name}</span>
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-0 bottom-0 w-1 bg-sage-600 dark:bg-sage-500 rounded-r"
                              layoutId="mobileActiveIndicator"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </nav>

              {/* Mobile Footer */}
              <motion.div 
                className="mobile-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mobile-user-info">
                  <motion.div 
                    className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <UserIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sage-900 dark:text-sage-100 truncate">
                      {user?.fullName || 'Admin User'}
                    </p>
                    <p className="text-xs text-sage-600 dark:text-sage-400 truncate">
                      {user?.email || 'admin@library.com'}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Top Spacing */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navigation;