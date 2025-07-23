import React from 'react';
import ActionButton from './ActionButton';

const TableView = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  pagination = null,
  onPageChange,
  onRowClick,
  emptyMessage = "Không có dữ liệu",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/4 mb-4 p-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-sage-200 dark:bg-sage-700 rounded mb-2 mx-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8 text-center ${className}`}>
        <svg className="w-8 h-8 sm:w-12 sm:h-12 text-sage-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sage-600 dark:text-sage-400 text-sm sm:text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-sage-50 dark:bg-sage-900/30">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sage-600 dark:text-sage-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 dark:divide-sage-700">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 sm:px-6 py-4 text-sm text-sage-900 dark:text-sage-100"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Table - Compact */}
      <div className="hidden sm:block lg:hidden overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-sage-50 dark:bg-sage-900/30">
            <tr>
              {columns.slice(0, 4).map((column, index) => (
                <th
                  key={index}
                  className="px-3 py-3 text-left text-xs font-medium text-sage-600 dark:text-sage-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-medium text-sage-600 dark:text-sage-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 dark:divide-sage-700">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.slice(0, 4).map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-4 text-sm text-sage-900 dark:text-sage-100"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td className="px-3 py-4 text-sm text-sage-900 dark:text-sage-100">
                  <div className="flex items-center space-x-2">
                    {columns.slice(4).map((column, colIndex) => (
                      <div key={colIndex}>
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden">
        <div className="p-4 space-y-4">
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4 space-y-3 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => {
                // Skip actions column on mobile if it's the last one
                if (column.key === 'actions' && colIndex === columns.length - 1) {
                  return (
                    <div key={colIndex} className="pt-2 border-t border-sage-200 dark:border-sage-700">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  );
                }
                
                return (
                  <div key={colIndex} className="flex flex-col space-y-1">
                    <span className="text-xs font-medium text-sage-600 dark:text-sage-400 uppercase tracking-wider">
                      {typeof column.header === 'string' ? column.header : column.key}
                    </span>
                    <div className="text-sm text-sage-900 dark:text-sage-100">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-sage-50 dark:bg-sage-900/30 px-4 sm:px-6 py-3 border-t border-sage-200 dark:border-sage-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-sage-600 dark:text-sage-400 text-center sm:text-left">
              Hiển thị {pagination.from} đến {pagination.to} trong tổng số {pagination.total} bản ghi
            </div>
            
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <ActionButton
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="min-h-[32px] px-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </ActionButton>
              
              <span className="text-xs sm:text-sm text-sage-600 dark:text-sage-400 px-2">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <ActionButton
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="min-h-[32px] px-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView; 