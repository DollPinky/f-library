import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Routes control
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

// Pages
import Auth from '@/pages/auth/Auth'
import NotFound from '@/pages/NotFound'
import Forbidden from '@/pages/Forbidden'

// User pages
import UserDashboard from '@/pages/user/Dashboard'
import BorrowBookManagement from '@/pages/user/BorrowBookManagement/BorrowBookManagement'
import ReturnBookManagement from '@/pages/user/ReturnBookManagement/ReturnBookManagement'

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard'
import { BookManagement } from '@/pages/admin/BookManagement/BookManagement'

const router = createBrowserRouter([
  // -------------------------------
  // AUTH ROUTES (no main layout)
  // -------------------------------
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicRoute />, // chỉ truy cập nếu chưa login
        children: [
          { path: '/login', element: <Auth /> },
          { path: '/register', element: <div>Register Page (Coming Soon)</div> }
        ]
      }
    ]
  },

  // -------------------------------
  // MAIN APP ROUTES
  // -------------------------------
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      // Default user routes (no login still ok)
      { index: true, element: <UserDashboard /> },

          // User Routes - Các route user cụ thể
          {
            path: "user",
            children: [
              { index: true, element: <UserDashboard /> },
              { path: "dashboard", element: <UserDashboard /> },
              { path: "borrow-books", element: <BorrowBookManagement /> },
              { path: "return-books", element: <ReturnBookManagement /> },
              {
                path: "profile",
                element: <div>Hồ sơ cá nhân (Sắp ra mắt)</div>,
              },
            ],
          },

      // -------------------------------
      // ADMIN ROUTES (requires ADMIN role)
      // -------------------------------
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
      }
    ]
  },

  // -------------------------------
  // SYSTEM ROUTES
  // -------------------------------
  { path: '/forbidden', element: <Forbidden /> },
  { path: '*', element: <NotFound /> }
])
          // Admin Routes - CHỈ cho role ADMIN
          {
            path: "admin",
            element: <ProtectedRoute requiredRole="ADMIN" />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "book-management", element: <BookManagement /> },
              { path: "book-management/book/:bookId", element: <BookDetail /> },
              {
                path: "user-management",
                element: <div>Quản lý người dùng (Sắp ra mắt)</div>,
              },
              { path: "reports", element: <div>Báo cáo (Sắp ra mắt)</div> },
            ],
          },

          // Legacy routes compatibility - redirect old paths
          {
            path: "user-legacy",
            children: [
              {
                index: true,
                element: <UserDashboard />,
                loader: () => {
                  console.warn(
                    "Deprecated: /user-legacy is deprecated, use /user instead"
                  );
                  return null;
                },
              },
              {
                path: "dashboard",
                element: <UserDashboard />,
                loader: () => {
                  console.warn(
                    "Deprecated: /user-legacy/dashboard is deprecated, use /user/dashboard instead"
                  );
                  return null;
                },
              },
              { path: "borrow-books", element: <BorrowBookManagement /> },
              { path: "return-books", element: <ReturnBookManagement /> },
            ],
          },

          // Legacy redirect fallback
          {
            path: "book-management",
            element: <div>Redirecting...</div>,
            loader: () => {
              window.location.replace("/admin/book-management");
              return null;
            },
          },
        ],
      },

      // 404 Not Found
      {
        path: "*",
        element: <NotFound />,
      },

      // 403 Forbidden
      {
        path: "/forbidden",
        element: <Forbidden />,
      },
    ],
  },
]);

export default router;
