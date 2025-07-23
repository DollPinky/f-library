'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';

const CreateBorrowingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  
  const [formData, setFormData] = useState({
    bookCopyId: '',
    readerId: '',
    dueDate: '',
    note: ''
  });

  const [bookCopies, setBookCopies] = useState([]);
  const [readers, setReaders] = useState([]);
  const [selectedBookCopy, setSelectedBookCopy] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookCopiesResponse = await fetch('/api/v1/book-copies?status=AVAILABLE', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const bookCopiesData = await bookCopiesResponse.json();
      
      if (bookCopiesData.success) {
        setBookCopies(bookCopiesData.data.content || []);
      }

      const readersResponse = await fetch('/api/v1/readers?isActive=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const readersData = await readersResponse.json();
      
      if (readersData.success) {
        setReaders(readersData.data.content || []);
      }
    } catch (error) {
      showNotification('Không thể tải dữ liệu', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'bookCopyId') {
      const bookCopy = bookCopies.find(copy => copy.bookCopyId === value);
      setSelectedBookCopy(bookCopy);
    } else if (name === 'readerId') {
      const reader = readers.find(r => r.readerId === value);
      setSelectedReader(reader);
    }
  };

  const calculateDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookCopyId || !formData.readerId || !formData.dueDate) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/v1/borrowings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookCopyId: formData.bookCopyId,
          readerId: formData.readerId,
          dueDate: formData.dueDate,
          note: formData.note
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Tạo mượn sách thành công!', 'success');
        setTimeout(() => {
          router.push('/admin/borrowings');
        }, 1500);
      } else {
        showNotification(data.message || 'Không thể tạo mượn sách', 'error');
      }
    } catch (error) {
      showNotification('Không thể tạo mượn sách', 'error');
    } finally {
      setLoading(false);
    }
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-sage-600 dark:text-sage-400">
              <li>
                <Link href="/admin" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Admin
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/admin/borrowings" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Mượn trả sách
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                Mượn sách mới
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Mượn sách mới
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Tạo lượt mượn sách cho độc giả
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Book Copy Selection */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Chọn sách
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Bản sách *
                    </label>
                    <select
                      name="bookCopyId"
                      value={formData.bookCopyId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn bản sách</option>
                      {bookCopies.map((copy) => (
                        <option key={copy.bookCopyId} value={copy.bookCopyId}>
                          {copy.book?.title} - QR: {copy.qrCode} - {copy.library?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedBookCopy && (
                    <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4">
                      <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin sách</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-sage-600 dark:text-sage-400">Tên sách:</span> {selectedBookCopy.book?.title}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Tác giả:</span> {selectedBookCopy.book?.author}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">QR Code:</span> {selectedBookCopy.qrCode}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Thư viện:</span> {selectedBookCopy.library?.name}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Vị trí:</span> {selectedBookCopy.shelfLocation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reader Selection */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Chọn độc giả
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Độc giả *
                    </label>
                    <select
                      name="readerId"
                      value={formData.readerId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn độc giả</option>
                      {readers.map((reader) => (
                        <option key={reader.readerId} value={reader.readerId}>
                          {reader.name} - {reader.studentId} - {reader.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedReader && (
                    <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4">
                      <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin độc giả</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-sage-600 dark:text-sage-400">Họ tên:</span> {selectedReader.name}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">MSSV:</span> {selectedReader.studentId}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Email:</span> {selectedReader.email}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Số điện thoại:</span> {selectedReader.phone}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Trạng thái:</span> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedReader.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {selectedReader.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Borrowing Details */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Chi tiết mượn sách
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Ngày mượn
                    </label>
                    <input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      disabled
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-100 dark:bg-neutral-700 text-sage-600 dark:text-sage-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Hạn trả *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="mt-2">
                      <ActionButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, dueDate: calculateDueDate() }))}
                      >
                        Đặt hạn 14 ngày
                      </ActionButton>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ghi chú về lượt mượn sách (tùy chọn)"
                  />
                </div>
              </div>

              {/* Summary */}
              {selectedBookCopy && selectedReader && (
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-4">Tóm tắt mượn sách</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="text-amber-700 dark:text-amber-300">Sách:</span> {selectedBookCopy.book?.title}</p>
                      <p><span className="text-amber-700 dark:text-amber-300">QR Code:</span> {selectedBookCopy.qrCode}</p>
                      <p><span className="text-amber-700 dark:text-amber-300">Thư viện:</span> {selectedBookCopy.library?.name}</p>
                    </div>
                    <div>
                      <p><span className="text-amber-700 dark:text-amber-300">Độc giả:</span> {selectedReader.name}</p>
                      <p><span className="text-amber-700 dark:text-amber-300">MSSV:</span> {selectedReader.studentId}</p>
                      <p><span className="text-amber-700 dark:text-amber-300">Hạn trả:</span> {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('vi-VN') : 'Chưa chọn'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                <ActionButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Tạo mượn sách
                </ActionButton>
                <Link href="/admin/borrowings">
                  <ActionButton
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </ActionButton>
                </Link>
              </div>
            </form>
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

export default CreateBorrowingPage; 