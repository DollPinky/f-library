import { useState, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  // ==================== SEARCH OPERATIONS ====================

  const searchCategories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.searchCategories({
        ...params,
        page: params.page ?? pagination.page,
        size: params.size ?? pagination.size
      });
      
      if (response.success) {
        setCategories(response.data.content || []);
        setPagination({
          page: response.data.pageable?.pageNumber || 0,
          size: response.data.pageable?.pageSize || 20,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách danh mục');
      }
    } catch (err) {
      console.error('Error searching categories:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  // ==================== CRUD OPERATIONS ====================

  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.createCategory(categoryData);
      
      if (response.success) {
        await searchCategories();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo danh mục');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error creating category:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchCategories]);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      
      if (response.success) {
        await searchCategories();
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật danh mục');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchCategories]);

  const deleteCategory = useCallback(async (categoryId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.deleteCategory(categoryId);
      
      if (response.success) {
        await searchCategories();
        return { success: true };
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xóa danh mục');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [searchCategories]);

  // ==================== UTILITY OPERATIONS ====================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCategoryById = useCallback(async (categoryId) => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error getting category by ID:', err);
      return null;
    }
  }, []);

  const getCategoryHierarchy = useCallback(async () => {
    try {
      const response = await categoryService.getCategoryHierarchy();
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error getting category hierarchy:', err);
      return [];
    }
  }, []);

  const getCategoryChildren = useCallback(async (categoryId) => {
    try {
      const response = await categoryService.getCategoryChildren(categoryId);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error getting category children:', err);
      return [];
    }
  }, []);

  return {
    categories,
    loading,
    error,
    pagination,
    
    searchCategories,
    
    createCategory,
    updateCategory,
    deleteCategory,
    
    clearError,
    getCategoryById,
    getCategoryHierarchy,
    getCategoryChildren
  };
}; 