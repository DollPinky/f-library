'use client';

import React, { useState } from 'react';
import { useAccountAuth } from '../../../contexts/AccountAuthContext';
import { useRouter } from 'next/navigation';
import StaffTab from './staff/page';
import LibrarianTab from './librarian/page';

const AccountsManagementPage = () => {
  const { user, isAuthenticated, loading } = useAccountAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('staff'); // Default to staff tab

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-sage-600 dark:text-sage-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sage-900 dark:text-sage-100">
            Quản lý tài khoản
          </h1>
          <p className="text-sage-600 dark:text-sage-400 mt-1">
            Quản lý nhân viên và nhân viên thư viện trong hệ thống
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-sage-200 dark:border-sage-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' 
              ? 'border-sage-500 text-sage-600 dark:text-sage-300' 
              : 'border-transparent text-sage-500 hover:text-sage-700 hover:border-sage-300 dark:text-sage-400 dark:hover:text-sage-300'}`}
          >
            Nhân viên
          </button>
          <button
            onClick={() => setActiveTab('librarian')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'librarian' 
              ? 'border-sage-500 text-sage-600 dark:text-sage-300' 
              : 'border-transparent text-sage-500 hover:text-sage-700 hover:border-sage-300 dark:text-sage-400 dark:hover:text-sage-300'}`}
          >
            Nhân viên thư viện
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'librarian' && <LibrarianTab />}
      </div>
    </div>
  );
};

export default AccountsManagementPage;
