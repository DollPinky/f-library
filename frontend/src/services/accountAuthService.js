import apiService from './api.js';

class AccountAuthService {
  async login(credentials) {
    return await apiService.post('/accounts/login', credentials);
  }

  async register(userData) {
    return await apiService.post('/accounts/register', userData);
  }

  async getCurrentAccount() {
    return await apiService.get('/accounts/me');
  }
}

const accountAuthService = new AccountAuthService();
export default accountAuthService; 