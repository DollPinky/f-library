import { useState, useCallback } from 'react';
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

  // ==================== SEARCH OPERATIONS ====================

  const searchBookCopies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.searchBookCopies({
        ...params,
        page: params.page ?? pagination.page,
        size: params.size ?? pagination.size
      });
      
      if (response.success) {
        setBookCopies(response.data.content || []);
        setPagination({
          page: response.data.pageable?.pageNumber || 0,
          size: response.data.pageable?.pageSize || 20,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách bản sách');
      }
    } catch (err) {
      console.error('Error searching book copies:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách bản sách');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  // ==================== CRUD OPERATIONS ====================

  const createBookCopy = useCallback(async (bookCopyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.createBookCopy(bookCopyData);
      
      if (response.success) {
        // Refresh the list after creating
        await searchBookCopies();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error creating book copy:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi tạo bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchBookCopies]);

  const updateBookCopy = useCallback(async (bookCopyId, bookCopyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.updateBookCopy(bookCopyId, bookCopyData);
      
      if (response.success) {
        // Refresh the list after updating
        await searchBookCopies();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error updating book copy:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchBookCopies]);

  const deleteBookCopy = useCallback(async (bookCopyId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.deleteBookCopy(bookCopyId);
      
      if (response.success) {
        // Refresh the list after deleting
        await searchBookCopies();
        return { success: true };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xóa bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error deleting book copy:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xóa bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchBookCopies]);

  const changeBookCopyStatus = useCallback(async (bookCopyId, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookCopyService.changeBookCopyStatus(bookCopyId, status);
      
      if (response.success) {
        // Refresh the list after changing status
        await searchBookCopies();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi thay đổi trạng thái bản sách');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error changing book copy status:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái bản sách';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchBookCopies]);

  // ==================== PAGINATION OPERATIONS ====================

  const goToPage = useCallback((page) => {
    searchBookCopies({ page });
  }, [searchBookCopies]);

  const changePageSize = useCallback((size) => {
    searchBookCopies({ size, page: 0 });
  }, [searchBookCopies]);

  // ==================== UTILITY OPERATIONS ====================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getBookCopyById = useCallback(async (bookCopyId) => {
    try {
      const response = await bookCopyService.getBookCopyById(bookCopyId);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error getting book copy by ID:', err);
      return null;
    }
  }, []);

  const getBookCopyByQrCode = useCallback(async (qrCode) => {
    try {
      const response = await bookCopyService.getBookCopyByQrCode(qrCode);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error getting book copy by QR code:', err);
      return null;
    }
  }, []);

  return {
    // State
    bookCopies,
    loading,
    error,
    pagination,
    
    // Search operations
    searchBookCopies,
    
    // CRUD operations
    createBookCopy,
    updateBookCopy,
    deleteBookCopy,
    changeBookCopyStatus,
    
    // Pagination operations
    goToPage,
    changePageSize,
    
    // Utility operations
    clearError,
    getBookCopyById,
    getBookCopyByQrCode
  };
}; 