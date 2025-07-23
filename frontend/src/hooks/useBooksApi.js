import { useState, useEffect } from 'react';
import bookService from '../services/bookService';

export const useBooksApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (apiFunction, ...args) => {
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
  };

  const getBookById = async (bookId) => {
    const response = await apiCall(bookService.getBookById, bookId);
    return response.data;
  };

  const searchBooks = async (params = {}) => {
    const response = await apiCall(bookService.getBooks, params);
    return response.data;
  };

  const createBook = async (bookData) => {
    const response = await apiCall(bookService.createBook, bookData);
    return response.data;
  };

  const updateBook = async (bookId, bookData) => {
    const response = await apiCall(bookService.updateBook, bookId, bookData);
    return response.data;
  };

  const deleteBook = async (bookId) => {
    const response = await apiCall(bookService.deleteBook, bookId);
    return response.data;
  };

  const clearBookCache = async (bookId) => {
    const response = await apiCall(bookService.clearBookCache, bookId);
    return response.data;
  };

  const getBookCacheStatus = async (bookId) => {
    const response = await apiCall(bookService.getBookCacheStatus, bookId);
    return response.data;
  };

  const getBookHealth = async () => {
    const response = await apiCall(bookService.getBookHealth);
    return response.data;
  };

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