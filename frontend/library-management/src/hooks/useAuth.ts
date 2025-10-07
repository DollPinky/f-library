export function useAuth() {
  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return { accessToken, user, isAuthenticated: !!accessToken };
}
