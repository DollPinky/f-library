import { AuthProvider } from "@/contexts/AuthContext";
import { Outlet } from "react-router";

const RootRedirect = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);
export default RootRedirect;
