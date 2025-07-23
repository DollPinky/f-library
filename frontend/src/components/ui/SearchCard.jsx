import React, { useState } from 'react';
import ActionButton from './ActionButton';

const SearchCard = ({ onSearch, filters = [], placeholder = "Tìm kiếm...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSearch = () => {
    onSearch({ searchTerm, filters: selectedFilters });
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="block w-full pl-10 pr-3 py-2 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder={placeholder}
            />
          </div>
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <div key={filter.key} className="min-w-[150px]">
                <select
                  value={selectedFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="block w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Search Button */}
        <div className="flex gap-2">
          <ActionButton
            variant="primary"
            onClick={handleSearch}
            className="whitespace-nowrap"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm kiếm
          </ActionButton>
          
          <ActionButton
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedFilters({});
              onSearch({ searchTerm: '', filters: {} });
            }}
          >
            Xóa
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default SearchCard; 