import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";

function Auth() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url("/src/assets/auth/img_auth_bg.jpeg")',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="flex z-10 w-full justify-center-safe">
        {isLogin && <LoginForm />}
      </div>
    </div>
  );
}

export default Auth;
