'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../components/ui/DarkModeToggle';

const QRScannerPage = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedMode, setSelectedMode] = useState('book');
  
  const mockScanHistory = [
    {
      id: 1,
      type: 'book',
      code: 'BK001234',
      title: 'Lập trình Python',
      timestamp: new Date(Date.now() - 300000), 
      action: 'Mượn sách'
    },
    {
      id: 2,
      type: 'reader',
      code: 'RD567890',
      name: 'Nguyễn Văn A',
      timestamp: new Date(Date.now() - 600000), 
      action: 'Xem thông tin'
    },
    {
      id: 3,
      type: 'book',
      code: 'BK001235',
      title: 'Toán học cao cấp',
      timestamp: new Date(Date.now() - 900000), 
      action: 'Trả sách'
    }
  ];

  useEffect(() => {
    setScanHistory(mockScanHistory);
  }, []);

  const startScanning = async () => {
    try {
      setScanning(true);
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTimeout(() => {
        const mockScannedCode = selectedMode === 'book' ? 'BK001236' : 'RD567891';
        handleScannedCode(mockScannedCode);
      }, 3000);
      
    } catch (error) {
      showNotification('Không thể truy cập camera', 'error');
      setScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    setScannedData(null);
  };

  const handleScannedCode = (code) => {
    setScanning(false);
    
    let mockData = null;
    
    if (selectedMode === 'book') {
      mockData = {
        type: 'book',
        code: code,
        title: 'Lập trình Java',
        author: 'John Smith',
        category: 'Công nghệ',
        status: 'Available',
        location: 'Kệ A1-05',
        copyId: 'CP001'
      };
    } else if (selectedMode === 'reader') {
      mockData = {
        type: 'reader',
        code: code,
        name: 'Trần Thị B',
        studentId: '2021001234',
        email: 'tranthib@university.edu.vn',
        status: 'Active',
        currentBorrowings: 2
      };
    } else {
      mockData = {
        type: 'staff',
        code: code,
        name: 'Lê Văn C',
        employeeId: 'NV001234',
        role: 'Librarian',
        department: 'Thư viện Trung tâm',
        status: 'Active'
      };
    }
    
    setScannedData(mockData);
    
    const newScan = {
      id: Date.now(),
      type: mockData.type,
      code: mockData.code,
      title: mockData.title || mockData.name,
      timestamp: new Date(),
      action: getActionForType(mockData.type)
    };
    
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); 
    
    showNotification(`Đã quét thành công: ${mockData.title || mockData.name}`, 'success');
  };

  const getActionForType = (type) => {
    switch (type) {
      case 'book': return 'Xem thông tin sách';
      case 'reader': return 'Xem thông tin độc giả';
      case 'staff': return 'Xem thông tin nhân viên';
      default: return 'Xem thông tin';
    }
  };

  const handleQuickAction = (action) => {
    if (!scannedData) {
      showNotification('Vui lòng quét mã QR trước', 'warning');
      return;
    }
    
    showNotification(`Đang thực hiện: ${action}`, 'info');
    
    setTimeout(() => {
      showNotification(`Đã thực hiện thành công: ${action}`, 'success');
    }, 2000);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-sage-200 dark:border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="p-2 bg-sage-100 dark:bg-sage-800 rounded-xl mr-3">
                    <svg className="w-6 h-6 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-xl font-serif font-bold text-sage-900 dark:text-sage-100">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link href="/admin">
                <ActionButton variant="outline" size="sm">
                  Dashboard
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              QR Code Scanner
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Quét mã QR để xem thông tin sách, độc giả hoặc nhân viên
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scanner Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                {/* Mode Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Chọn chế độ quét
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedMode('book')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedMode === 'book'
                          ? 'bg-sage-100 dark:bg-sage-800 text-sage-900 dark:text-sage-100'
                          : 'text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100'
                      }`}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Sách
                    </button>
                    <button
                      onClick={() => setSelectedMode('reader')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedMode === 'reader'
                          ? 'bg-sage-100 dark:bg-sage-800 text-sage-900 dark:text-sage-100'
                          : 'text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100'
                      }`}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Độc giả
                    </button>
                    <button
                      onClick={() => setSelectedMode('staff')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedMode === 'staff'
                          ? 'bg-sage-100 dark:bg-sage-800 text-sage-900 dark:text-sage-100'
                          : 'text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100'
                      }`}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Nhân viên
                    </button>
                  </div>
                </div>

                {/* Scanner View */}
                <div className="mb-6">
                  <div className="relative bg-sage-100 dark:bg-sage-800 rounded-2xl overflow-hidden aspect-video">
                    {scanning ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sage-600 mx-auto mb-4"></div>
                          <p className="text-sage-600 dark:text-sage-400">Đang quét mã QR...</p>
                          <p className="text-sm text-sage-500 dark:text-sage-500 mt-2">
                            Chế độ: {selectedMode === 'book' ? 'Sách' : selectedMode === 'reader' ? 'Độc giả' : 'Nhân viên'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 border-4 border-sage-300 dark:border-sage-600 rounded-lg mx-auto mb-4 relative">
                            <div className="absolute inset-0 border-2 border-sage-600 dark:border-sage-400 rounded-lg animate-pulse"></div>
                          </div>
                          <p className="text-sage-600 dark:text-sage-400">Nhấn nút bên dưới để bắt đầu quét</p>
                          <p className="text-sm text-sage-500 dark:text-sage-500 mt-2">
                            Chế độ: {selectedMode === 'book' ? 'Sách' : selectedMode === 'reader' ? 'Độc giả' : 'Nhân viên'}
                          </p>
                        </div>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      style={{ display: scanning ? 'block' : 'none' }}
                    />
                  </div>
                </div>

                {/* Scanner Controls */}
                <div className="flex justify-center space-x-4">
                  {!scanning ? (
                    <ActionButton
                      variant="primary"
                      onClick={startScanning}
                      loading={loading}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                      </svg>
                      Bắt đầu quét
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="danger"
                      onClick={stopScanning}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Dừng quét
                    </ActionButton>
                  )}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-1">
              {/* Scanned Data */}
              {scannedData && (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
                  <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin đã quét
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-sage-600 dark:text-sage-400">Mã QR</p>
                      <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.code}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-sage-600 dark:text-sage-400">
                        {scannedData.type === 'book' ? 'Tên sách' : 'Họ tên'}
                      </p>
                      <p className="font-medium text-sage-900 dark:text-sage-100">
                        {scannedData.title || scannedData.name}
                      </p>
                    </div>
                    
                    {scannedData.type === 'book' && (
                      <>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Tác giả</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.author}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Danh mục</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Trạng thái</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            scannedData.status === 'Available' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {scannedData.status === 'Available' ? 'Có sẵn' : 'Đã mượn'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {scannedData.type === 'reader' && (
                      <>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">MSSV</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Email</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Sách đang mượn</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.currentBorrowings} cuốn</p>
                        </div>
                      </>
                    )}
                    
                    {scannedData.type === 'staff' && (
                      <>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Mã nhân viên</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Vai trò</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sage-600 dark:text-sage-400">Phòng ban</p>
                          <p className="font-medium text-sage-900 dark:text-sage-100">{scannedData.department}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-sage-200 dark:border-sage-700">
                    <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-3">Thao tác nhanh</h4>
                    <div className="space-y-2">
                      {scannedData.type === 'book' && (
                        <>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Mượn sách')}
                          >
                            Mượn sách
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Trả sách')}
                          >
                            Trả sách
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Xem chi tiết')}
                          >
                            Xem chi tiết
                          </ActionButton>
                        </>
                      )}
                      
                      {scannedData.type === 'reader' && (
                        <>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Xem lịch sử mượn')}
                          >
                            Xem lịch sử mượn
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Mượn sách cho độc giả')}
                          >
                            Mượn sách cho độc giả
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Xem chi tiết')}
                          >
                            Xem chi tiết
                          </ActionButton>
                        </>
                      )}
                      
                      {scannedData.type === 'staff' && (
                        <>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Xem thông tin nhân viên')}
                          >
                            Xem thông tin nhân viên
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleQuickAction('Chỉnh sửa thông tin')}
                          >
                            Chỉnh sửa thông tin
                          </ActionButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Scan History */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Lịch sử quét gần đây
                </h3>
                <div className="space-y-3">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center space-x-3 p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        scan.type === 'book' ? 'bg-blue-100 dark:bg-blue-900' :
                        scan.type === 'reader' ? 'bg-purple-100 dark:bg-purple-900' :
                        'bg-amber-100 dark:bg-amber-900'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          scan.type === 'book' ? 'text-blue-600 dark:text-blue-400' :
                          scan.type === 'reader' ? 'text-purple-600 dark:text-purple-400' :
                          'text-amber-600 dark:text-amber-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sage-900 dark:text-sage-100 truncate">
                          {scan.title}
                        </p>
                        <p className="text-xs text-sage-500 dark:text-sage-400">
                          {scan.timestamp.toLocaleTimeString('vi-VN')} • {scan.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
};

export default QRScannerPage; 