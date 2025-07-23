'use client';

import React, { useState } from 'react';
import StatisticCard from '../components/ui/StatisticCard';
import SearchCard from '../components/ui/SearchCard';
import TableView from '../components/ui/TableView';
import DetailDrawer from '../components/ui/DetailDrawer';
import ActionButton from '../components/ui/ActionButton';
import NotificationToast from '../components/ui/NotificationToast';
import useDashboardData from '../hooks/useDashboardData';

const Dashboard = () => {
  const { dashboardStats, recentBooks, loading, error, refreshData } = useDashboardData();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const icons = {
    books: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    readers: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    borrowings: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    libraries: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  };

  const bookColumns = [
    {
      key: 'title',
      header: 'Tên sách',
      render: (value, row) => (
        <div className="font-medium text-sage-900 dark:text-sage-100 text-responsive-body">
          {value}
        </div>
      )
    },
    {
      key: 'author',
      header: 'Tác giả',
      render: (value) => (
        <div className="text-sage-600 dark:text-sage-400 text-responsive-small">
          {value}
        </div>
      )
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: (value, row) => (
        <div className="text-sage-600 dark:text-sage-400 text-responsive-small">
          {row.category?.name || 'N/A'}
        </div>
      )
    },
    {
      key: 'bookCopies',
      header: 'Số bản',
      render: (value) => (
        <div className="text-sage-600 dark:text-sage-400 text-responsive-small">
          {value?.length || 0}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (value, row) => (
        <ActionButton
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedBook(row);
            setIsDrawerOpen(true);
          }}
          className="action-button-responsive"
        >
          Chi tiết
        </ActionButton>
      )
    }
  ];

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleFilterChange = (filterType, value) => {
    console.log('Filter changed:', filterType, value);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 section-padding">
        <div className="container-responsive">
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-600 dark:text-red-400 text-lg mb-4">
              {error}
            </div>
            <ActionButton onClick={refreshData}>
              Thử lại
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      {/* Main Content */}
      <div className="section-padding">
        <div className="container-responsive">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-responsive-h1 font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Dashboard Thư Viện
            </h1>
            <p className="text-sage-600 dark:text-sage-400 text-responsive-body">
              Tổng quan hệ thống quản lý thư viện
            </p>
          </div>

          {/* Statistics Grid - Responsive Layout */}
          <div className="grid-responsive mb-6 sm:mb-8">
            <StatisticCard
              title="Tổng số sách"
              value={dashboardStats?.totalBooks || 0}
              change="+12.5%"
              changeType="positive"
              icon={icons.books}
              className="card-responsive"
            />
            
            <StatisticCard
              title="Độc giả hoạt động"
              value={dashboardStats?.totalReaders || 0}
              change="+8.2%"
              changeType="positive"
              icon={icons.readers}
              className="card-responsive"
            />
            
            <StatisticCard
              title="Sách đang mượn"
              value={dashboardStats?.activeBorrowings || 892}
              change="+5.7%"
              changeType="positive"
              icon={icons.borrowings}
              className="card-responsive"
            />
            
            <StatisticCard
              title="Chi nhánh"
              value={dashboardStats?.totalLibraries || 0}
              change="+2.1%"
              changeType="positive"
              icon={icons.libraries}
              className="card-responsive"
            />
          </div>

          {/* Search Section - Full Width */}
          <div className="mb-6 sm:mb-8">
            <SearchCard
              onSearch={handleSearch}
              filters={[
                {
                  key: 'status',
                  label: 'Trạng thái',
                  options: [
                    { value: 'available', label: 'Có sẵn' },
                    { value: 'borrowed', label: 'Đã mượn' },
                    { value: 'reserved', label: 'Đã đặt' }
                  ]
                },
                {
                  key: 'category',
                  label: 'Danh mục',
                  options: [
                    { value: 'technology', label: 'Công nghệ' },
                    { value: 'literature', label: 'Văn học' },
                    { value: 'science', label: 'Khoa học' }
                  ]
                }
              ]}
              placeholder="Tìm kiếm sách..."
              className="card-responsive"
            />
          </div>

          {/* Recent Books Table - Full Width */}
          <div className="space-responsive">
            <div className="card-responsive">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
                  Sách mới nhất
                </h2>
                <ActionButton variant="outline" size="sm">
                  Xem tất cả
                </ActionButton>
              </div>
              
              <div className="table-responsive">
                <TableView
                  data={recentBooks}
                  columns={bookColumns}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Chi tiết sách"
      >
        {selectedBook && (
          <div className="space-responsive">
            <div>
              <h3 className="text-responsive-h3 font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2">
                {selectedBook.title}
              </h3>
              <div className="space-y-2 text-responsive-body">
                <p className="text-sage-600 dark:text-sage-400">
                  Tác giả: {selectedBook.author}
                </p>
                <p className="text-sage-600 dark:text-sage-400">
                  Nhà xuất bản: {selectedBook.publisher}
                </p>
                <p className="text-sage-600 dark:text-sage-400">
                  Năm xuất bản: {selectedBook.year}
                </p>
                <p className="text-sage-600 dark:text-sage-400">
                  ISBN: {selectedBook.isbn}
                </p>
                {selectedBook.category && (
                  <p className="text-sage-600 dark:text-sage-400">
                    Danh mục: {selectedBook.category.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-responsive-h3 font-medium text-sage-900 dark:text-sage-100 mb-3">
                Các bản sách
              </h4>
              <div className="space-y-2">
                {selectedBook.bookCopies?.map((copy, index) => (
                  <div key={index} className="p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg">
                    <div className="space-y-1 text-responsive-small">
                      <p className="text-sage-700 dark:text-sage-300">
                        QR Code: {copy.qrCode}
                      </p>
                      <p className="text-sage-600 dark:text-sage-400">
                        Trạng thái: {copy.status}
                      </p>
                      <p className="text-sage-600 dark:text-sage-400">
                        Vị trí: {copy.shelfLocation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="actions-responsive pt-4">
              <ActionButton variant="primary" className="action-button-responsive">
                Mượn sách
              </ActionButton>
              <ActionButton variant="outline" className="action-button-responsive">
                Chỉnh sửa
              </ActionButton>
            </div>
          </div>
        )}
      </DetailDrawer>

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

export default Dashboard; 