import apiService from './api.js';
import bookService from './bookService.js';
import libraryService from './libraryService.js';
import categoryService from './categoryService.js';

class DashboardService {
  async getDashboardStats() {
    try {
      const [booksResponse, librariesResponse, categoriesResponse] = await Promise.all([
        bookService.getBooks({ page: 0, size: 1 }),
        libraryService.getAllLibraries(),
        categoryService.getCategories({ page: 0, size: 1 })
      ]);

      const stats = {
        totalBooks: booksResponse.data?.totalElements || 0,
        totalLibraries: librariesResponse.data?.length || 0,
        totalCategories: categoriesResponse.data?.totalElements || 0,
        totalReaders: 850, 
        activeBorrowings: 320,
      };

      return {
        success: true,
        data: stats,
        message: 'Dashboard stats retrieved successfully'
      };
    } catch (error) {
      console.error('Get dashboard stats failed:', error);
      throw error;
    }
  }

  async getBorrowingTrend() {
    try {
      const trendData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Sách mượn',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Sách trả',
            data: [60, 55, 75, 78, 52, 50, 38, 42, 58, 68, 82, 88],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      };

      return {
        success: true,
        data: trendData,
        message: 'Borrowing trend data retrieved successfully'
      };
    } catch (error) {
      console.error('Get borrowing trend failed:', error);
      throw error;
    }
  }

  async getCategoryDistribution() {
    try {
      const distributionData = {
        labels: ['Văn học', 'Khoa học', 'Lịch sử', 'Kinh tế', 'Công nghệ'],
        datasets: [
          {
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
            ],
          }
        ]
      };

      return {
        success: true,
        data: distributionData,
        message: 'Category distribution data retrieved successfully'
      };
    } catch (error) {
      console.error('Get category distribution failed:', error);
      throw error;
    }
  }

  async getAllDashboardData() {
    try {
      const [stats, borrowingTrend, categoryDistribution] = await Promise.all([
        this.getDashboardStats(),
        this.getBorrowingTrend(),
        this.getCategoryDistribution()
      ]);

      return {
        success: true,
        data: {
          stats: stats.data,
          borrowingTrend: borrowingTrend.data,
          categoryDistribution: categoryDistribution.data
        },
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error) {
      console.error('Get all dashboard data failed:', error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService; 