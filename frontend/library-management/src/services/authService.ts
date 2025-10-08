/**
 * Authentication Service
 * Xử lý các API calls liên quan đến authentication
 *
 * Endpoints:
 * - POST /api/v1/accounts/login
 * - POST /api/v1/accounts/logout
 * - POST /api/v1/accounts/refresh-token
 */

import axiosClient from "@/apis/axiosClient";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  StandardResponse,
} from "@/types/authTypes";

/**
 * Login Service
 *
 * @param credentials - Email và password
 * @returns User info + accessToken + refreshToken
 *
 * @example
 * ```typescript
 * const response = await authService.login({
 *   email: 'admin@example.com',
 *   password: 'password123'
 * })
 * console.log(response.accessToken)
 * ```
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = (await axiosClient.post(
      "accounts/login",
      credentials
    )) as unknown as StandardResponse<LoginResponse>;

    if (!response.success || !response.data) {
      throw new Error(response.message || "Đăng nhập thất bại");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Đăng nhập thất bại");
    }
    throw new Error("Đăng nhập thất bại");
  }
};

/**
 * Logout Service
 *
 * Xóa refresh token khỏi Backend và invalidate session
 *
 * @example
 * ```typescript
 * await authService.logout()
 * ```
 */
export const logout = async (): Promise<void> => {
  try {
    const response = (await axiosClient.post(
      "accounts/logout"
    )) as unknown as StandardResponse<null>;

    if (!response.success) {
      console.warn("Logout warning:", response.message);
    }

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch (error: unknown) {
    // Vẫn clear local storage dù API lỗi
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    if (error instanceof Error) {
      console.error("Logout error:", error.message);
    }
    // Không throw error - logout luôn thành công ở phía client
  }
};

/**
 * Refresh Access Token Service
 *
 * Sử dụng refreshToken để lấy accessToken mới
 *
 * @param refreshToken - Refresh token hiện tại
 * @returns Access token mới
 *
 * @example
 * ```typescript
 * const newAccessToken = await authService.refreshAccessToken(currentRefreshToken)
 * localStorage.setItem('accessToken', newAccessToken)
 * ```
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  try {
    const requestData: RefreshTokenRequest = { refreshToken };

    const response = (await axiosClient.post(
      "accounts/refresh-token",
      requestData
    )) as unknown as StandardResponse<RefreshTokenResponse>;

    if (!response.success || !response.data) {
      throw new Error(response.message || "Không thể refresh token");
    }

    return response.data.accessToken;
  } catch (error: unknown) {
    // Clear auth data nếu refresh token thất bại
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    if (error instanceof Error) {
      throw new Error(error.message || "Không thể refresh token");
    }
    throw new Error("Không thể refresh token");
  }
};

/**
 * Check if user is authenticated
 *
 * @returns True nếu có accessToken
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

/**
 * Get current user from localStorage
 *
 * @returns User object hoặc null
 */
export const getCurrentUser = (): LoginResponse | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as LoginResponse;
  } catch {
    return null;
  }
};

/**
 * Auth Service Object
 * Export tất cả auth services
 */
const authService = {
  login,
  logout,
  refreshAccessToken,
  isAuthenticated,
  getCurrentUser,
};

export default authService;
