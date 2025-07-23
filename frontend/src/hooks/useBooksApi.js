import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
};

export const useBooksApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      return await handleResponse(response);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== QUERY ENDPOINTS ====================

  const getBookById = async (bookId) => {
    const response = await apiCall(`/books/${bookId}`);
    return response.data;
  };

  const searchBooks = async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    // Map frontend parameters to API parameters
    const apiParams = {
      query: params.search || params.query,
      categoryId: params.categoryId,
      libraryId: params.libraryId,
      status: params.status,
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'title',
      sortDirection: params.sortDirection || 'ASC'
    };
    
    Object.entries(apiParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    const response = await apiCall(endpoint);
    return response.data;
  };

  // ==================== COMMAND ENDPOINTS ====================

  const createBook = async (bookData) => {
    const response = await apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    return response.data;
  };

  const updateBook = async (bookId, bookData) => {
    const response = await apiCall(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    return response.data;
  };

  const deleteBook = async (bookId) => {
    const response = await apiCall(`/books/${bookId}`, {
      method: 'DELETE',
    });
    return response.data;
  };

  // ==================== CACHE MANAGEMENT ENDPOINTS ====================

  const clearBookCache = async (bookId) => {
    const response = await apiCall(`/books/${bookId}/cache`, {
      method: 'DELETE',
    });
    return response.data;
  };

  const clearSearchCache = async () => {
    const response = await apiCall('/books/cache/search', {
      method: 'DELETE',
    });
    return response.data;
  };

  const clearAllCache = async () => {
    const response = await apiCall('/books/cache', {
      method: 'DELETE',
    });
    return response.data;
  };

  const clearBooksCache = async (bookIds) => {
    const response = await apiCall('/books/cache/bulk-clear', {
      method: 'POST',
      body: JSON.stringify(bookIds),
    });
    return response.data;
  };

  // ==================== CACHE INFORMATION ENDPOINTS ====================

  const getBookCacheStatus = async (bookId) => {
    const response = await apiCall(`/books/${bookId}/cache/status`);
    return response.data;
  };

  const getCacheStatistics = async () => {
    const response = await apiCall('/books/cache/statistics');
    return response.data;
  };

  // ==================== HEALTH CHECK ENDPOINT ====================

  const healthCheck = async () => {
    const response = await apiCall('/books/health');
    return response.data;
  };

  return {
    loading,
    error,
    // Query methods
    getBookById,
    searchBooks,
    // Command methods
    createBook,
    updateBook,
    deleteBook,
    // Cache management
    clearBookCache,
    clearSearchCache,
    clearAllCache,
    clearBooksCache,
    // Cache information
    getBookCacheStatus,
    getCacheStatistics,
    // Health check
    healthCheck,
  };
};

// Hook for managing books state
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

// Hook for managing a single book
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