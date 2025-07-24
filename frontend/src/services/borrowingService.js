import api from './api';

class BorrowingService {
  /**
   * Tạo yêu cầu mượn sách hoặc đặt sách
   */
  async createBorrowing(borrowingData) {
    try {
      const response = await api.post('/borrowings', borrowingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo yêu cầu mượn sách');
    }
  }

  /**
   * Xác nhận mượn sách (chuyển từ RESERVED sang BORROWED)
   */
  async confirmBorrowing(borrowingId) {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/confirm`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xác nhận mượn sách');
    }
  }

  /**
   * Trả sách
   */
  async returnBook(borrowingId) {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/return`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể trả sách');
    }
  }

  /**
   * Hủy đặt sách
   */
  async cancelReservation(borrowingId) {
    try {
      const response = await api.delete(`/borrowings/${borrowingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể hủy đặt sách');
    }
  }

  /**
   * Báo mất sách
   */
  async reportLost(borrowingId) {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/lost`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể báo mất sách');
    }
  }

  /**
   * Lấy danh sách mượn sách của người dùng
   */
  async getUserBorrowings(userId, params = {}) {
    try {
      const response = await api.get(`/borrowings/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách mượn sách');
    }
  }

  /**
   * Lấy tất cả borrowings
   */
  async getAllBorrowings(params = {}) {
    try {
      const response = await api.get('/borrowings', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách mượn sách');
    }
  }

  /**
   * Lấy danh sách sách quá hạn
   */
  async getOverdueBooks(params = {}) {
    try {
      const response = await api.get('/borrowings/overdue', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sách quá hạn');
    }
  }
}

export default new BorrowingService(); 