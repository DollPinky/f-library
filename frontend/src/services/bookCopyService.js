import { api } from './api';

export const bookCopyService = {
  // ==================== QUERY OPERATIONS ====================

  /**
   * Lấy danh sách book copies với phân trang và tìm kiếm
   */
  async searchBookCopies(params = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.bookId) searchParams.append('bookId', params.bookId);
    if (params.libraryId) searchParams.append('libraryId', params.libraryId);
    if (params.status) searchParams.append('status', params.status);
    if (params.availableOnly !== undefined) searchParams.append('availableOnly', params.availableOnly);
    if (params.borrowedOnly !== undefined) searchParams.append('borrowedOnly', params.borrowedOnly);
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);

    const response = await api.get(`/api/v1/book-copies?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Lấy book copy theo ID
   */
  async getBookCopyById(bookCopyId) {
    const response = await api.get(`/api/v1/book-copies/${bookCopyId}`);
    return response.data;
  },

  /**
   * Lấy book copies theo book ID
   */
  async getBookCopiesByBookId(bookId) {
    const response = await api.get(`/api/v1/book-copies/book/${bookId}`);
    return response.data;
  },

  /**
   * Lấy available book copies theo book ID
   */
  async getAvailableBookCopiesByBookId(bookId) {
    const response = await api.get(`/api/v1/book-copies/book/${bookId}/available`);
    return response.data;
  },

  /**
   * Lấy book copies theo library ID
   */
  async getBookCopiesByLibraryId(libraryId) {
    const response = await api.get(`/api/v1/book-copies/library/${libraryId}`);
    return response.data;
  },

  /**
   * Lấy book copy theo QR code
   */
  async getBookCopyByQrCode(qrCode) {
    const response = await api.get(`/api/v1/book-copies/qr/${qrCode}`);
    return response.data;
  },

  // ==================== COMMAND OPERATIONS ====================

  /**
   * Tạo book copy mới
   */
  async createBookCopy(bookCopyData) {
    const response = await api.post('/api/v1/book-copies', bookCopyData);
    return response.data;
  },

  /**
   * Tạo nhiều book copies từ một book
   */
  async createBookCopiesFromBook(bookCopyData) {
    const response = await api.post('/api/v1/book-copies/from-book', bookCopyData);
    return response.data;
  },

  /**
   * Cập nhật book copy
   */
  async updateBookCopy(bookCopyId, bookCopyData) {
    const response = await api.put(`/api/v1/book-copies/${bookCopyId}`, bookCopyData);
    return response.data;
  },

  /**
   * Thay đổi trạng thái book copy
   */
  async changeBookCopyStatus(bookCopyId, status) {
    const response = await api.put(`/api/v1/book-copies/${bookCopyId}/status?status=${status}`);
    return response.data;
  },

  /**
   * Xóa book copy
   */
  async deleteBookCopy(bookCopyId) {
    const response = await api.delete(`/api/v1/book-copies/${bookCopyId}`);
    return response.data;
  },

  // ==================== HEALTH CHECK ====================

  /**
   * Kiểm tra sức khỏe service
   */
  async healthCheck() {
    const response = await api.get('/api/v1/book-copies/health');
    return response.data;
  }
}; 