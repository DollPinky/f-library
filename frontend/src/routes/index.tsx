import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Route guards
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

// Common pages
import HomePage from "@/pages/home/HomePage";
import Auth from "@/pages/auth/Auth";
import Profile from "@/pages/profile/Profile";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";

// User pages
import UserDashboard from "@/pages/user/Dashboard";
import BorrowBookManagement from "@/pages/user/BorrowBookManagement/BorrowBookManagement";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import { BookManagement } from "@/pages/admin/BookManagement/BookManagement";
import BookDetail from "@/pages/admin/BookManagement/BookDetail";
import BookDonation from "@/pages/donation/BookDonation";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <RootRedirect />,
    children: [
      // Home
      { index: true, element: <Navigate to="/guest/dashboard" replace /> },

      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          {
            element: <PublicRoute />,
            children: [{ path: "/login", element: <Auth /> }],
          },
        ],
      },

      // Guess routes
      {
        path: "guest",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
          { path: "dashboard", element: <HomePage /> },
          { path: "borrow-books", element: <BorrowBookManagement /> },
          // { path: "return-books", element: <ReturnBookManagement /> },
        ],
      },

      // User routes
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
              // { path: "return-books", element: <ReturnBookManagement /> },
              { path: "profile", element: <Profile /> },
              { path: "donate-book", element: <BookDonation /> },
            ],
          },
        ],
      },

      // Admin routes
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
              { path: "profile", element: <Profile /> },
            ],
          },
        ],
      },

      // Error & fallback pages
      { path: "/forbidden", element: <Forbidden /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
