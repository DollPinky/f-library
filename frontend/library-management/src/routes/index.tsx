import { createBrowserRouter } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Admin Components
import AdminDashboard from '@/pages/admin/Dashboard'
import { BookManagement } from '@/pages/admin/BookManagement/BookManagement'

// User Components 
import UserDashboard from '@/pages/user/Dashboard'
import BorrowBookManagement from '@/pages/user/BorrowBookManagement/BorrowBookManagement'
import ReturnBookManagement from '@/pages/user/ReturnBookManagement/ReturnBookManagement'

// Auth Components
import Auth from '@/pages/auth/Auth'

import NotFound from '@/pages/NotFound'
import Forbidden from '@/pages/Forbidden'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      // Public routes (login/register) - chỉ truy cập khi chưa đăng nhập
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <Auth />
          },
          {
            path: '/register',
            element: <div>Register Page (Coming Soon)</div>
          }
        ]
      },

      // Main application routes
      {
        path: '/',
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
          // Root path - Mặc định hiển thị User Dashboard
          { index: true, element: <UserDashboard /> },

          // User Routes - Các route user cụ thể
          {
            path: 'user',
            children: [
              { index: true, element: <UserDashboard /> },
              { path: 'dashboard', element: <UserDashboard /> },
              { path: 'borrow-books', element: <BorrowBookManagement /> },
              { path: 'return-books', element: <ReturnBookManagement /> },
              {
                path: 'profile',
                element: <div>Hồ sơ cá nhân (Sắp ra mắt)</div>
              }
            ]
          },

          // Admin Routes - CHỈ cho role ADMIN
          {
            path: 'admin',
            element: <ProtectedRoute requiredRole="ADMIN" />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'book-management', element: <BookManagement /> },
              {
                path: 'user-management',
                element: <div>Quản lý người dùng (Sắp ra mắt)</div>
              },
              { path: 'reports', element: <div>Báo cáo (Sắp ra mắt)</div> }
            ]
          },

          // Legacy routes compatibility - redirect old paths
          {
            path: 'user-legacy',
            children: [
              { 
                index: true, 
                element: <UserDashboard />,
                loader: () => {
                  console.warn('Deprecated: /user-legacy is deprecated, use /user instead')
                  return null
                }
              },
              { 
                path: 'dashboard', 
                element: <UserDashboard />,
                loader: () => {
                  console.warn('Deprecated: /user-legacy/dashboard is deprecated, use /user/dashboard instead')
                  return null
                }
              },
              { path: 'borrow-books', element: <BorrowBookManagement /> },
              { path: 'return-books', element: <ReturnBookManagement /> }
            ]
          },

          // Legacy redirect fallback
          {
            path: 'book-management',
            element: <div>Redirecting...</div>,
            loader: () => {
              window.location.replace('/admin/book-management')
              return null
            }
          }
        ]
      },

      // 404 Not Found
      {
        path: '*',
        element: <NotFound />
      },

      // 403 Forbidden
      {
        path: '/forbidden',
        element: <Forbidden />
      }
    ]
  }
])

export default router
