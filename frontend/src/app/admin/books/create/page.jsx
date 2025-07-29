'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBooksApi } from '../../../../hooks/useBooksApi';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import categoryService from '../../../../services/categoryService';
import libraryService from '../../../../services/libraryService';
import { 
  BookOpenIcon, 
  PlusIcon,
  XMarkIcon,
  QrCodeIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const BookCreatePage = () => {
  const router = useRouter();
  const { createBook, loading, error } = useBooksApi();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    description: '',
    categoryId: '',
    bookCopies: []
  });
  
  const [categories, setCategories] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [bookCopyData, setBookCopyData] = useState({
    qrCode: '',
    status: 'AVAILABLE',
    shelfLocation: '',
    libraryId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for book creation page...');
        
        const [categoriesResponse, librariesResponse] = await Promise.all([
          categoryService.getCategories({ 
            page: 0, 
            size: 100, 
            sortBy: 'name', 
            sortDirection: 'ASC' 
          }),
          libraryService.getAllLibraries()
        ]);

        console.log('Categories response:', categoriesResponse);
        console.log('Libraries response:', librariesResponse);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.content || []);
          console.log('Categories set:', categoriesResponse.data.content || []);
        }
        if (librariesResponse.success) {
          setLibraries(librariesResponse.data || []);
          console.log('Libraries set:', librariesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Không thể tải dữ liệu', 'error');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookCopyChange = (e) => {
    const { name, value } = e.target;
    setBookCopyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addBookCopy = () => {
    if (!bookCopyData.libraryId) {
      showNotification('Vui lòng chọn thư viện', 'warning');
      return;
    }

    if (!bookCopyData.qrCode) {
      generateQRCode();
      return;
    }

    setFormData(prev => ({
      ...prev,
      bookCopies: [...prev.bookCopies, { ...bookCopyData }]
    }));

    setBookCopyData({
      qrCode: '',
      status: 'AVAILABLE',
      shelfLocation: '',
      libraryId: ''
    });
  };

  const removeBookCopy = (index) => {
    setFormData(prev => ({
      ...prev,
      bookCopies: prev.bookCopies.filter((_, i) => i !== index)
    }));
  };

  const generateQRCode = () => {
    const library = libraries.find(lib => lib.libraryId === bookCopyData.libraryId);
    const libraryCode = library ? library.code : 'LIB';
    const isbn = formData.isbn ? formData.isbn.replace(/[^0-9X]/gi, '') : 'NOISBN';
    const copyNumber = formData.bookCopies.length + 1;
    
    const qrCode = `BK_${isbn}_${libraryCode}_${copyNumber.toString().padStart(3, '0')}`;
    setBookCopyData(prev => ({
      ...prev,
      qrCode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }
    if (!formData.categoryId) {
      showNotification('Vui lòng chọn danh mục', 'warning');
      return;
    }
    if (formData.bookCopies.length === 0) {
      showNotification('Vui lòng thêm ít nhất một bản sách', 'warning');
      return;
    }

    try {
      const copies = formData.bookCopies.map(copy => ({
        libraryId: copy.libraryId,
        quantity: 1, 
        location: copy.shelfLocation
      }));

      const bookData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : null,
        isbn: formData.isbn,
        description: formData.description,
        categoryId: formData.categoryId,
        copies: copies
      };

      const createdBook = await createBook(bookData);
      showNotification('Tạo sách thành công!', 'success');
      
      setTimeout(() => {
        router.push('/admin/books');
      }, 1500);
    } catch (error) {
      showNotification(error.message || 'Không thể tạo sách', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/admin" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200 flex items-center">
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li>
                <Link href="/admin/books" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Sách
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li className="text-sage-900 dark:text-sage-100 font-medium">
                Thêm sách mới
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100">
                  Thêm sách mới
                </h1>
                <p className="text-lg text-sage-600 dark:text-sage-400">
                  Nhập thông tin sách và các bản sách
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Book Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6 flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2" />
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
                      className="input-primary"
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
                      className="input-primary"
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
                      className="input-primary"
                      placeholder="Nhập nhà xuất bản"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Năm xuất bản
                    </label>
                    <input
                      type="number"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleInputChange}
                      min="1900"
                      max="2030"
                      className="input-primary"
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
                      className="input-primary"
                      placeholder="Nhập ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Danh mục *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="input-primary"
                      required
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

                <div className="mt-6">
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-primary resize-none"
                    placeholder="Nhập mô tả về sách..."
                  />
                </div>
              </div>

              {/* Book Copies */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6 flex items-center">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Thêm bản sách
                </h3>
                
                <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2 flex items-center">
                        <QrCodeIcon className="w-4 h-4 mr-2" />
                        QR Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="qrCode"
                          value={bookCopyData.qrCode}
                          onChange={handleBookCopyChange}
                          className="flex-1 input-primary"
                          placeholder="QR Code"
                        />
                        <ActionButton
                          type="button"
                          variant="outline"
                          onClick={generateQRCode}
                          className="group"
                        >
                          <QrCodeIcon className="w-4 h-4 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                          <span className="hidden sm:inline">Tạo</span>
                        </ActionButton>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2 flex items-center">
                        <BuildingLibraryIcon className="w-4 h-4 mr-2" />
                        Thư viện
                      </label>
                      <select
                        name="libraryId"
                        value={bookCopyData.libraryId}
                        onChange={handleBookCopyChange}
                        className="input-primary"
                      >
                        <option value="">Chọn thư viện</option>
                        {libraries.map((library) => (
                          <option key={library.libraryId} value={library.libraryId}>
                            {library.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Vị trí kệ
                      </label>
                      <input
                        type="text"
                        name="shelfLocation"
                        value={bookCopyData.shelfLocation}
                        onChange={handleBookCopyChange}
                        className="input-primary"
                        placeholder="Ví dụ: A1-B2-C3"
                      />
                    </div>

                    <div className="flex items-end">
                      <ActionButton
                        type="button"
                        variant="primary"
                        onClick={addBookCopy}
                        className="w-full group"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        <span>Thêm bản sách</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>

                {/* Book Copies List */}
                {formData.bookCopies.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-sage-900 dark:text-sage-100 mb-4">
                      Danh sách bản sách ({formData.bookCopies.length})
                    </h4>
                    <div className="space-y-3">
                      {formData.bookCopies.map((copy, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <QrCodeIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                              <span className="text-sm font-medium text-sage-900 dark:text-sage-100">QR:</span>
                              <span className="text-sm text-sage-600 dark:text-sage-400 font-mono">{copy.qrCode}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BuildingLibraryIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                              <span className="text-sm font-medium text-sage-900 dark:text-sage-100">Thư viện:</span>
                              <span className="text-sm text-sage-600 dark:text-sage-400">
                                {libraries.find(lib => lib.libraryId === copy.libraryId)?.name || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                              <span className="text-sm font-medium text-sage-900 dark:text-sage-100">Vị trí:</span>
                              <span className="text-sm text-sage-600 dark:text-sage-400">{copy.shelfLocation || 'N/A'}</span>
                            </div>
                          </div>
                          <ActionButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeBookCopy(index)}
                            className="group"
                          >
                            <XMarkIcon className="w-4 h-4 group-hover:text-red-600 dark:group-hover:text-red-400" />
                            <span className="hidden sm:inline">Xóa</span>
                          </ActionButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                <ActionButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="group"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <span>Tạo sách</span>
                </ActionButton>
                <Link href="/admin/books">
                  <ActionButton
                    type="button"
                    variant="outline"
                  >
                    Hủy
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

export default BookCreatePage; 