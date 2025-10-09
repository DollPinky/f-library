import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Kiểm tra cả state và localStorage
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  if (isLoading) return null;

  // Nếu không có trong state nhưng có trong localStorage -> vẫn cho phép
  const isLoggedIn = isAuthenticated || !!token;
  const currentUser = user || storedUser;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <Navigate to="/forbidden" state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}
