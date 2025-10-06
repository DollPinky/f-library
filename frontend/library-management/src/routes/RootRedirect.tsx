import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function RootRedirect() {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
}
