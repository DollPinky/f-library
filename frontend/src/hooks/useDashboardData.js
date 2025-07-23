import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    totalBorrowings: 0,
    totalLibraries: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockStats = {
        totalBooks: 15420,
        totalReaders: 3247,
        totalBorrowings: 45678,
        totalLibraries: 8
      };

      const mockBooks = [
        {
          id: 1,
          title: 'Lập trình Python',
          author: 'John Smith',
          category: { name: 'Công nghệ' },
          bookCopies: [{ id: 1 }, { id: 2 }]
        },
        {
          id: 2,
          title: 'Toán học cao cấp',
          author: 'Maria Garcia',
          category: { name: 'Toán học' },
          bookCopies: [{ id: 3 }]
        },
        {
          id: 3,
          title: 'Văn học Việt Nam',
          author: 'Nguyễn Du',
          category: { name: 'Văn học' },
          bookCopies: [{ id: 4 }, { id: 5 }, { id: 6 }]
        }
      ];

      setDashboardStats(mockStats);
      setRecentBooks(mockBooks);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    dashboardStats,
    recentBooks,
    loading,
    error,
    refreshData
  };
};

export default useDashboardData; 