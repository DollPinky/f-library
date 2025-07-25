const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    const url = options.params ? 
      `${this.baseURL}${endpoint}?${new URLSearchParams(options.params)}` : 
      `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

const apiService = new ApiService();

export default apiService; 