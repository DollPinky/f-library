'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../../components/ui/ActionButton';
import NotificationToast from '../../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../../components/ui/DarkModeToggle';

const EditReaderPage = () => {
  const params = useParams();
  const router = useRouter();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    faculty: '',
    major: '',
    year: '',
    campusId: ''
  });

  const [faculties, setFaculties] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    fetchReaderData();
    fetchFilterData();
  }, [params.id]);

  const fetchReaderData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/readers/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReader(data.data);
        setFormData({
          name: data.data.name || '',
          studentId: data.data.studentId || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          faculty: data.data.faculty || '',
          major: data.data.major || '',
          year: data.data.year?.toString() || '',
          campusId: data.data.campus?.campusId || ''
        });
      } else {
        showNotification(data.message || 'Không thể tải thông tin độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải thông tin độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const [facultiesResponse, campusesResponse] = await Promise.all([
        fetch('/api/v1/faculties'),
        fetch('/api/v1/campuses')
      ]);

      const facultiesData = await facultiesResponse.json();
      const campusesData = await campusesResponse.json();

      if (facultiesData.success) {
        setFaculties(facultiesData.data.content || []);
      }
      if (campusesData.success) {
        setCampuses(campusesData.data.content || []);
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

    if (name === 'faculty') {
      setMajors([
        'Công nghệ thông tin',
        'Kỹ thuật phần mềm',
        'Khoa học máy tính',
        'Mạng máy tính',
        'Hệ thống thông tin'
      ]);
      setFormData(prev => ({ ...prev, major: '' }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Họ tên là bắt buộc');
    }

    if (!formData.studentId.trim()) {
      errors.push('MSSV là bắt buộc');
    }

    if (!formData.email.trim()) {
      errors.push('Email là bắt buộc');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email không hợp lệ');
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (!formData.faculty) {
      errors.push('Khoa là bắt buộc');
    }

    if (!formData.major) {
      errors.push('Ngành là bắt buộc');
    }

    if (!formData.year) {
      errors.push('Năm học là bắt buộc');
    }

    if (!formData.campusId) {
      errors.push('Cơ sở là bắt buộc');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showNotification(errors.join(', '), 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/readers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Cập nhật độc giả thành công!', 'success');
        setTimeout(() => {
          router.push(`/admin/readers/${params.id}`);
        }, 1500);
      } else {
        showNotification(data.message || 'Không thể cập nhật độc giả', 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật độc giả', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  if (loading && !reader) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin độc giả...</p>
        </div>
      </div>
    );
  }

  if (!reader) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Không tìm thấy thông tin độc giả
          </div>
          <ActionButton onClick={() => router.push('/admin/readers')}>
            Quay lại danh sách
          </ActionButton>
        </div>
      </div>
    );
  }

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
                <Link href="/admin/readers" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Độc giả
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href={`/admin/readers/${params.id}`} className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  {reader.name}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                Chỉnh sửa
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
              Chỉnh sửa độc giả
            </h1>
            <p className="text-sage-600 dark:text-sage-400">
              Cập nhật thông tin độc giả: {reader.name}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin cá nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập họ tên đầy đủ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      MSSV *
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mã số sinh viên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="example@university.edu.vn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                      placeholder="0123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin học tập
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Khoa *
                    </label>
                    <select
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn khoa</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.facultyId} value={faculty.name}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Ngành *
                    </label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.faculty}
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Chọn ngành</option>
                      {majors.map((major) => (
                        <option key={major} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Năm học *
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn năm học</option>
                      <option value="1">Năm 1</option>
                      <option value="2">Năm 2</option>
                      <option value="3">Năm 3</option>
                      <option value="4">Năm 4</option>
                      <option value="5">Năm 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                      Cơ sở *
                    </label>
                    <select
                      name="campusId"
                      value={formData.campusId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sage-200 dark:border-sage-700 rounded-xl bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn cơ sở</option>
                      {campuses.map((campus) => (
                        <option key={campus.campusId} value={campus.campusId}>
                          {campus.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Current Information Summary */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-6">
                  Thông tin hiện tại
                </h3>
                
                <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin tài khoản</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-sage-600 dark:text-sage-400">Trạng thái:</span> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                            reader.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {reader.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </p>
                        <p><span className="text-sage-600 dark:text-sage-400">Ngày đăng ký:</span> {new Date(reader.registeredAt).toLocaleDateString('vi-VN')}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Email xác thực:</span> {reader.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin học tập</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-sage-600 dark:text-sage-400">Khoa:</span> {reader.faculty || 'N/A'}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Ngành:</span> {reader.major || 'N/A'}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Năm học:</span> {reader.year || 'N/A'}</p>
                        <p><span className="text-sage-600 dark:text-sage-400">Cơ sở:</span> {reader.campus?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                <ActionButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Cập nhật độc giả
                </ActionButton>
                <Link href={`/admin/readers/${params.id}`}>
                  <ActionButton
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </ActionButton>
                </Link>
                <Link href="/admin/readers">
                  <ActionButton
                    type="button"
                    variant="secondary"
                  >
                    Quay lại danh sách
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

export default EditReaderPage; 