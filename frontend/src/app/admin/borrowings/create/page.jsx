'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import borrowingService from '../../../../services/borrowingService';
import bookService from '../../../../services/bookService';
import accountService from '../../../../services/accountAuthService';
import NotificationToast from '../../../../components/ui/NotificationToast';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { 
  BookOpenIcon, 
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const CreateBorrowingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [books, setBooks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    bookCopyId: '',
    borrowerId: '',
    borrowedDate: '',
    dueDate: '',
    isReservation: false,
    notes: ''
  });

  useEffect(() => {
    loadBooks();
    loadAccounts();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      if (response.success) {
        setBooks(response.data.content || response.data || []);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await accountService.getAllAccounts();
      if (response.success) {
        setAccounts(response.data.content || response.data || []);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookCopyId || !formData.borrowerId) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const borrowingData = {
        bookCopyId: formData.bookCopyId,
        borrowerId: formData.borrowerId,
        borrowedDate: formData.borrowedDate || new Date().toISOString(),
        dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isReservation: formData.isReservation,
        notes: formData.notes
      };

      const response = await borrowingService.createBorrowing(borrowingData);
      
      if (response.success) {
        showNotification('Tạo yêu cầu mượn sách thành công', 'success');
        setTimeout(() => {
          router.push('/admin/borrowings');
        }, 1500);
      } else {
        showNotification(response.message || 'Không thể tạo yêu cầu mượn sách', 'error');
      }
    } catch (error) {
      console.error('Error creating borrowing:', error);
      showNotification(error.message || 'Không thể tạo yêu cầu mượn sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
  };

  return (
    <>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin/borrowings" 
              className="p-2 text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-sage-100 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 dark:text-sage-100 flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                Tạo yêu cầu mượn sách
              </h1>
              <p className="text-sage-600 dark:text-sage-400 mt-1">
                Tạo yêu cầu mượn sách mới cho độc giả
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Copy Selection */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                <BookOpenIcon className="w-4 h-4 inline mr-2" />
                Chọn sách *
              </label>
              <select
                name="bookCopyId"
                value={formData.bookCopyId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-sage-300 dark:border-sage-600 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Chọn sách...</option>
                {books.map((book) => (
                  <option key={book.bookId} value={book.bookId}>
                    {book.title} - {book.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Borrower Selection */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Chọn độc giả *
              </label>
              <select
                name="borrowerId"
                value={formData.borrowerId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-sage-300 dark:border-sage-600 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Chọn độc giả...</option>
                {accounts.map((account) => (
                  <option key={account.accountId} value={account.accountId}>
                    {account.fullName} - {account.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  Ngày mượn
                </label>
                <input
                  type="datetime-local"
                  name="borrowedDate"
                  value={formData.borrowedDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-300 dark:border-sage-600 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  Ngày hẹn trả *
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-300 dark:border-sage-600 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Reservation Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isReservation"
                checked={formData.isReservation}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-sage-100 border-sage-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-sage-800 focus:ring-2 dark:bg-sage-700 dark:border-sage-600"
              />
              <label className="ml-2 text-sm text-sage-700 dark:text-sage-300">
                Đây là yêu cầu đặt sách (reservation)
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-sage-300 dark:border-sage-600 rounded-xl bg-white dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập ghi chú (nếu có)..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <BookOpenIcon className="w-5 h-5" />
                    Tạo yêu cầu mượn sách
                  </>
                )}
              </button>
              
              <Link href="/admin/borrowings">
                <button
                  type="button"
                  className="px-6 py-3 bg-sage-100 hover:bg-sage-200 dark:bg-sage-800 dark:hover:bg-sage-700 text-sage-700 dark:text-sage-300 font-medium rounded-xl transition-colors duration-200"
                >
                  Hủy
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <NotificationToast 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />
    </>
  );
};

const CreateBorrowingPageWithAuth = () => {
  return (
    <ProtectedRoute>
      <CreateBorrowingPage />
    </ProtectedRoute>
  );
};

export default CreateBorrowingPageWithAuth; 