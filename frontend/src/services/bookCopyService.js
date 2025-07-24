import apiService from './api';

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

    const response = await apiService.get(`/book-copies?${searchParams.toString()}`);
    return response;
  },

  /**
   * Lấy book copy theo ID
   */
  async getBookCopyById(bookCopyId) {
    const response = await apiService.get(`/book-copies/${bookCopyId}`);
    return response;
  },

  /**
   * Lấy book copies theo book ID
   */
  async getBookCopiesByBookId(bookId) {
    const response = await apiService.get(`/book-copies/book/${bookId}`);
    return response;
  },

  /**
   * Lấy available book copies theo book ID
   */
  async getAvailableBookCopiesByBookId(bookId) {
    const response = await apiService.get(`/book-copies/book/${bookId}/available`);
    return response;
  },

  /**
   * Lấy book copies theo library ID
   */
  async getBookCopiesByLibraryId(libraryId) {
    const response = await apiService.get(`/book-copies/library/${libraryId}`);
    return response;
  },

  /**
   * Lấy book copy theo QR code
   */
  async getBookCopyByQrCode(qrCode) {
    const response = await apiService.get(`/book-copies/qr/${qrCode}`);
    return response;
  },

  // ==================== COMMAND OPERATIONS ====================

  /**
   * Tạo book copy mới
   */
  async createBookCopy(bookCopyData) {
    const response = await apiService.post('/book-copies', bookCopyData);
    return response;
  },

  /**
   * Tạo nhiều book copies từ book
   */
  async createBookCopiesFromBook(command) {
    const response = await apiService.post('/book-copies/from-book', command);
    return response;
  },

  /**
   * Cập nhật book copy
   */
  async updateBookCopy(bookCopyId, bookCopyData) {
    const response = await apiService.put(`/book-copies/${bookCopyId}`, bookCopyData);
    return response;
  },

  /**
   * Thay đổi trạng thái book copy
   */
  async changeBookCopyStatus(bookCopyId, status) {
    const response = await apiService.put(`/book-copies/${bookCopyId}/status?status=${status}`);
    return response;
  },

  /**
   * Xóa book copy
   */
  async deleteBookCopy(bookCopyId) {
    const response = await apiService.delete(`/book-copies/${bookCopyId}`);
    return response;
  },
}; 