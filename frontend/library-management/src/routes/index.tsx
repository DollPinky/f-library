import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Routes control
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Auth from "@/pages/auth/Auth";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";

// User pages
import UserDashboard from "@/pages/user/Dashboard";
import BorrowBookManagement from "@/pages/user/BorrowBookManagement/BorrowBookManagement";
import ReturnBookManagement from "@/pages/user/ReturnBookManagement/ReturnBookManagement";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import { BookManagement } from "@/pages/admin/BookManagement/BookManagement";
import BookDetail from "@/pages/admin/BookManagement/BookDetail";

import RootRedirect from "./RootRedirect";

const router = createBrowserRouter([
  {
    element: <RootRedirect />,
    children: [
      // AUTH ROUTES
      {
        element: <AuthLayout />,
        children: [
          {
            element: <PublicRoute />, // chỉ truy cập nếu chưa login
            children: [
              { path: "/login", element: <Auth /> },
              {
                path: "/register",
                element: <div>Register Page (Coming Soon)</div>,
              },
            ],
          },
        ],
      },

      {
        path: "/",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Navigate to="/user" replace /> }],
      },

      // USER ROUTES
      {
        path: "user",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
          {
            element: <ProtectedRoute requiredRole="READER" />,
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
        ],
      },

      // ADMIN ROUTES
      {
        path: "admin",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
          {
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
        ],
      },

      // SYSTEM ROUTES
      { path: "/forbidden", element: <Forbidden /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
