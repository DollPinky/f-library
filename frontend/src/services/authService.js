import apiService from './api.js';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiService.post('/accounts/login', credentials);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/accounts/register', userData);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await apiService.post('/accounts/logout');
      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.get('/accounts/me');
      return response;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  async getSessionInfo() {
    try {
      const response = await apiService.get('/accounts/session-info');
      return response;
    } catch (error) {
      console.error('Get session info failed:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService; 