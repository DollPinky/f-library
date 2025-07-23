'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '../../../hooks/useBooksApi';
import SearchCard from '../../../components/ui/SearchCard';
import TableView from '../../../components/ui/TableView';
import DetailDrawer from '../../../components/ui/DetailDrawer';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminBooksPage = () => {
  const router = useRouter();
  
  const {
    books,
    pagination,
    loading,
    error,
    loadBooks,
    refreshBooks,
    updateFilters,
    deleteBook
  } = useBooks();

  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    library: '',
    category: ''
  });

  const bookColumns = [
    {
      key: 'title',
      header: 'Tên sách',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpenIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sage-900 dark:text-sage-100 line-clamp-1">
              {value}
            </div>
            <div className="text-sm text-sage-500 dark:text-sage-400 line-clamp-1">
              ISBN: {row.isbn || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'author',
      header: 'Tác giả',
      render: (value) => (
        <div className="text-sage-700 dark:text-sage-300 font-medium line-clamp-1">
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: 'publisher',
      header: 'Nhà xuất bản',
      render: (value) => (
        <div className="text-sage-600 dark:text-sage-400 line-clamp-1">
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: 'publicationYear',
      header: 'Năm xuất bản',
      render: (value) => (
        <div className="text-sage-600 dark:text-sage-400">
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: (value, row) => (
        <div className="text-sage-600 dark:text-sage-400 line-clamp-1">
          {row.category?.name || 'Chưa phân loại'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value, row) => {
        const availableCopies = row.bookCopies?.filter(copy => copy.status === 'AVAILABLE').length || 0;
        const totalCopies = row.bookCopies?.length || 0;
        
        let statusText, statusColor;
        if (availableCopies > 0) {
          statusText = `Có sẵn (${availableCopies}/${totalCopies})`;
          statusColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
        } else if (totalCopies > 0) {
          statusText = `Đã mượn (${totalCopies}/${totalCopies})`;
          statusColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
        } else {
          statusText = 'Hết sách (0/0)';
          statusColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusText}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <ActionButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBook(row);
              setIsDrawerOpen(true);
            }}
            className="min-h-[32px] px-2"
          >
            <EyeIcon className="w-4 h-4" />
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/books/${row.id}/edit`);
            }}
            className="min-h-[32px] px-2"
          >
            <PencilIcon className="w-4 h-4" />
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBook(row);
            }}
            className="min-h-[32px] px-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="w-4 h-4" />
          </ActionButton>
        </div>
      )
    }
  ];

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    loadBooks({ ...filters, page: newPage - 1 });
  };

  const handleDeleteBook = async (book) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      try {
        await deleteBook(book.id);
        showNotification('Xóa sách thành công', 'success');
        refreshBooks();
      } catch (error) {
        showNotification('Lỗi khi xóa sách', 'error');
      }
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      library: '',
      category: ''
    };
    setFilters(clearedFilters);
    updateFilters(clearedFilters);
  };

  useEffect(() => {
    loadBooks(filters);
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
            <LoadingSkeleton type="card" count={1} className="mb-8" />
            <LoadingSkeleton type="table" count={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      <div className="p-4 sm:p-6 lg:p-6">
        <div className="max-w-none mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Quản lý sách
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý và theo dõi tất cả sách trong hệ thống
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden"
                >
                  <FunnelIcon className="w-4 h-4 mr-1" />
                  Lọc
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={() => router.push('/admin/books/create')}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm sách mới</span>
                  <span className="sm:hidden">Thêm</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-sage-400" />
                    </div>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('status', filters.status === 'available' ? '' : 'available')}
                    className={`min-h-[40px] ${filters.status === 'available' ? 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300' : ''}`}
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Có sẵn</span>
                  </ActionButton>
                  
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('status', filters.status === 'borrowed' ? '' : 'borrowed')}
                    className={`min-h-[40px] ${filters.status === 'borrowed' ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300' : ''}`}
                  >
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Đã mượn</span>
                  </ActionButton>
                  
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="min-h-[40px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Xóa lọc</span>
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
            <TableView
              data={books}
              columns={bookColumns}
              loading={loading}
              pagination={{
                currentPage: pagination.page + 1,
                totalPages: pagination.totalPages,
                total: pagination.totalElements,
                from: pagination.page * pagination.size + 1,
                to: Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)
              }}
              onPageChange={handlePageChange}
              onRowClick={(book) => {
                setSelectedBook(book);
                setIsDrawerOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Chi tiết sách"
        size="xl"
      >
        {selectedBook && (
          <div className="space-y-6">
            {/* Book Info */}
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-10 h-10 text-sage-600 dark:text-sage-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2 line-clamp-2">
                    {selectedBook.title}
                  </h3>
                  <p className="text-sage-600 dark:text-sage-400 line-clamp-1">
                    Tác giả: {selectedBook.author || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium line-clamp-1">{selectedBook.author || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Nhà xuất bản</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedBook.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Năm xuất bản</label>
                    <p className="text-sage-900 dark:text-sage-100">{selectedBook.publicationYear || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono line-clamp-1">{selectedBook.isbn || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Danh mục</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">
                      {selectedBook.category?.name || 'Chưa phân loại'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {selectedBook.updatedAt ? new Date(selectedBook.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Mô tả</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-3">
                      {selectedBook.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Copies */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                Các bản sách ({selectedBook.bookCopies?.length || 0})
              </h4>
              <div className="space-y-3">
                {selectedBook.bookCopies?.map((copy, index) => (
                  <div key={index} className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">QR Code</label>
                        <p className="text-sage-900 dark:text-sage-100 font-mono text-sm line-clamp-1">{copy.qrCode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
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
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Vị trí</label>
                        <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{copy.shelfLocation || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                        <p className="text-sage-900 dark:text-sage-100 text-sm">
                          {copy.createdAt ? new Date(copy.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
              <ActionButton
                variant="outline"
                onClick={() => router.push(`/admin/books/${selectedBook.id}/edit`)}
                className="group min-h-[40px]"
              >
                <PencilIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                <span>Chỉnh sửa</span>
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => handleDeleteBook(selectedBook)}
                className="group min-h-[40px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                <span>Xóa</span>
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="min-h-[40px]"
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

export default AdminBooksPage; 