import { api } from './api';

export const libraryService = {
  // ==================== QUERY OPERATIONS ====================

  /**
   * Lấy danh sách libraries với phân trang và tìm kiếm
   */
  async searchLibraries(params = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.campusId) searchParams.append('campusId', params.campusId);
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);

    const response = await api.get(`/api/v1/libraries?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Lấy library theo ID
   */
  async getLibraryById(libraryId) {
    const response = await api.get(`/api/v1/libraries/${libraryId}`);
    return response.data;
  },

  /**
   * Lấy libraries theo campus ID
   */
  async getLibrariesByCampusId(campusId) {
    const response = await api.get(`/api/v1/libraries/campus/${campusId}`);
    return response.data;
  },

  // ==================== COMMAND OPERATIONS ====================

  /**
   * Tạo library mới
   */
  async createLibrary(libraryData) {
    const response = await api.post('/api/v1/libraries', libraryData);
    return response.data;
  },

  /**
   * Cập nhật library
   */
  async updateLibrary(libraryId, libraryData) {
    const response = await api.put(`/api/v1/libraries/${libraryId}`, libraryData);
    return response.data;
  },

  /**
   * Xóa library
   */
  async deleteLibrary(libraryId) {
    const response = await api.delete(`/api/v1/libraries/${libraryId}`);
    return response.data;
  },

  // ==================== HEALTH CHECK ====================

  /**
   * Kiểm tra sức khỏe service
   */
  async healthCheck() {
    const response = await api.get('/api/v1/libraries/health');
    return response.data;
  }
}; 