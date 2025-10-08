import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function RootRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  // Nếu không phải admin → không có quyền truy cập
  return <Navigate to="/forbidden" replace />
}
