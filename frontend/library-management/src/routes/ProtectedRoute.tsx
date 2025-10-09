import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (isLoading) return null;

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
