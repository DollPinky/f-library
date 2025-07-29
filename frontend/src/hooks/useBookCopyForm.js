import { useState, useCallback } from 'react';
import bookService from '../services/bookService';
import { libraryService } from '../services/libraryService';

export const useBookCopyForm = () => {
    const [formData, setFormData] = useState({
    bookId: '',
    libraryId: '',
    qrCode: '',
    shelfLocation: '',
    status: 'AVAILABLE'
  });

  const [errors, setErrors] = useState({});

  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingLibraries, setLoadingLibraries] = useState(false);

  // ==================== FORM OPERATIONS ====================

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setFormDataFromBookCopy = useCallback((bookCopy) => {
    if (!bookCopy) return;
    
    setFormData({
      bookId: bookCopy.book?.bookId || '',
      libraryId: bookCopy.library?.libraryId || '',
      qrCode: bookCopy.qrCode || '',
      shelfLocation: bookCopy.shelfLocation || '',
      status: bookCopy.status || 'AVAILABLE'
    });
    
    setErrors({});
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

  const validateForm = useCallback(() => {
    const newErrors = {};

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
      shelfLocation: formData.shelfLocation.trim() || null,
      status: formData.status
    };
  }, [formData]);

  // ==================== DATA FETCHING ====================

  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const response = await bookService.searchBooks({ size: 1000 });
      if (response.success) {
        setBooks(response.data.content || []);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
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
      } else {
        setLibraries([]);
      }
    } catch (err) {
      console.error('Error fetching libraries:', err);
      setLibraries([]);
    } finally {
      setLoadingLibraries(false);
    }
  }, []);

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
      { value: 'BORROWED', label: 'Đang mượn' },
      { value: 'RESERVED', label: 'Đã đặt trước' },
      { value: 'LOST', label: 'Bị mất' },
      { value: 'DAMAGED', label: 'Bị hư hỏng' }
    ];
  }, []);

  const getStatusInfo = useCallback((status) => {
    const statusMap = {
      'AVAILABLE': {
        text: 'Có sẵn',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      },
      'BORROWED': {
        text: 'Đang mượn',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      },
      'RESERVED': {
        text: 'Đã đặt trước',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      },
      'LOST': {
        text: 'Bị mất',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      },
      'DAMAGED': {
        text: 'Bị hư hỏng',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      }
    };

    return statusMap[status] || statusMap['AVAILABLE'];
  }, []);

  return {
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
  };
}; 