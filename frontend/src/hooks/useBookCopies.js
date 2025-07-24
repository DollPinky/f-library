import { useState, useEffect, useCallback } from 'react';
import { bookCopyService } from '../services/bookCopyService';

export const useBookCopies = () => {
  const [bookCopies, setBookCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  // ==================== SEARCH AND FETCH ====================

  const searchBookCopies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.searchBookCopies({
        page: pagination.page,
        size: pagination.size,
        ...params
      });
      
      if (response.success) {
        setBookCopies(response.data.content || []);
        setPagination({
          page: response.data.page || 0,
          size: response.data.size || 20,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  const fetchBookCopies = useCallback(() => {
    return searchBookCopies();
  }, [searchBookCopies]);

  // ==================== CRUD OPERATIONS ====================

  const createBookCopy = useCallback(async (bookCopyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.createBookCopy(bookCopyData);
      
      if (response.success) {
        // Refresh the list
        await fetchBookCopies();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchBookCopies]);

  const updateBookCopy = useCallback(async (bookCopyId, bookCopyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.updateBookCopy(bookCopyId, bookCopyData);
      
      if (response.success) {
        // Update the book copy in the list
        setBookCopies(prev => 
          prev.map(copy => 
            copy.bookCopyId === bookCopyId 
              ? response.data 
              : copy
          )
        );
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi cập nhật bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBookCopy = useCallback(async (bookCopyId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.deleteBookCopy(bookCopyId);
      
      if (response.success) {
        // Remove the book copy from the list
        setBookCopies(prev => prev.filter(copy => copy.bookCopyId !== bookCopyId));
        return { success: true };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xóa bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi xóa bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changeBookCopyStatus = useCallback(async (bookCopyId, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.changeBookCopyStatus(bookCopyId, status);
      
      if (response.success) {
        // Update the book copy status in the list
        setBookCopies(prev => 
          prev.map(copy => 
            copy.bookCopyId === bookCopyId 
              ? { ...copy, status: response.data.status }
              : copy
          )
        );
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi thay đổi trạng thái';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== PAGINATION ====================

  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((size) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  }, []);

  // ==================== UTILITY FUNCTIONS ====================

  const getBookCopyById = useCallback(async (bookCopyId) => {
    try {
      const response = await bookCopyService.getBookCopyById(bookCopyId);
      return response.success ? response.data : null;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lấy thông tin bản sách');
      return null;
    }
  }, []);

  const getBookCopyByQrCode = useCallback(async (qrCode) => {
    try {
      const response = await bookCopyService.getBookCopyByQrCode(qrCode);
      return response.success ? response.data : null;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tìm bản sách theo QR code');
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchBookCopies();
  }, [fetchBookCopies]);

  // ==================== RETURN VALUES ====================

  return {
    // State
    bookCopies,
    loading,
    error,
    pagination,
    
    // Actions
    searchBookCopies,
    fetchBookCopies,
    createBookCopy,
    updateBookCopy,
    deleteBookCopy,
    changeBookCopyStatus,
    getBookCopyById,
    getBookCopyByQrCode,
    
    // Pagination
    goToPage,
    changePageSize,
    
    // Utilities
    clearError
  };
}; 