'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import DetailDrawer from '../../../components/ui/DetailDrawer';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  QrCodeIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const AdminBookCopiesPage = () => {
  const router = useRouter();
  
  // Mock data - trong thực tế sẽ fetch từ API
  const [bookCopies, setBookCopies] = useState([
    {
      id: 1,
      qrCode: 'BK001-001',
      book: {
        id: 1,
        title: 'Kitchen technology.',
        author: 'Amber Kidd',
        isbn: '978-1136505587'
      },
      status: 'AVAILABLE',
      shelfLocation: 'A1-B2-C3',
      condition: 'EXCELLENT',
      acquisitionDate: '2024-01-15',
      lastMaintenance: '2024-01-20',
      borrowCount: 5,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      qrCode: 'BK001-002',
      book: {
        id: 1,
        title: 'Kitchen technology.',
        author: 'Amber Kidd',
        isbn: '978-1136505587'
      },
      status: 'BORROWED',
      shelfLocation: 'A1-B2-C3',
      condition: 'GOOD',
      acquisitionDate: '2024-01-15',
      lastMaintenance: '2024-01-18',
      borrowCount: 3,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-25'
    },
    {
      id: 3,
      qrCode: 'BK002-001',
      book: {
        id: 2,
        title: 'Image loss ten.',
        author: 'Carmen Smith',
        isbn: '978-3585650756'
      },
      status: 'AVAILABLE',
      shelfLocation: 'A2-B1-C4',
      condition: 'EXCELLENT',
      acquisitionDate: '2024-01-10',
      lastMaintenance: '2024-01-22',
      borrowCount: 2,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-22'
    },
    {
      id: 4,
      qrCode: 'BK002-002',
      book: {
        id: 2,
        title: 'Image loss ten.',
        author: 'Carmen Smith',
        isbn: '978-3585650756'
      },
      status: 'MAINTENANCE',
      shelfLocation: 'A2-B1-C4',
      condition: 'POOR',
      acquisitionDate: '2024-01-10',
      lastMaintenance: '2024-01-15',
      borrowCount: 8,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-28'
    },
    {
      id: 5,
      qrCode: 'BK003-001',
      book: {
        id: 3,
        title: 'Expect recent room situation.',
        author: 'Katelyn Lee',
        isbn: '978-2801823908'
      },
      status: 'AVAILABLE',
      shelfLocation: 'A3-B3-C1',
      condition: 'GOOD',
      acquisitionDate: '2024-01-05',
      lastMaintenance: '2024-01-19',
      borrowCount: 4,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // Form state
  const [formData, setFormData] = useState({
    qrCode: '',
    bookId: '',
    shelfLocation: '',
    condition: 'EXCELLENT',
    status: 'AVAILABLE'
  });

  const filteredCopies = bookCopies.filter(copy =>
    copy.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.shelfLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          text: 'Có sẵn',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
          icon: CheckCircleIcon
        };
      case 'BORROWED':
        return {
          text: 'Đã mượn',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
          icon: ClockIcon
        };
      case 'MAINTENANCE':
        return {
          text: 'Bảo trì',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          text: 'Không xác định',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: ExclamationTriangleIcon
        };
    }
  };

  const getConditionInfo = (condition) => {
    switch (condition) {
      case 'EXCELLENT':
        return {
          text: 'Xuất sắc',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
        };
      case 'GOOD':
        return {
          text: 'Tốt',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'FAIR':
        return {
          text: 'Khá',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'POOR':
        return {
          text: 'Kém',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      default:
        return {
          text: 'Không xác định',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
    }
  };

  const handleCreateCopy = () => {
    if (!formData.qrCode.trim() || !formData.bookId) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    const newCopy = {
      id: Date.now(),
      ...formData,
      book: bookCopies.find(copy => copy.book.id === parseInt(formData.bookId))?.book || {
        title: 'Unknown Book',
        author: 'Unknown Author',
        isbn: 'N/A'
      },
      acquisitionDate: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0],
      borrowCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setBookCopies([...bookCopies, newCopy]);
    setFormData({ qrCode: '', bookId: '', shelfLocation: '', condition: 'EXCELLENT', status: 'AVAILABLE' });
    setIsCreateModalOpen(false);
    showNotification('Tạo bản sách thành công', 'success');
  };

  const handleEditCopy = () => {
    if (!formData.qrCode.trim() || !formData.bookId) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    const updatedCopies = bookCopies.map(copy =>
      copy.id === selectedCopy.id
        ? { ...copy, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : copy
    );

    setBookCopies(updatedCopies);
    setFormData({ qrCode: '', bookId: '', shelfLocation: '', condition: 'EXCELLENT', status: 'AVAILABLE' });
    setIsEditModalOpen(false);
    setSelectedCopy(null);
    showNotification('Cập nhật bản sách thành công', 'success');
  };

  const handleDeleteCopy = (copy) => {
    if (copy.status === 'BORROWED') {
      showNotification('Không thể xóa bản sách đang được mượn', 'error');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa bản sách "${copy.qrCode}"?`)) {
      const updatedCopies = bookCopies.filter(c => c.id !== copy.id);
      setBookCopies(updatedCopies);
      showNotification('Xóa bản sách thành công', 'success');
    }
  };

  const openEditModal = (copy) => {
    setSelectedCopy(copy);
    setFormData({
      qrCode: copy.qrCode,
      bookId: copy.book.id.toString(),
      shelfLocation: copy.shelfLocation,
      condition: copy.condition,
      status: copy.status
    });
    setIsEditModalOpen(true);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const resetForm = () => {
    setFormData({ qrCode: '', bookId: '', shelfLocation: '', condition: 'EXCELLENT', status: 'AVAILABLE' });
    setSelectedCopy(null);
  };

  if (loading) {
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
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm bản sách</span>
                  <span className="sm:hidden">Thêm</span>
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-sage-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Tìm kiếm theo QR code, tên sách, tác giả, vị trí..."
                />
              </div>
            </div>
          </div>

          {/* Book Copies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredCopies.map((copy) => {
              const statusInfo = getStatusInfo(copy.status);
              const conditionInfo = getConditionInfo(copy.condition);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={copy.id}
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
                          {copy.book.title}
                        </h3>
                        <p className="text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                          {copy.book.author}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <QrCodeIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm font-mono text-sage-700 dark:text-sage-300">
                            {copy.qrCode}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm text-sage-600 dark:text-sage-400 line-clamp-1">
                            {copy.shelfLocation}
                          </span>
                        </div>
                      </div>

                      {/* Status and Condition */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.text}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${conditionInfo.color}`}>
                          {conditionInfo.text}
                        </span>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-sage-200 dark:border-sage-700">
                        <div className="flex items-center space-x-2">
                          <BookOpenIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                          <span className="text-sm text-sage-600 dark:text-sage-400">
                            {copy.borrowCount} lần mượn
                          </span>
                        </div>
                        <span className="text-xs text-sage-500 dark:text-sage-400">
                          {new Date(copy.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredCopies.length === 0 && (
            <div className="text-center py-12">
              <QrCodeIcon className="w-16 h-16 text-sage-300 dark:text-sage-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
                {searchTerm ? 'Không tìm thấy bản sách' : 'Chưa có bản sách nào'}
              </h3>
              <p className="text-sage-600 dark:text-sage-400 mb-6">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo bản sách đầu tiên để bắt đầu'}
              </p>
              {!searchTerm && (
                <ActionButton
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm bản sách đầu tiên
                </ActionButton>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Thêm bản sách mới
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    QR Code *
                  </label>
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập QR code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Sách *
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="">Chọn sách</option>
                    {Array.from(new Set(bookCopies.map(copy => copy.book.id))).map(bookId => {
                      const book = bookCopies.find(copy => copy.book.id === bookId)?.book;
                      return (
                        <option key={bookId} value={bookId}>
                          {book?.title} - {book?.author}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Vị trí
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập vị trí kệ sách"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Tình trạng
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="EXCELLENT">Xuất sắc</option>
                    <option value="GOOD">Tốt</option>
                    <option value="FAIR">Khá</option>
                    <option value="POOR">Kém</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <ActionButton
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Hủy
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleCreateCopy}
                >
                  Tạo bản sách
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
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Chỉnh sửa bản sách
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    QR Code *
                  </label>
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập QR code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Sách *
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="">Chọn sách</option>
                    {Array.from(new Set(bookCopies.map(copy => copy.book.id))).map(bookId => {
                      const book = bookCopies.find(copy => copy.book.id === bookId)?.book;
                      return (
                        <option key={bookId} value={bookId}>
                          {book?.title} - {book?.author}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Vị trí
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập vị trí kệ sách"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Tình trạng
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="EXCELLENT">Xuất sắc</option>
                    <option value="GOOD">Tốt</option>
                    <option value="FAIR">Khá</option>
                    <option value="POOR">Kém</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="BORROWED">Đã mượn</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <ActionButton
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Hủy
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleEditCopy}
                >
                  Cập nhật
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
                    {selectedCopy.book.title}
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
                    <p className="text-sage-900 dark:text-sage-100 font-medium line-clamp-1">{selectedCopy.book.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedCopy.book.author}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                    <p className="text-sage-900 dark:text-sage-100 font-mono line-clamp-1">{selectedCopy.book.isbn}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Vị trí</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedCopy.shelfLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                    <div className="mt-1">
                      {(() => {
                        const statusInfo = getStatusInfo(selectedCopy.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tình trạng</label>
                    <div className="mt-1">
                      {(() => {
                        const conditionInfo = getConditionInfo(selectedCopy.condition);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${conditionInfo.color}`}>
                            {conditionInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Số lần mượn</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedCopy.borrowCount} lần</p>
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
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày nhập kho</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {new Date(selectedCopy.acquisitionDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Bảo trì lần cuối</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {new Date(selectedCopy.lastMaintenance).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {new Date(selectedCopy.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                  <p className="text-sage-900 dark:text-sage-100">
                    {new Date(selectedCopy.updatedAt).toLocaleDateString('vi-VN')}
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