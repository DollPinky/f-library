'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const FilterBar = ({ onFilterChange, onSearch, filters, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'RESERVED', label: 'Đã đặt' },
    { value: 'PENDING_LIBRARIAN', label: 'Chờ xác nhận' },
    { value: 'BORROWED', label: 'Đang mượn' },
    { value: 'RETURNED', label: 'Đã trả' },
    { value: 'LOST', label: 'Đã mất' },
  ];

  const sortOptions = [
    { value: 'createdAt,desc', label: 'Mới nhất' },
    { value: 'createdAt,asc', label: 'Cũ nhất' },
    { value: 'dueDate,asc', label: 'Hạn trả gần nhất' },
    { value: 'dueDate,desc', label: 'Hạn trả xa nhất' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      sortBy: 'createdAt,desc',
      page: 0
    });
  };

  const hasActiveFilters = filters.status || filters.sortBy !== 'createdAt,desc';

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách, tác giả, người mượn..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
            hasActiveFilters
              ? 'bg-sage-600 text-white border-sage-600 hover:bg-sage-700'
              : 'bg-sage-50 dark:bg-sage-800 text-sage-700 dark:text-sage-300 border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700'
          }`}
        >
          <FunnelIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Bộ lọc</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="border-t border-sage-200 dark:border-sage-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Sắp xếp
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                  hasActiveFilters
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30'
                    : 'bg-sage-50 text-sage-400 border-sage-200 dark:bg-sage-800 dark:text-sage-500 dark:border-sage-700 cursor-not-allowed'
                }`}
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 