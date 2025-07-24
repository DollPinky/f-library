import apiService from './api.js';

class BookService {
  async getBooks(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/books?${queryString}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get books failed:', error);
      throw error;
    }
  }

  async searchBooks(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/books?${queryString}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Search books failed:', error);
      throw error;
    }
  }

  async getBookById(bookId) {
    try {
      const response = await apiService.get(`/books/${bookId}`);
      return response;
    } catch (error) {
      console.error('Get book failed:', error);
      throw error;
    }
  }

  async createBook(bookData) {
    try {
      const response = await apiService.post('/books', bookData);
      return response;
    } catch (error) {
      console.error('Create book failed:', error);
      throw error;
    }
  }

  async updateBook(bookId, bookData) {
    try {
      const response = await apiService.put(`/books/${bookId}`, bookData);
      return response;
    } catch (error) {
      console.error('Update book failed:', error);
      throw error;
    }
  }

  async deleteBook(bookId) {
    try {
      const response = await apiService.delete(`/books/${bookId}`);
      return response;
    } catch (error) {
      console.error('Delete book failed:', error);
      throw error;
    }
  }

  async getBookCacheStatus(bookId) {
    try {
      const response = await apiService.get(`/books/${bookId}/cache/status`);
      return response;
    } catch (error) {
      console.error('Get book cache status failed:', error);
      throw error;
    }
  }

  async clearBookCache(bookId) {
    try {
      const response = await apiService.delete(`/books/${bookId}/cache`);
      return response;
    } catch (error) {
      console.error('Clear book cache failed:', error);
      throw error;
    }
  }
}

const bookService = new BookService();
export default bookService; 