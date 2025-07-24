import apiService from './api';

const libraryService = {
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

    const response = await apiService.get(`/libraries?${searchParams.toString()}`);
    return response;
  },

  /**
   * Lấy library theo ID
   */
  async getLibraryById(libraryId) {
    const response = await apiService.get(`/libraries/${libraryId}`);
    return response;
  },

  /**
   * Lấy libraries theo campus ID
   */
  async getLibrariesByCampusId(campusId) {
    const response = await apiService.get(`/libraries/campus/${campusId}`);
    return response;
  },

  /**
   * Lấy tất cả libraries
   */
  async getAllLibraries() {
    const response = await apiService.get('/libraries/all');
    return response;
  },

  // ==================== COMMAND OPERATIONS ====================

  /**
   * Tạo library mới
   */
  async createLibrary(libraryData) {
    const response = await apiService.post('/libraries', libraryData);
    return response;
  },

  /**
   * Cập nhật library
   */
  async updateLibrary(libraryId, libraryData) {
    const response = await apiService.put(`/libraries/${libraryId}`, libraryData);
    return response;
  },

  /**
   * Xóa library
   */
  async deleteLibrary(libraryId) {
    const response = await apiService.delete(`/libraries/${libraryId}`);
    return response;
  },
};

export default libraryService;
export { libraryService }; 