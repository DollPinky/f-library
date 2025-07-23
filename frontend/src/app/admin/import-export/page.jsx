'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../components/ui/ActionButton';
import NotificationToast from '../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../components/ui/DarkModeToggle';

const ImportExportPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('idle'); 
  const [selectedDataType, setSelectedDataType] = useState('books');
  const [exportFormat, setExportFormat] = useState('excel');
  
  const [history, setHistory] = useState([
    {
      id: 1,
      type: 'import',
      dataType: 'books',
      filename: 'books_import.xlsx',
      status: 'success',
      records: 150,
      timestamp: new Date(Date.now() - 3600000), 
      user: 'Admin'
    },
    {
      id: 2,
      type: 'export',
      dataType: 'readers',
      filename: 'readers_export.xlsx',
      status: 'success',
      records: 3247,
      timestamp: new Date(Date.now() - 7200000), 
      user: 'Admin'
    },
    {
      id: 3,
      type: 'import',
      dataType: 'staff',
      filename: 'staff_import.csv',
      status: 'error',
      records: 0,
      timestamp: new Date(Date.now() - 10800000), 
      user: 'Admin',
      error: 'Invalid file format'
    }
  ]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      showNotification(`Đã chọn file: ${file.name}`, 'info');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showNotification('Vui lòng chọn file để import', 'warning');
      return;
    }

    try {
      setLoading(true);
      setImportStatus('importing');
      setImportProgress(0);

      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setImportStatus('success');
            setLoading(false);
            
            const newImport = {
              id: Date.now(),
              type: 'import',
              dataType: selectedDataType,
              filename: selectedFile.name,
              status: 'success',
              records: Math.floor(Math.random() * 200) + 50,
              timestamp: new Date(),
              user: 'Admin'
            };
            setHistory(prev => [newImport, ...prev]);
            
            showNotification(`Import thành công ${newImport.records} bản ghi!`, 'success');
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      setImportStatus('error');
      setLoading(false);
      showNotification('Import thất bại: ' + error.message, 'error');
    }
  };

  const handleExport = async (dataType) => {
    try {
      setLoading(true);
      showNotification(`Đang xuất dữ liệu ${dataType}...`, 'info');

      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockRecords = {
        books: 15420,
        readers: 3247,
        staff: 45,
        borrowings: 45678
      };

      const newExport = {
        id: Date.now(),
        type: 'export',
        dataType: dataType,
        filename: `${dataType}_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`,
        status: 'success',
        records: mockRecords[dataType] || 0,
        timestamp: new Date(),
        user: 'Admin'
      };
      setHistory(prev => [newExport, ...prev]);

      showNotification(`Đã xuất ${newExport.records} bản ghi ${dataType} thành công!`, 'success');
      setLoading(false);

    } catch (error) {
      setLoading(false);
      showNotification('Export thất bại: ' + error.message, 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'importing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Thành công';
      case 'error':
        return 'Lỗi';
      case 'importing':
        return 'Đang import';
      default:
        return 'Chờ xử lý';
    }
  };

  const getDataTypeText = (dataType) => {
    switch (dataType) {
      case 'books':
        return 'Sách';
      case 'readers':
        return 'Độc giả';
      case 'staff':
        return 'Nhân viên';
      case 'borrowings':
        return 'Mượn trả';
      default:
        return dataType;
    }
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
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
              Import & Export Dữ liệu
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Nhập và xuất dữ liệu hệ thống thư viện
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Import Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                Import Dữ liệu
              </h3>

              {/* Data Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Loại dữ liệu
                </label>
                <select
                  value={selectedDataType}
                  onChange={(e) => setSelectedDataType(e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="books">Sách</option>
                  <option value="readers">Độc giả</option>
                  <option value="staff">Nhân viên</option>
                  <option value="borrowings">Mượn trả</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Chọn file
                </label>
                <div className="border-2 border-dashed border-sage-200 dark:border-sage-700 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-sage-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <p className="text-sage-600 dark:text-sage-400">
                      {selectedFile ? selectedFile.name : 'Click để chọn file hoặc kéo thả vào đây'}
                    </p>
                    <p className="text-sm text-sage-500 dark:text-sage-500 mt-2">
                      Hỗ trợ: .xlsx, .xls, .csv
                    </p>
                  </label>
                </div>
              </div>

              {/* Import Progress */}
              {importStatus === 'importing' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-sage-600 dark:text-sage-400">Đang import...</span>
                    <span className="text-sm font-medium text-sage-900 dark:text-sage-100">{importProgress}%</span>
                  </div>
                  <div className="w-full bg-sage-200 dark:bg-sage-700 rounded-full h-2">
                    <div
                      className="bg-sage-600 dark:bg-sage-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Import Button */}
              <ActionButton
                variant="primary"
                onClick={handleImport}
                loading={loading}
                disabled={!selectedFile || importStatus === 'importing'}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import Dữ liệu
              </ActionButton>

              {/* Import Instructions */}
              <div className="mt-6 p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Hướng dẫn Import</h4>
                <ul className="text-sm text-sage-600 dark:text-sage-400 space-y-1">
                  <li>• File phải có định dạng Excel (.xlsx, .xls) hoặc CSV</li>
                  <li>• Cột đầu tiên phải là tiêu đề</li>
                  <li>• Dữ liệu phải đúng định dạng yêu cầu</li>
                  <li>• Tối đa 10,000 bản ghi mỗi lần import</li>
                </ul>
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                Export Dữ liệu
              </h3>

              {/* Export Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Định dạng xuất
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>
              </div>

              {/* Export Options */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                  <div>
                    <h4 className="font-medium text-sage-900 dark:text-sage-100">Sách</h4>
                    <p className="text-sm text-sage-600 dark:text-sage-400">15,420 bản ghi</p>
                  </div>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('books')}
                    loading={loading}
                  >
                    Export
                  </ActionButton>
                </div>

                <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                  <div>
                    <h4 className="font-medium text-sage-900 dark:text-sage-100">Độc giả</h4>
                    <p className="text-sm text-sage-600 dark:text-sage-400">3,247 bản ghi</p>
                  </div>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('readers')}
                    loading={loading}
                  >
                    Export
                  </ActionButton>
                </div>

                <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                  <div>
                    <h4 className="font-medium text-sage-900 dark:text-sage-100">Nhân viên</h4>
                    <p className="text-sm text-sage-600 dark:text-sage-400">45 bản ghi</p>
                  </div>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('staff')}
                    loading={loading}
                  >
                    Export
                  </ActionButton>
                </div>

                <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl">
                  <div>
                    <h4 className="font-medium text-sage-900 dark:text-sage-100">Mượn trả</h4>
                    <p className="text-sm text-sage-600 dark:text-sage-400">45,678 bản ghi</p>
                  </div>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('borrowings')}
                    loading={loading}
                  >
                    Export
                  </ActionButton>
                </div>
              </div>

              {/* Export All */}
              <ActionButton
                variant="primary"
                onClick={() => handleExport('all')}
                loading={loading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Tất cả dữ liệu
              </ActionButton>
            </div>
          </div>

          {/* History Section */}
          <div className="mt-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
              <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                Lịch sử Import/Export
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sage-200 dark:border-sage-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Thời gian</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Loại</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Dữ liệu</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">File</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Bản ghi</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-sage-600 dark:text-sage-400">Người thực hiện</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b border-sage-100 dark:border-sage-800">
                        <td className="py-3 px-4 text-sm text-sage-900 dark:text-sage-100">
                          {item.timestamp.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'import' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          }`}>
                            {item.type === 'import' ? 'Import' : 'Export'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-sage-900 dark:text-sage-100">
                          {getDataTypeText(item.dataType)}
                        </td>
                        <td className="py-3 px-4 text-sm text-sage-900 dark:text-sage-100">
                          {item.filename}
                        </td>
                        <td className="py-3 px-4 text-sm text-sage-900 dark:text-sage-100">
                          {item.records.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-sage-900 dark:text-sage-100">
                          {item.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default ImportExportPage; 