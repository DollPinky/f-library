import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'

// Admin Components
import AdminDashboard from './pages/admin/Dashboard'
import BookManagement from './pages/admin/BookManagement/BookManagement'

// User Components
import UserDashboard from './pages/user/Dashboard'
import BorrowBookManagement from './pages/user/BorrowBookManagement/BorrowBookManagement'
import ReturnBookManagement from './pages/user/ReturnBookManagement/ReturnBookManagement'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Default redirect to admin dashboard
      { index: true, element: <Navigate to="/admin" replace /> },

      // Admin routes
      {
        path: '/admin',
        children: [
          { index: true, element: <AdminDashboard /> }, // /admin -> AdminDashboard
          { path: 'dashboard', element: <AdminDashboard /> }, // /admin/dashboard -> AdminDashboard
          { path: 'book-management', element: <BookManagement /> },
          {
            path: 'reader-management',
            element: <div>Reader Management (Coming Soon)</div>
          },
          { path: 'reports', element: <div>Reports (Coming Soon)</div> }
        ]
      },

      // User routes
      {
        path: '/user',
        children: [
          { index: true, element: <UserDashboard /> }, // /user -> UserDashboard
          { path: 'dashboard', element: <UserDashboard /> }, // /user/dashboard -> UserDashboard
          { path: 'borrow-books', element: <BorrowBookManagement /> },
          { path: 'return-books', element: <ReturnBookManagement /> },
          { path: 'profile', element: <div>Profile (Coming Soon)</div> }
        ]
      },

      // Legacy routes (for backward compatibility)
      { path: '/book-management', element: <BookManagement /> }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
