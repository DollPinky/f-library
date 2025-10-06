import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

// Admin Components
import AdminDashboard from "@/pages/admin/Dashboard";
import { BookManagement } from "@/pages/admin/BookManagement/BookManagement";

// User Components
import UserDashboard from "@/pages/user/Dashboard";
import BorrowBookManagement from "@/pages/user/BorrowBookManagement/BorrowBookManagement";
import ReturnBookManagement from "@/pages/user/ReturnBookManagement/ReturnBookManagement";

import NotFound from "@/pages/NotFound";
import RootRedirect from "./RootRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <div>Login Page</div>,
      },
      {
        path: "/register",
        element: <div>Register Page</div>,
      },
    ],
  },

  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      // Admin Routes
      {
        path: "admin",
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "book-management", element: <BookManagement /> },
          {
            path: "user-management",
            element: <div>Quản lý người dùng (Sắp ra mắt)</div>,
          },
          { path: "reports", element: <div>Báo cáo (Sắp ra mắt)</div> },
        ],
      },

      // User Routes
      {
        path: "user",
        element: <ProtectedRoute requiredRole="user" />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "dashboard", element: <UserDashboard /> },
          { path: "borrow-books", element: <BorrowBookManagement /> },
          { path: "return-books", element: <ReturnBookManagement /> },
          { path: "profile", element: <div>Hồ sơ cá nhân (Sắp ra mắt)</div> },
        ],
      },

      // Legacy routes
      {
        path: "book-management",
        element: <Navigate to="/admin/book-management" replace />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
