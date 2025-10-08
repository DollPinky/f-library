import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export default function PublicRoute() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/user" replace />
  }

  return <Outlet />
}
