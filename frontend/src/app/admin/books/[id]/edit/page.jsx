'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../../components/ui/ActionButton';
import NotificationToast from '../../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../../components/ui/DarkModeToggle';
import { useBooksApi } from '../../../../../hooks/useBooksApi';
import categoryService from '../../../../../services/categoryService';
import libraryService from '../../../../../services/libraryService';

const BookEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getBookById, updateBook, loading, error } = useBooksApi();
  
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    description: '',
    categoryId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getBookById(params.id);
        setBook(bookData);
        setFormData({
          title: bookData.title || '',
          author: bookData.author || '',
          publisher: bookData.publisher || '',
          publishYear: bookData.year?.toString() || '',
          isbn: bookData.isbn || '',
          description: bookData.description || '',
          categoryId: bookData.category?.categoryId || ''
        });

        const [categoriesResponse, librariesResponse] = await Promise.all([
          categoryService.getCategories({ 
            page: 0, 
            size: 100, 
            sortBy: 'name', 
            sortDirection: 'ASC' 
          }),
          libraryService.getAllLibraries()
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.content || []);
        }
        if (librariesResponse.success) {
          setLibraries(librariesResponse.data.content || []);
        }
      } catch (error) {
        showNotification('Không thể tải dữ liệu sách', 'error');
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : null,
        isbn: formData.isbn,
        description: formData.description,
        categoryId: formData.categoryId || null
      };

      await updateBook(params.id, bookData);
      showNotification('Cập nhật sách thành công!', 'success');
      
      setTimeout(() => {
        router.push(`/admin/books/${params.id}`);
      }, 1500);
    } catch (error) {
      showNotification(error.message || 'Không thể cập nhật sách', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  if (loading && !book) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            {error || 'Không tìm thấy sách'}
          </div>
          <ActionButton onClick={() => router.push('/admin/books')}>
            Quay lại danh sách
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="p-2 bg-sage-100 dark:bg-sage-800 rounded-xl mr-3">
                    <svg className="w-6 h-6 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-xl font-serif font-bold text-sage-900 dark:text-sage-100">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link href="/admin">
                <ActionButton variant="outline" size="sm">
                  Dashboard
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/admin" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Admin
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/admin/books" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Sách
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href={`/admin/books/${params.id}`} className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  {book.title}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                Chỉnh sửa
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Chỉnh sửa sách
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Cập nhật thông tin sách: {book.title}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Book Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin sách
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Tên sách *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập tên sách"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Tác giả *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập tác giả"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Nhà xuất bản
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập nhà xuất bản"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Năm xuất bản
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max="2030"
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập năm xuất bản"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Danh mục
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Book Copies Summary */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Bản sách hiện có
                </h3>
                
                <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-900 dark:text-sage-100">
                        {book.bookCopies?.length || 0}
                      </div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">Tổng số bản</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {book.bookCopies?.filter(copy => copy.status === 'AVAILABLE').length || 0}
                      </div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">Có sẵn</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {book.bookCopies?.filter(copy => copy.status === 'BORROWED').length || 0}
                      </div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">Đã mượn</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link href={`/admin/books/${params.id}/copies`}>
                      <ActionButton variant="outline">
                        Quản lý bản sách
                      </ActionButton>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                <ActionButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Cập nhật sách
                </ActionButton>
                <Link href={`/admin/books/${params.id}`}>
                  <ActionButton
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </ActionButton>
                </Link>
                <Link href="/admin/books">
                  <ActionButton
                    type="button"
                    variant="secondary"
                  >
                    Quay lại danh sách
                  </ActionButton>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

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

export default BookEditPage; 