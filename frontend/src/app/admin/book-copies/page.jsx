'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import DetailDrawer from '../../../components/ui/DetailDrawer';
import Pagination from '../../../components/ui/Pagination';
import { useBookCopies } from '../../../hooks/useBookCopies';
import { useBookCopyForm } from '../../../hooks/useBookCopyForm';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  BookOpenIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const AdminBookCopiesPage = () => {
  const router = useRouter();
  
  // Hooks
  const {
    bookCopies,
    loading,
    error,
    pagination,
    searchBookCopies,
    createBookCopy,
    updateBookCopy,
    deleteBookCopy,
    changeBookCopyStatus,
    goToPage,
    changePageSize,
    clearError
  } = useBookCopies();

  const {
    formData,
    errors,
    books,
    libraries,
    loadingBooks,
    loadingLibraries,
    updateFormData,
    setFormDataFromBookCopy,
    resetForm,
    validateForm,
    getFormDataForAPI,
    fetchBooks,
    fetchLibraries,
    getBookById,
    getLibraryById,
    getStatusOptions,
    getStatusInfo
  } = useBookCopyForm();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [statusFilter, setStatusFilter] = useState('');

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchBooks();
    fetchLibraries();
    // Load initial data
    searchBookCopies();
  }, [fetchBooks, fetchLibraries, searchBookCopies]);

  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
      clearError();
    }
  }, [error, clearError]);

  // ==================== SEARCH AND FILTER ====================

  const handleSearch = (term) => {
    setSearchTerm(term);
    searchBookCopies({
      query: term,
      status: statusFilter || undefined
    });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    searchBookCopies({
      query: searchTerm,
      status: status || undefined
    });
  };

  // ==================== CRUD OPERATIONS ====================

  const handleCreateCopy = async () => {
    if (!validateForm()) {
      showNotification('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    const result = await createBookCopy(getFormDataForAPI());
    
    if (result.success) {
      setIsCreateModalOpen(false);
      resetForm();
      showNotification('Tạo bản sách thành công', 'success');
    } else {
      showNotification(result.message || 'Có lỗi xảy ra khi tạo bản sách', 'error');
    }
  };

  const handleEditCopy = async () => {
    if (!validateForm()) {
      showNotification('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    const result = await updateBookCopy(selectedCopy.bookCopyId, getFormDataForAPI());
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedCopy(null);
      resetForm();
      showNotification('Cập nhật bản sách thành công', 'success');
    } else {
      showNotification(result.message || 'Có lỗi xảy ra khi cập nhật bản sách', 'error');
    }
  };

  const handleDeleteCopy = async (copy) => {
    if (copy.status === 'BORROWED') {
      showNotification('Không thể xóa bản sách đang được mượn', 'error');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa bản sách "${copy.qrCode}"?`)) {
      const result = await deleteBookCopy(copy.bookCopyId);
      
      if (result.success) {
        showNotification('Xóa bản sách thành công', 'success');
      } else {
        showNotification(result.message || 'Có lỗi xảy ra khi xóa bản sách', 'error');
      }
    }
  };

  // ==================== MODAL HANDLERS ====================

  const openEditModal = (copy) => {
    setSelectedCopy(copy);
    setFormDataFromBookCopy(copy);
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCopy(null);
    resetForm();
  };

  // ==================== UTILITY FUNCTIONS ====================

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const exportQrCodes = (copy) => {
    // In a real implementation, this would generate and download QR codes
    showNotification('Tính năng xuất QR code sẽ được implement sau', 'info');
  };

  if (loading && bookCopies.length === 0) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton type="card" count={1} className="mb-8" />
            <LoadingSkeleton type="card" count={5} />
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
                  Quản lý bản sách
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý các bản sách cụ thể trong hệ thống
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="primary"
                  onClick={openCreateModal}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm bản sách</span>
                  <span className="sm:hidden">Thêm</span>
                </ActionButton>
                <ActionButton
                  variant="outline"
                  onClick={() => setIsBulkCreateModalOpen(true)}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Tạo hàng loạt</span>
                  <span className="sm:hidden">Hàng loạt</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <QrCodeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Tổng bản sách</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">
                      {pagination.totalElements}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Đang mượn</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">
                      {bookCopies.filter(copy => copy.status === 'BORROWED').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                    <BuildingLibraryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Thư viện</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">
                      {new Set(bookCopies.map(copy => copy.library?.libraryId).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                    <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600 dark:text-sage-400">Bị mất/Hư hỏng</p>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">
                      {bookCopies.filter(copy => copy.status === 'LOST' || copy.status === 'DAMAGED').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-sage-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Tìm kiếm theo QR code, tên sách, tác giả, vị trí..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Tất cả trạng thái</option>
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Book Copies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {bookCopies.map((copy) => {
              const statusInfo = getStatusInfo(copy.status);
              const book = copy.book;
              const library = copy.library;

              return (
                <div
                  key={copy.bookCopyId}
                  className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
                  onClick={() => {
                    setSelectedCopy(copy);
                    setIsDrawerOpen(true);
                  }}
                >
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center">
                        <QrCodeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-sage-600 dark:text-sage-400" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <ActionButton
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(copy);
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
                            handleDeleteCopy(copy);
                          }}
                          className="min-h-[32px] px-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </ActionButton>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-sage-900 dark:text-sage-100 line-clamp-1">
                          {book?.title || 'Không có tên sách'}
                        </h3>
                        <p className="text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                          {book?.author || 'Không có tác giả'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <QrCodeIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                            <span className="text-sm font-mono text-sage-700 dark:text-sage-300">
                              {copy.qrCode}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportQrCodes(copy);
                            }}
                            className="p-1 rounded-lg bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                            title="Xuất QR code"
                          >
                            <ArrowDownTrayIcon className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                            {copy.shelfLocation || 'Chưa có vị trí'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <BuildingLibraryIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                            {library?.name || 'Không có thư viện'}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <select
                          value={copy.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            changeBookCopyStatus(copy.bookCopyId, e.target.value).then(result => {
                              if (result.success) {
                                showNotification('Cập nhật trạng thái thành công', 'success');
                              } else {
                                showNotification(result.message || 'Có lỗi xảy ra', 'error');
                              }
                            });
                          }}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 focus:ring-2 focus:ring-sage-500 focus:outline-none cursor-pointer ${statusInfo.color}`}
                        >
                          {getStatusOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-sage-200 dark:border-sage-700">
                        <div className="flex items-center space-x-2">
                          <BookOpenIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm text-sage-600 dark:text-sage-400">
                            {copy.borrowingCount || 0} lần mượn
                          </span>
                        </div>
                        <span className="text-xs text-sage-500 dark:text-sage-400">
                          {formatDate(copy.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {bookCopies.length === 0 && !loading && (
            <div className="text-center py-12">
              <QrCodeIcon className="w-16 h-16 text-sage-300 dark:text-sage-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
                {searchTerm || statusFilter ? 'Không tìm thấy bản sách' : 'Chưa có bản sách nào'}
              </h3>
              <p className="text-sage-600 dark:text-sage-400 mb-6">
                {searchTerm || statusFilter ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo bản sách đầu tiên để bắt đầu'}
              </p>
              {!searchTerm && !statusFilter && (
                <ActionButton
                  variant="primary"
                  onClick={openCreateModal}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm bản sách đầu tiên
                </ActionButton>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalElements > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.size}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={closeCreateModal} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Thêm bản sách mới
                </h3>
                <button
                  onClick={closeCreateModal}
                  className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Sách *
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => updateFormData('bookId', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.bookId ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    disabled={loadingBooks}
                  >
                    <option value="">Chọn sách</option>
                    {books.map(book => (
                      <option key={book.bookId} value={book.bookId}>
                        {book.title} - {book.author}
                      </option>
                    ))}
                  </select>
                  {errors.bookId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bookId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Thư viện *
                  </label>
                  <select
                    value={formData.libraryId}
                    onChange={(e) => updateFormData('libraryId', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.libraryId ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    disabled={loadingLibraries}
                  >
                    <option value="">Chọn thư viện</option>
                    {libraries.map(library => (
                      <option key={library.libraryId} value={library.libraryId}>
                        {library.name}
                      </option>
                    ))}
                  </select>
                  {errors.libraryId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.libraryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    QR Code *
                  </label>
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => updateFormData('qrCode', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.qrCode ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    placeholder="Nhập QR code"
                  />
                  {errors.qrCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.qrCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Vị trí kệ
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => updateFormData('shelfLocation', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.shelfLocation ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    placeholder="Nhập vị trí kệ sách"
                  />
                  {errors.shelfLocation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shelfLocation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <ActionButton
                  variant="outline"
                  onClick={closeCreateModal}
                >
                  Hủy
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleCreateCopy}
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo bản sách'}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCopy && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={closeEditModal} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Chỉnh sửa bản sách
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Sách *
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => updateFormData('bookId', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.bookId ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    disabled={loadingBooks}
                  >
                    <option value="">Chọn sách</option>
                    {books.map(book => (
                      <option key={book.bookId} value={book.bookId}>
                        {book.title} - {book.author}
                      </option>
                    ))}
                  </select>
                  {errors.bookId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bookId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Thư viện *
                  </label>
                  <select
                    value={formData.libraryId}
                    onChange={(e) => updateFormData('libraryId', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.libraryId ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    disabled={loadingLibraries}
                  >
                    <option value="">Chọn thư viện</option>
                    {libraries.map(library => (
                      <option key={library.libraryId} value={library.libraryId}>
                        {library.name}
                      </option>
                    ))}
                  </select>
                  {errors.libraryId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.libraryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    QR Code *
                  </label>
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => updateFormData('qrCode', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.qrCode ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    placeholder="Nhập QR code"
                  />
                  {errors.qrCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.qrCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Vị trí kệ
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => updateFormData('shelfLocation', e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                      errors.shelfLocation ? 'border-red-300 dark:border-red-600' : 'border-sage-200 dark:border-sage-700'
                    }`}
                    placeholder="Nhập vị trí kệ sách"
                  />
                  {errors.shelfLocation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shelfLocation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <ActionButton
                  variant="outline"
                  onClick={closeEditModal}
                >
                  Hủy
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleEditCopy}
                  disabled={loading}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Chi tiết bản sách"
        size="lg"
      >
        {selectedCopy && (
          <div className="space-y-6">
            {/* Copy Info */}
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <QrCodeIcon className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2 line-clamp-2">
                    {selectedCopy.book?.title || 'Không có tên sách'}
                  </h3>
                  <p className="text-sage-600 dark:text-sage-400 line-clamp-1">
                    QR: {selectedCopy.qrCode}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">QR Code</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono line-clamp-1">{selectedCopy.qrCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tên sách</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium line-clamp-1">{selectedCopy.book?.title || 'Không có tên sách'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedCopy.book?.author || 'Không có tác giả'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono line-clamp-1">{selectedCopy.book?.isbn || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Thư viện</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedCopy.library?.name || 'Không có thư viện'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Vị trí</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedCopy.shelfLocation || 'Chưa có vị trí'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                    <div className="mt-1">
                      {(() => {
                        const statusInfo = getStatusInfo(selectedCopy.status);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Số lần mượn</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedCopy.borrowingCount || 0} lần</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100">
                Thông tin bổ sung
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {formatDate(selectedCopy.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {formatDate(selectedCopy.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
              <ActionButton
                variant="outline"
                onClick={() => {
                  setIsDrawerOpen(false);
                  openEditModal(selectedCopy);
                }}
                className="group min-h-[40px]"
              >
                <PencilIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                <span>Chỉnh sửa</span>
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleDeleteCopy(selectedCopy);
                }}
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

      {/* Bulk Create Modal */}
      {isBulkCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setIsBulkCreateModalOpen(false)} />
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Tạo nhiều bản sách từ một cuốn sách
                </h3>
                <button
                  onClick={() => setIsBulkCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Chọn sách *
                  </label>
                  <select
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    disabled={loadingBooks}
                  >
                    <option value="">Chọn sách</option>
                    {books.map(book => (
                      <option key={book.bookId} value={book.bookId}>
                        {book.title} - {book.author}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Thông tin bản sách
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-sage-600 dark:text-sage-400 mb-1">
                          Thư viện
                        </label>
                        <select className="block w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm">
                          <option value="">Chọn thư viện</option>
                          {libraries.map(library => (
                            <option key={library.libraryId} value={library.libraryId}>
                              {library.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-sage-600 dark:text-sage-400 mb-1">
                          Số lượng
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="block w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm"
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-sage-600 dark:text-sage-400 mb-1">
                        Vị trí kệ (tùy chọn)
                      </label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm"
                        placeholder="Ví dụ: Kệ A, Tầng 1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-sage-50 dark:bg-sage-900/20 rounded-lg p-3">
                  <p className="text-sm text-sage-600 dark:text-sage-400">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo QR code cho từng bản sách. 
                    Bạn có thể thêm nhiều thư viện khác nhau bằng cách click "Thêm thư viện".
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <ActionButton
                  variant="outline"
                  onClick={() => setIsBulkCreateModalOpen(false)}
                >
                  Hủy
                </ActionButton>
                <ActionButton
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo bản sách'}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default AdminBookCopiesPage; 