import { useState, useCallback } from 'react';
import { bookService } from '../services/bookService';
import { libraryService } from '../services/libraryService';

export const useBookCopyForm = () => {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingLibraries, setLoadingLibraries] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    libraryId: '',
    qrCode: '',
    shelfLocation: '',
    status: 'AVAILABLE'
  });
  const [errors, setErrors] = useState({});

  // ==================== FETCH DATA ====================

  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const response = await bookService.searchBooks({ size: 1000 });
      if (response.success) {
        setBooks(response.data.content || []);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  const fetchLibraries = useCallback(async () => {
    setLoadingLibraries(true);
    try {
      const response = await libraryService.searchLibraries({ size: 1000 });
      if (response.success) {
        setLibraries(response.data.content || []);
      }
    } catch (error) {
      console.error('Error fetching libraries:', error);
    } finally {
      setLoadingLibraries(false);
    }
  }, []);

  // ==================== FORM MANAGEMENT ====================

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setFormDataFromBookCopy = useCallback((bookCopy) => {
    if (bookCopy) {
      setFormData({
        bookId: bookCopy.book?.bookId || '',
        libraryId: bookCopy.library?.libraryId || '',
        qrCode: bookCopy.qrCode || '',
        shelfLocation: bookCopy.shelfLocation || '',
        status: bookCopy.status || 'AVAILABLE'
      });
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      bookId: '',
      libraryId: '',
      qrCode: '',
      shelfLocation: '',
      status: 'AVAILABLE'
    });
    setErrors({});
  }, []);

  // ==================== VALIDATION ====================

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields
    if (!formData.bookId) {
      newErrors.bookId = 'Vui lòng chọn sách';
    }
    if (!formData.libraryId) {
      newErrors.libraryId = 'Vui lòng chọn thư viện';
    }
    if (!formData.qrCode.trim()) {
      newErrors.qrCode = 'QR code không được để trống';
    } else if (formData.qrCode.length > 255) {
      newErrors.qrCode = 'QR code không được vượt quá 255 ký tự';
    }

    // Optional field validation
    if (formData.shelfLocation && formData.shelfLocation.length > 100) {
      newErrors.shelfLocation = 'Vị trí kệ không được vượt quá 100 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getFormDataForAPI = useCallback(() => {
    return {
      bookId: formData.bookId,
      libraryId: formData.libraryId,
      qrCode: formData.qrCode.trim(),
      shelfLocation: formData.shelfLocation.trim(),
      status: formData.status
    };
  }, [formData]);

  // ==================== UTILITY FUNCTIONS ====================

  const getBookById = useCallback((bookId) => {
    return books.find(book => book.bookId === bookId);
  }, [books]);

  const getLibraryById = useCallback((libraryId) => {
    return libraries.find(library => library.libraryId === libraryId);
  }, [libraries]);

  const getStatusOptions = useCallback(() => {
    return [
      { value: 'AVAILABLE', label: 'Có sẵn' },
      { value: 'BORROWED', label: 'Đã mượn' },
      { value: 'RESERVED', label: 'Đã đặt trước' },
      { value: 'LOST', label: 'Bị mất' },
      { value: 'DAMAGED', label: 'Bị hư hỏng' }
    ];
  }, []);

  const getStatusInfo = useCallback((status) => {
    const statusMap = {
      'AVAILABLE': {
        text: 'Có sẵn',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      },
      'BORROWED': {
        text: 'Đã mượn',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      },
      'RESERVED': {
        text: 'Đã đặt trước',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      },
      'LOST': {
        text: 'Bị mất',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      },
      'DAMAGED': {
        text: 'Bị hư hỏng',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      }
    };
    return statusMap[status] || statusMap['AVAILABLE'];
  }, []);

  return {
    // State
    formData,
    errors,
    books,
    libraries,
    loadingBooks,
    loadingLibraries,

    // Actions
    updateFormData,
    setFormDataFromBookCopy,
    resetForm,
    validateForm,
    getFormDataForAPI,

    // Data fetching
    fetchBooks,
    fetchLibraries,

    // Utilities
    getBookById,
    getLibraryById,
    getStatusOptions,
    getStatusInfo
  };
}; 