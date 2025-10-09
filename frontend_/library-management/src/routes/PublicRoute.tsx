import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}
