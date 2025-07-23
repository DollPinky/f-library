import apiService from './api.js';

class CategoryService {
  async getCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/categories?${queryString}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get categories failed:', error);
      throw error;
    }
  }

  async getCategoryById(categoryId) {
    try {
      const response = await apiService.get(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error('Get category failed:', error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await apiService.post('/categories', categoryData);
      return response;
    } catch (error) {
      console.error('Create category failed:', error);
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiService.put(`/categories/${categoryId}`, categoryData);
      return response;
    } catch (error) {
      console.error('Update category failed:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await apiService.delete(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error('Delete category failed:', error);
      throw error;
    }
  }

  async getCategoryChildren(categoryId) {
    try {
      const response = await apiService.get(`/categories/${categoryId}/children`);
      return response;
    } catch (error) {
      console.error('Get category children failed:', error);
      throw error;
    }
  }

  async getCategoryHierarchy() {
    try {
      const response = await apiService.get('/categories/hierarchy');
      return response;
    } catch (error) {
      console.error('Get category hierarchy failed:', error);
      throw error;
    }
  }

  async getCategoryHealth() {
    try {
      const response = await apiService.get('/categories/health');
      return response;
    } catch (error) {
      console.error('Get category health failed:', error);
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService; 