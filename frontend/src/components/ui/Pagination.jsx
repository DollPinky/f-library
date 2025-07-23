import React from 'react';
import ActionButton from './ActionButton';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  total, 
  from, 
  to, 
  onPageChange,
  className = '' 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Info */}
      <div className="text-xs sm:text-sm text-sage-600 dark:text-sage-400">
        Hiển thị {from} đến {to} trong tổng số {total} bản ghi
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <ActionButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="min-h-[44px] min-w-[44px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </ActionButton>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sage-500 dark:text-sage-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${
                    page === currentPage
                      ? 'bg-sage-600 text-white'
                      : 'text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Button */}
        <ActionButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="min-h-[44px] min-w-[44px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </ActionButton>
      </div>
    </div>
  );
};

export default Pagination; 