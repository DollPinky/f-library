'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBooks } from '../../hooks/useBooksApi';
import RealTimeSearch from '../../components/ui/RealTimeSearch';
import BookCard from '../../components/ui/BookCard';
import DetailDrawer from '../../components/ui/DetailDrawer';
import ActionButton from '../../components/ui/ActionButton';
import NotificationToast from '../../components/ui/NotificationToast';
import Pagination from '../../components/ui/Pagination';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  BookmarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const BooksPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    books,
    pagination,
    loading,
    error,
    loadBooks,
    refreshBooks,
    updateFilters,
    clearAllCache,
    getCacheStatistics,
    healthCheck
  } = useBooks();

  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState(null);
  const [serviceHealth, setServiceHealth] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || searchParams.get('query') || '',
    status: searchParams.get('status') || '',
    libraryId: searchParams.get('libraryId') || '',
    categoryId: searchParams.get('categoryId') || '',
    sortBy: searchParams.get('sortBy') || 'title',
    sortDirection: searchParams.get('sortDirection') || 'ASC'
  });

  const handleRealTimeSearch = async (searchTerm) => {
    setSearchLoading(true);
    try {
      // Implement real-time search logic here
      const results = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm)
      );
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    updateFilters(newFilters);
    router.push(`/books?search=${searchTerm}`);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    router.push(`/books?${params.toString()}`);
  };

  const handleSort = (field) => {
    const newDirection = filters.sortBy === field && filters.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    handleFilterChange('sortBy', field);
    handleFilterChange('sortDirection', newDirection);
  };

  const handlePageChange = (newPage) => {
    loadBooks({ ...filters, page: newPage - 1 });
  };

  const handleBorrowBook = async (book) => {
    try {
      // Implement borrow logic here
      showNotification(`Đã mượn sách: ${book.title}`, 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi mượn sách', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    loadBooks(filters);
    
    const loadSystemInfo = async () => {
      try {
        const [stats, health] = await Promise.all([
          getCacheStatistics(),
          healthCheck()
        ]);
        setCacheStats(stats);
        setServiceHealth(health.healthy);
      } catch (error) {
        console.error('Error loading system info:', error);
        setServiceHealth(false);
      }
    };
    
    loadSystemInfo();
  }, []);

  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
    }
  }, [error]);

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              {/* Header Skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-sage-200 dark:bg-sage-700 rounded w-1/3"></div>
                <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/2"></div>
              </div>
              
              {/* Search Skeleton */}
              <div className="h-16 bg-sage-200 dark:bg-sage-700 rounded-xl"></div>
              
              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-sage-200 dark:border-sage-700">
                    <div className="h-48 bg-sage-200 dark:bg-sage-700 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-sage-200 dark:bg-sage-700 rounded"></div>
                      <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-2/3"></div>
                      <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Khám phá sách
                </h1>
                <p className="text-sage-600 dark:text-sage-400 text-sm sm:text-base">
                  Tìm kiếm và khám phá kho tàng tri thức của chúng tôi
                </p>
              </div>
              
              {/* System Status & Cache */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* System Status */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  serviceHealth 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    serviceHealth ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs sm:text-sm font-medium">
                    {serviceHealth ? 'Hệ thống hoạt động bình thường' : 'Hệ thống gặp sự cố'}
                  </span>
                </div>
                
                {/* Cache Info */}
                {cacheStats && (
                  <div className="text-xs sm:text-sm text-sage-600 dark:text-sage-400">
                    Cache hit rate: {((cacheStats.hitRate || 0) * 100).toFixed(1)}%
                  </div>
                )}
                
                {/* Clear Cache Button */}
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await clearAllCache();
                      showNotification('Đã xóa tất cả cache', 'success');
                      refreshBooks();
                    } catch (error) {
                      showNotification('Lỗi khi xóa cache', 'error');
                    }
                  }}
                  className="min-h-[44px] min-w-[44px]"
                >
                  Xóa Cache
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-0">
                    <RealTimeSearch
                      onSearch={handleRealTimeSearch}
                      searchResults={searchResults}
                      loading={searchLoading}
                      placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
                      className="w-full"
                    />
                  </div>
                  
                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center space-x-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200 px-4 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 min-h-[44px] whitespace-nowrap"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Bộ lọc</span>
                  </button>
                  
                  {/* Clear Filters */}
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const resetFilters = {
                        search: '',
                        status: '',
                        libraryId: '',
                        categoryId: '',
                        sortBy: 'title',
                        sortDirection: 'ASC'
                      };
                      setFilters(resetFilters);
                      updateFilters(resetFilters);
                      router.push('/books');
                    }}
                    className="min-h-[44px] whitespace-nowrap"
                  >
                    Xóa bộ lọc
                  </ActionButton>
                </div>
                
                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-sage-200 dark:border-sage-700">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        <option value="">Tất cả</option>
                        <option value="AVAILABLE">Có sẵn</option>
                        <option value="BORROWED">Đã mượn</option>
                        <option value="RESERVED">Đã đặt</option>
                        <option value="LOST">Mất</option>
                        <option value="DAMAGED">Hỏng</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                        Sắp xếp theo
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        <option value="title">Tên sách</option>
                        <option value="author">Tác giả</option>
                        <option value="publisher">Nhà xuất bản</option>
                        <option value="year">Năm xuất bản</option>
                        <option value="isbn">ISBN</option>
                        <option value="createdAt">Ngày tạo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                        Thứ tự
                      </label>
                      <select
                        value={filters.sortDirection}
                        onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                        className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        <option value="ASC">Tăng dần</option>
                        <option value="DESC">Giảm dần</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <ActionButton
                        variant="outline"
                        onClick={() => setShowFilters(false)}
                        className="w-full min-h-[44px]"
                      >
                        Ẩn bộ lọc
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="space-y-6">
            {books.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6 text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-sage-900 dark:text-sage-100 mb-2">
                  Không tìm thấy sách
                </h3>
                <p className="text-sage-600 dark:text-sage-400 text-sm sm:text-base">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onViewDetails={() => {
                        setSelectedBook(book);
                        setIsDrawerOpen(true);
                      }}
                      onBorrow={() => handleBorrowBook(book)}
                      className="h-full"
                    />
                  ))}
                </div>
                
                {/* Pagination - Always visible */}
                {pagination && pagination.totalElements > 0 && (
                  <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                    <Pagination
                      currentPage={pagination.page + 1}
                      totalPages={pagination.totalPages}
                      total={pagination.totalElements}
                      from={pagination.page * pagination.size + 1}
                      to={Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
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
          <div className="space-y-6">
            {/* Book Info */}
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-10 h-10 text-sage-600 dark:text-sage-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2">
                    {selectedBook.title}
                  </h3>
                  <p className="text-sage-600 dark:text-sage-400 text-sm sm:text-base">
                    Tác giả: {selectedBook.author || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedBook.author || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Nhà xuất bản</label>
                    <p className="text-sage-900 dark:text-sage-100">{selectedBook.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Năm xuất bản</label>
                    <p className="text-sage-900 dark:text-sage-100">{selectedBook.year || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono">{selectedBook.isbn || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Danh mục</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.category?.name || 'Chưa phân loại'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.updatedAt ? new Date(selectedBook.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Mô tả</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Copies */}
            <div>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-sage-900 dark:text-sage-100 mb-4">
                Các bản sách ({selectedBook.bookCopies?.length || 0})
              </h4>
              <div className="space-y-3">
                {selectedBook.bookCopies?.map((copy, index) => (
                  <div key={index} className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">QR Code</label>
                        <p className="text-sage-900 dark:text-sage-100 font-mono text-xs sm:text-sm">{copy.qrCode || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          copy.status === 'AVAILABLE' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : copy.status === 'BORROWED'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {copy.status === 'AVAILABLE' ? 'Có sẵn' : 
                           copy.status === 'BORROWED' ? 'Đã mượn' : 'Bảo trì'}
                        </span>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Vị trí</label>
                        <p className="text-sage-900 dark:text-sage-100">{copy.shelfLocation || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
              <ActionButton
                variant="primary"
                onClick={() => handleBorrowBook(selectedBook)}
                className="w-full sm:w-auto"
              >
                <BookmarkIcon className="w-4 h-4 mr-2" />
                Mượn sách
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => router.push(`/admin/books/${selectedBook.id}/edit`)}
                className="w-full sm:w-auto"
              >
                Chỉnh sửa
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full sm:w-auto"
              >
                Đóng
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

export default BooksPage; 