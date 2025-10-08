import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Auth
import Auth from "./pages/auth/Auth";
import { AuthProvider } from "./hooks/useAuth";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import { BookManagement } from "./pages/admin/BookManagement/BookManagement";

// User
import UserDashboard from "./pages/user/Dashboard";
import BorrowBookManagement from "./pages/user/BorrowBookManagement/BorrowBookManagement";
import ReturnBookManagement from "./pages/user/ReturnBookManagement/ReturnBookManagement";
import BookDetail from "./pages/admin/BookManagement/BookDetail";

// Layout wrapper that includes AuthProvider
const LayoutWithAuth = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

// Auth wrapper that includes AuthProvider
const AuthWithProvider = () => {
  return (
    <AuthProvider>
      <Auth />
    </AuthProvider>
  );
};

// import router from "./routes/index";
const router = createBrowserRouter([
  // Auth (no layout)
  { path: "/login", element: <AuthWithProvider /> },

  {
    path: "/",
    element: <LayoutWithAuth />,
    children: [
      { index: true, element: <Navigate to="/admin" replace /> },

      // Admin routes
      {
        path: "/admin",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "book-management", element: <BookManagement /> },
          { path: "book-management/book/:bookId", element: <BookDetail /> },
          {
            path: "user-management",
            element: <div>User Management (Coming Soon)</div>,
          },
          { path: "reports", element: <div>Reports (Coming Soon)</div> },
        ],
      },

      // User routes
      {
        path: "/user",
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "dashboard", element: <UserDashboard /> },
          { path: "borrow-books", element: <BorrowBookManagement /> },
          { path: "return-books", element: <ReturnBookManagement /> },
        ],
      },

      // Legacy (compatibility)
      { path: "/book-management", element: <BookManagement /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
