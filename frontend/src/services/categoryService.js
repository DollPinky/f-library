import apiService from './api';

const categoryService = {
  // ==================== QUERY OPERATIONS ====================

  /**
   * Lấy danh sách categories với phân trang và tìm kiếm
   */
  async searchCategories(params = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);

    const response = await apiService.get(`/categories?${searchParams.toString()}`);
    return response;
  },

  /**
   * Lấy category theo ID
   */
  async getCategoryById(categoryId) {
    const response = await apiService.get(`/categories/${categoryId}`);
    return response;
  },

  /**
   * Lấy category hierarchy
   */
  async getCategoryHierarchy() {
    const response = await apiService.get('/categories/hierarchy');
    return response;
  },

  /**
   * Lấy category children
   */
  async getCategoryChildren(categoryId) {
    const response = await apiService.get(`/categories/${categoryId}/children`);
    return response;
  },

  // ==================== COMMAND OPERATIONS ====================

  /**
   * Tạo category mới
   */
  async createCategory(categoryData) {
    const response = await apiService.post('/categories', categoryData);
    return response;
  },

  /**
   * Cập nhật category
   */
  async updateCategory(categoryId, categoryData) {
    const response = await apiService.put(`/categories/${categoryId}`, categoryData);
    return response;
  },

  /**
   * Xóa category
   */
  async deleteCategory(categoryId) {
    const response = await apiService.delete(`/categories/${categoryId}`);
    return response;
  },
};

export default categoryService;
export { categoryService }; 