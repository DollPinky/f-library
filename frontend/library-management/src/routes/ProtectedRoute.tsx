import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  requiredRole?: string
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (requiredRole === 'ADMIN') {
    if (!user || user.role !== 'ADMIN') {
      return <Navigate to="/forbidden" state={{ from: location }} replace />
    }
  }
  return <Outlet />
}
