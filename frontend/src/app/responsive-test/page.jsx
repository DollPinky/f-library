'use client';

import React, { useState } from 'react';
import StatisticCard from '../../components/ui/StatisticCard';
import ActionButton from '../../components/ui/ActionButton';
import DetailDrawer from '../../components/ui/DetailDrawer';

const ResponsiveTestPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="section-padding">
        <div className="container-responsive">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-responsive-h1 font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Responsive Design Test
            </h1>
            <p className="text-sage-600 dark:text-sage-400 text-responsive-body">
              Trang test để kiểm tra responsive design trên các thiết bị khác nhau
            </p>
          </div>

          {/* Responsive Grid Test */}
          <div className="space-responsive">
            <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
              Responsive Grid System
            </h2>
            
            {/* 4-column grid */}
            <div className="grid-responsive">
              <StatisticCard
                title="Tổng số sách"
                value={1234}
                change="+12.5%"
                changeType="positive"
                icon={icons.books}
                className="card-responsive"
              />
              
              <StatisticCard
                title="Độc giả hoạt động"
                value={567}
                change="+8.2%"
                changeType="positive"
                icon={icons.readers}
                className="card-responsive"
              />
              
              <StatisticCard
                title="Sách đang mượn"
                value={892}
                change="+5.7%"
                changeType="positive"
                icon={icons.borrowings}
                className="card-responsive"
              />
              
              <StatisticCard
                title="Chi nhánh"
                value={15}
                change="+2.1%"
                changeType="positive"
                icon={icons.libraries}
                className="card-responsive"
              />
            </div>

            {/* 2-column grid */}
            <div className="grid-responsive-2">
              <div className="card-responsive">
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Card 1 - 2 Column Grid
                </h3>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Đây là card đầu tiên trong grid 2 cột. Trên mobile sẽ hiển thị 1 cột, trên tablet và desktop sẽ hiển thị 2 cột.
                </p>
              </div>
              
              <div className="card-responsive">
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Card 2 - 2 Column Grid
                </h3>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Đây là card thứ hai trong grid 2 cột. Responsive design sẽ tự động điều chỉnh layout.
                </p>
              </div>
            </div>

            {/* 3-column grid */}
            <div className="grid-responsive-3">
              <div className="card-responsive">
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Card 1 - 3 Column Grid
                </h3>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Mobile: 1 cột, Tablet: 2 cột, Desktop: 3 cột
                </p>
              </div>
              
              <div className="card-responsive">
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Card 2 - 3 Column Grid
                </h3>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Responsive breakpoints: sm, md, lg, xl
                </p>
              </div>
              
              <div className="card-responsive">
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Card 3 - 3 Column Grid
                </h3>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Touch-friendly buttons và spacing
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Buttons Test */}
          <div className="space-responsive">
            <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
              Responsive Buttons
            </h2>
            
            <div className="card-responsive">
              <div className="space-y-4">
                <div className="actions-responsive">
                  <ActionButton variant="primary" size="sm" className="action-button-responsive">
                    Small Button
                  </ActionButton>
                  <ActionButton variant="secondary" size="md" className="action-button-responsive">
                    Medium Button
                  </ActionButton>
                  <ActionButton variant="outline" size="lg" className="action-button-responsive">
                    Large Button
                  </ActionButton>
                </div>
                
                <div className="actions-responsive">
                  <ActionButton variant="danger" className="action-button-responsive">
                    Danger Button
                  </ActionButton>
                  <ActionButton variant="success" className="action-button-responsive">
                    Success Button
                  </ActionButton>
                  <ActionButton variant="warning" className="action-button-responsive">
                    Warning Button
                  </ActionButton>
                </div>
                
                <div className="actions-responsive">
                  <ActionButton 
                    variant="primary" 
                    className="action-button-responsive"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    Open Drawer
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Text Test */}
          <div className="space-responsive">
            <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
              Responsive Typography
            </h2>
            
            <div className="card-responsive space-responsive">
              <div>
                <h1 className="text-responsive-h1 font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Heading 1 - Responsive
                </h1>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Text responsive body - Mobile: 14px, Desktop: 16px
                </p>
              </div>
              
              <div>
                <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100 mb-2">
                  Heading 2 - Responsive
                </h2>
                <p className="text-responsive-body text-sage-600 dark:text-sage-400">
                  Text responsive body - Mobile: 14px, Desktop: 16px
                </p>
              </div>
              
              <div>
                <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-2">
                  Heading 3 - Responsive
                </h3>
                <p className="text-responsive-small text-sage-600 dark:text-sage-400">
                  Text responsive small - Mobile: 12px, Desktop: 14px
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Spacing Test */}
          <div className="space-responsive">
            <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
              Responsive Spacing
            </h2>
            
            <div className="card-responsive">
              <div className="space-responsive">
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <p className="text-responsive-body text-sage-700 dark:text-sage-300">
                    Space responsive - Mobile: 16px, Desktop: 24px
                  </p>
                </div>
                
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <p className="text-responsive-body text-sage-700 dark:text-sage-300">
                    Space responsive - Mobile: 16px, Desktop: 24px
                  </p>
                </div>
                
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <p className="text-responsive-body text-sage-700 dark:text-sage-300">
                    Space responsive - Mobile: 16px, Desktop: 24px
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="space-responsive">
            <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">
              Device Information
            </h2>
            
            <div className="card-responsive">
              <div className="grid-responsive-3">
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sage-900 dark:text-sage-100 mb-2">Mobile</h4>
                  <p className="text-responsive-small text-sage-600 dark:text-sage-400">
                    &lt; 640px - 1 cột grid
                  </p>
                </div>
                
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sage-900 dark:text-sage-100 mb-2">Tablet</h4>
                  <p className="text-responsive-small text-sage-600 dark:text-sage-400">
                    640px - 1024px - 2-3 cột grid
                  </p>
                </div>
                
                <div className="bg-sage-100 dark:bg-sage-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sage-900 dark:text-sage-100 mb-2">Desktop</h4>
                  <p className="text-responsive-small text-sage-600 dark:text-sage-400">
                    &gt; 1024px - 3-4 cột grid
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Responsive Drawer Test"
      >
        <div className="space-responsive">
          <div>
            <h3 className="text-responsive-h3 font-semibold text-sage-900 dark:text-sage-100 mb-2">
              Responsive Drawer
            </h3>
            <p className="text-responsive-body text-sage-600 dark:text-sage-400">
              Drawer này sẽ responsive trên mobile và desktop. Trên mobile sẽ chiếm toàn bộ màn hình, trên desktop sẽ có width cố định.
            </p>
          </div>

          <div>
            <h4 className="text-responsive-h3 font-medium text-sage-900 dark:text-sage-100 mb-3">
              Responsive Features
            </h4>
            <div className="space-y-2 text-responsive-small text-sage-600 dark:text-sage-400">
              <p>• Mobile: Full width drawer</p>
              <p>• Tablet: 384px width</p>
              <p>• Desktop: 500px width</p>
              <p>• Touch-friendly buttons</p>
              <p>• Responsive typography</p>
              <p>• Safe area support</p>
            </div>
          </div>

          <div className="actions-responsive pt-4">
            <ActionButton variant="primary" className="action-button-responsive">
              Primary Action
            </ActionButton>
            <ActionButton variant="outline" className="action-button-responsive">
              Secondary Action
            </ActionButton>
          </div>
        </div>
      </DetailDrawer>
    </div>
  );
};

export default ResponsiveTestPage; 