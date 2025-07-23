import apiService from './api.js';

class LibraryService {
  async getLibraries(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/libraries?${queryString}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get libraries failed:', error);
      throw error;
    }
  }

  async getLibraryById(libraryId) {
    try {
      const response = await apiService.get(`/libraries/${libraryId}`);
      return response;
    } catch (error) {
      console.error('Get library failed:', error);
      throw error;
    }
  }

  async getAllLibraries() {
    try {
      const response = await apiService.get('/libraries/all');
      return response;
    } catch (error) {
      console.error('Get all libraries failed:', error);
      throw error;
    }
  }

  async createLibrary(libraryData) {
    try {
      const response = await apiService.post('/libraries', libraryData);
      return response;
    } catch (error) {
      console.error('Create library failed:', error);
      throw error;
    }
  }

  async updateLibrary(libraryId, libraryData) {
    try {
      const response = await apiService.put(`/libraries/${libraryId}`, libraryData);
      return response;
    } catch (error) {
      console.error('Update library failed:', error);
      throw error;
    }
  }

  async deleteLibrary(libraryId) {
    try {
      const response = await apiService.delete(`/libraries/${libraryId}`);
      return response;
    } catch (error) {
      console.error('Delete library failed:', error);
      throw error;
    }
  }

  async getLibrariesByCampusId(campusId) {
    try {
      const response = await apiService.get(`/libraries/campus/${campusId}`);
      return response;
    } catch (error) {
      console.error('Get libraries by campus failed:', error);
      throw error;
    }
  }

  async getLibraryHealth() {
    try {
      const response = await apiService.get('/libraries/health');
      return response;
    } catch (error) {
      console.error('Get library health failed:', error);
      throw error;
    }
  }
}

const libraryService = new LibraryService();
export default libraryService; 