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
  BookOpenIcon,
  TagIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const AdminCategoriesPage = () => {
  const router = useRouter();
  
  // Mock data - trong thực tế sẽ fetch từ API
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Khoa học máy tính',
      description: 'Sách về lập trình, thuật toán, cơ sở dữ liệu',
      color: '#5a735a',
      bookCount: 45,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Văn học',
      description: 'Tiểu thuyết, truyện ngắn, thơ ca',
      color: '#7a907a',
      bookCount: 32,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      name: 'Lịch sử',
      description: 'Sách về lịch sử Việt Nam và thế giới',
      color: '#a3b3a3',
      bookCount: 28,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15'
    },
    {
      id: 4,
      name: 'Kinh tế',
      description: 'Sách về kinh tế học, quản lý, marketing',
      color: '#c7d0c7',
      bookCount: 23,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12'
    },
    {
      id: 5,
      name: 'Y học',
      description: 'Sách về y học, sức khỏe, dinh dưỡng',
      color: '#e3e7e3',
      bookCount: 19,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-16'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#5a735a'
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!formData.name.trim()) {
      showNotification('Tên danh mục không được để trống', 'error');
      return;
    }

    const newCategory = {
      id: Date.now(),
      ...formData,
      bookCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setCategories([...categories, newCategory]);
    setFormData({ name: '', description: '', color: '#5a735a' });
    setIsCreateModalOpen(false);
    showNotification('Tạo danh mục thành công', 'success');
  };

  const handleEditCategory = () => {
    if (!formData.name.trim()) {
      showNotification('Tên danh mục không được để trống', 'error');
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === selectedCategory.id
        ? { ...cat, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : cat
    );

    setCategories(updatedCategories);
    setFormData({ name: '', description: '', color: '#5a735a' });
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    showNotification('Cập nhật danh mục thành công', 'success');
  };

  const handleDeleteCategory = (category) => {
    if (category.bookCount > 0) {
      showNotification('Không thể xóa danh mục có sách', 'error');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      const updatedCategories = categories.filter(cat => cat.id !== category.id);
      setCategories(updatedCategories);
      showNotification('Xóa danh mục thành công', 'success');
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setIsEditModalOpen(true);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#5a735a' });
    setSelectedCategory(null);
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
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Quản lý danh mục
                </h1>
                <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                  Quản lý các danh mục sách trong hệ thống
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ActionButton
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group min-h-[40px]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Thêm danh mục</span>
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
                  placeholder="Tìm kiếm danh mục..."
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDrawerOpen(true);
                }}
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      <TagIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(category);
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
                          handleDeleteCategory(category);
                        }}
                        className="min-h-[32px] px-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </ActionButton>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-sage-200 dark:border-sage-700">
                      <div className="flex items-center space-x-2">
                        <BookOpenIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                        <span className="text-sm text-sage-600 dark:text-sage-400">
                          {category.bookCount} sách
                        </span>
                      </div>
                      <span className="text-xs text-sage-500 dark:text-sage-400">
                        {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <TagIcon className="w-16 h-16 text-sage-300 dark:text-sage-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-2">
                {searchTerm ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
              </h3>
              <p className="text-sage-600 dark:text-sage-400 mb-6">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo danh mục đầu tiên để bắt đầu'}
              </p>
              {!searchTerm && (
                <ActionButton
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm danh mục đầu tiên
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
                  Thêm danh mục mới
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
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập tên danh mục"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="block w-full h-12 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 cursor-pointer"
                  />
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
                  onClick={handleCreateCategory}
                >
                  Tạo danh mục
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                  Chỉnh sửa danh mục
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
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Nhập tên danh mục"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2.5 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="block w-full h-12 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 cursor-pointer"
                  />
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
                  onClick={handleEditCategory}
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
        title="Chi tiết danh mục"
        size="lg"
      >
        {selectedCategory && (
          <div className="space-y-6">
            {/* Category Info */}
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  <TagIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2 line-clamp-2">
                    {selectedCategory.name}
                  </h3>
                  <p className="text-sage-600 dark:text-sage-400 line-clamp-2">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tên danh mục</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium line-clamp-1">{selectedCategory.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Mô tả</label>
                    <p className="text-sage-900 dark:text-sage-100 line-clamp-3">{selectedCategory.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Màu sắc</label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-sage-200 dark:border-sage-700"
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                      <span className="text-sage-900 dark:text-sage-100 font-mono text-sm">{selectedCategory.color}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Số lượng sách</label>
                    <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedCategory.bookCount} sách</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {new Date(selectedCategory.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                    <p className="text-sage-900 dark:text-sage-100">
                      {new Date(selectedCategory.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
              <ActionButton
                variant="outline"
                onClick={() => {
                  setIsDrawerOpen(false);
                  openEditModal(selectedCategory);
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
                  handleDeleteCategory(selectedCategory);
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

export default AdminCategoriesPage; 