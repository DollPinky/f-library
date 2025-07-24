import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';

export const useBooksApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookById = useCallback(async (bookId) => {
    const response = await apiCall(bookService.getBookById, bookId);
    return response.data;
  }, [apiCall]);

  const searchBooks = useCallback(async (params = {}) => {
    const response = await apiCall(bookService.getBooks, params);
    return response.data;
  }, [apiCall]);

  const createBook = useCallback(async (bookData) => {
    const response = await apiCall(bookService.createBook, bookData);
    return response.data;
  }, [apiCall]);

  const updateBook = useCallback(async (bookId, bookData) => {
    const response = await apiCall(bookService.updateBook, bookId, bookData);
    return response.data;
  }, [apiCall]);

  const deleteBook = useCallback(async (bookId) => {
    const response = await apiCall(bookService.deleteBook, bookId);
    return response.data;
  }, [apiCall]);

  const clearBookCache = useCallback(async (bookId) => {
    const response = await apiCall(bookService.clearBookCache, bookId);
    return response.data;
  }, [apiCall]);

  const getBookCacheStatus = useCallback(async (bookId) => {
    const response = await apiCall(bookService.getBookCacheStatus, bookId);
    return response.data;
  }, [apiCall]);

  const getBookHealth = useCallback(async () => {
    const response = await apiCall(bookService.getBookHealth);
    return response.data;
  }, [apiCall]);

  return {
    loading,
    error,
    getBookById,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    clearBookCache,
    getBookCacheStatus,
    getBookHealth,
  };
};

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({});
  
  const api = useBooksApi();

  const loadBooks = async (searchParams = {}) => {
    try {
      const params = { ...filters, ...searchParams };
      const result = await api.searchBooks(params);
      
      setBooks(result.content || []);
      setPagination({
        page: result.pageable?.pageNumber || 0,
        size: result.pageable?.pageSize || 10,
        totalElements: result.totalElements || 0,
        totalPages: result.totalPages || 0,
      });
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const refreshBooks = () => {
    return loadBooks();
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    loadBooks(newFilters);
  };

  return {
    books,
    pagination,
    filters,
    loading: api.loading,
    error: api.error,
    loadBooks,
    refreshBooks,
    updateFilters,
    ...api,
  };
};

export const useBook = (bookId) => {
  const [book, setBook] = useState(null);
  const api = useBooksApi();

  const loadBook = async () => {
    if (!bookId) return;
    
    try {
      const bookData = await api.getBookById(bookId);
      console.log('Raw book data:', bookData);
      console.log('Book createdAt:', bookData?.createdAt, 'Type:', typeof bookData?.createdAt);
      console.log('Book updatedAt:', bookData?.updatedAt, 'Type:', typeof bookData?.updatedAt);
      console.log('Book createdAt parsed:', bookData?.createdAt ? new Date(bookData.createdAt) : 'null');
      console.log('Book updatedAt parsed:', bookData?.updatedAt ? new Date(bookData.updatedAt) : 'null');
      if (bookData?.bookCopies) {
        console.log('Book copies:', bookData.bookCopies.map(copy => ({
          qrCode: copy.qrCode,
          createdAt: copy.createdAt,
          createdAtType: typeof copy.createdAt,
          createdAtParsed: copy.createdAt ? new Date(copy.createdAt) : 'null'
        })));
      }
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  useEffect(() => {
    loadBook();
  }, [bookId]);

  return {
    book,
    loading: api.loading,
    error: api.error,
    loadBook,
    ...api,
  };
}; 