'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../../../components/ui/ActionButton';
import NotificationToast from '../../../../components/ui/NotificationToast';
import DarkModeToggle from '../../../../components/ui/DarkModeToggle';

const StaffDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    totalProcessedBooks: 0,
    totalBorrowingsProcessed: 0,
    averageProcessingTime: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    fetchStaffDetails();
    fetchStaffStats();
  }, [params.id]);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/staff/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStaff(data.data);
      } else {
        showNotification(data.message || 'Không thể tải thông tin nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Không thể tải thông tin nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffStats = async () => {
    try {
      const response = await fetch(`/api/v1/staff/${params.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Không thể tải thống kê nhân viên:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`/api/v1/staff/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !staff.isActive
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(`Cập nhật trạng thái thành công!`, 'success');
        fetchStaffDetails();
      } else {
        showNotification(data.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/staff/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Xóa nhân viên thành công!', 'success');
        setTimeout(() => {
          router.push('/admin/staff');
        }, 1500);
      } else {
        showNotification(data.message || 'Không thể xóa nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Không thể xóa nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'LIBRARIAN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MANAGER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'ASSISTANT':
        return 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'LIBRARIAN':
        return 'Thủ thư';
      case 'MANAGER':
        return 'Quản lý';
      case 'ASSISTANT':
        return 'Trợ lý';
      default:
        return 'Không xác định';
    }
  };

  if (loading && !staff) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 dark:text-sage-400">Đang tải thông tin nhân viên...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Không tìm thấy thông tin nhân viên
          </div>
          <ActionButton onClick={() => router.push('/admin/staff')}>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
        <div className="max-w-6xl mx-auto">
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
                <Link href="/admin/staff" className="hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                  Nhân viên
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-sage-900 dark:text-sage-100">
                {staff.account?.fullName}
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  Chi tiết nhân viên
                </h1>
                <p className="text-sage-600 dark:text-sage-400">
                  Mã nhân viên: {staff.employeeId}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <ActionButton
                  variant={staff.isActive ? "warning" : "success"}
                  onClick={handleToggleStatus}
                >
                  {staff.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </ActionButton>
                <Link href={`/admin/staff/${params.id}/edit`}>
                  <ActionButton variant="outline">
                    Chỉnh sửa
                  </ActionButton>
                </Link>
                <ActionButton
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Xóa
                </ActionButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8">
                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-xl ${getStatusColor(staff.isActive)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Trạng thái: {getStatusText(staff.isActive)}</h3>
                      <p className="text-sm mt-1">Vào làm: {staff.hireDate ? new Date(staff.hireDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{staff.account?.fullName}</div>
                      <div className="text-sm">{staff.employeeId}</div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin cơ bản</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Họ tên:</span> <span className="font-medium">{staff.account?.fullName}</span></p>
                          <p><span className="text-sage-600 dark:text-sage-400">Mã nhân viên:</span> {staff.employeeId}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Email:</span> {staff.account?.email}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Số điện thoại:</span> {staff.account?.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Thông tin công việc</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Vai trò:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.staffRole)}`}>
                              {getRoleText(staff.staffRole)}
                            </span>
                          </p>
                          <p><span className="text-sage-600 dark:text-sage-400">Phòng ban:</span> {staff.department || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Chức vụ:</span> {staff.position || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Thư viện:</span> {staff.library?.name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thông tin công việc
                  </h3>
                  <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Chuyên môn & Lịch làm việc</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Chuyên môn:</span> {staff.specialization || 'N/A'}</p>
                          <p><span className="text-sage-600 dark:text-sage-400">Lịch làm việc:</span> {staff.workSchedule || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sage-900 dark:text-sage-100 mb-2">Quyền hạn</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-sage-600 dark:text-sage-400">Quản lý sách:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${staff.canManageBooks ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                              {staff.canManageBooks ? 'Có' : 'Không'}
                            </span>
                          </p>
                          <p><span className="text-sage-600 dark:text-sage-400">Quản lý người dùng:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${staff.canManageUsers ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                              {staff.canManageUsers ? 'Có' : 'Không'}
                            </span>
                          </p>
                          <p><span className="text-sage-600 dark:text-sage-400">Xử lý mượn trả:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${staff.canProcessBorrowings ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                              {staff.canProcessBorrowings ? 'Có' : 'Không'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Statistics */}
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Thống kê hiệu suất
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{stats.totalProcessedBooks}</div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">Sách đã xử lý</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.totalBorrowingsProcessed}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">Lượt mượn trả</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.averageProcessingTime}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Thời gian TB (phút)</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.customerSatisfaction}%</div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">Hài lòng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 mb-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thao tác nhanh
                </h3>
                <div className="space-y-3">
                  <Link href={`/admin/staff/${params.id}/edit`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Chỉnh sửa thông tin
                    </ActionButton>
                  </Link>
                  
                  <Link href={`/admin/staff/${params.id}/permissions`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Quản lý quyền hạn
                    </ActionButton>
                  </Link>
                  
                  <Link href={`/admin/staff/${params.id}/schedule`}>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Lịch làm việc
                    </ActionButton>
                  </Link>
                  
                  <ActionButton
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/admin/staff')}
                    className="w-full"
                  >
                    Quay lại danh sách
                  </ActionButton>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                  Thông tin tài khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Trạng thái tài khoản</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.account?.isActive)}`}>
                      {getStatusText(staff.account?.isActive)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Tên đăng nhập</span>
                    <span className="text-sage-900 dark:text-sage-100">
                      {staff.account?.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Email xác thực</span>
                    <span className="text-sage-900 dark:text-sage-100">
                      {staff.account?.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-600 dark:text-sage-400">Ngày tạo tài khoản</span>
                    <span className="text-sage-900 dark:text-sage-100">
                      {staff.account?.createdAt ? new Date(staff.account.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Xác nhận xóa nhân viên
            </h3>
            <div className="mb-6 space-y-3">
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Họ tên:</strong> {staff?.account?.fullName}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Mã nhân viên:</strong> {staff?.employeeId}
              </p>
              <p className="text-sage-600 dark:text-sage-400">
                <strong>Email:</strong> {staff?.account?.email}
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                ⚠️ Hành động này sẽ xóa vĩnh viễn nhân viên và tất cả dữ liệu liên quan!
              </p>
            </div>
            <div className="flex gap-4">
              <ActionButton
                variant="danger"
                onClick={handleDeleteStaff}
                loading={loading}
              >
                Xóa nhân viên
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </ActionButton>
            </div>
          </div>
        </div>
      )}

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

export default StaffDetailsPage; 