import axiosClient from '@/services/axiosClient'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  StandardResponse
} from '@/types'

const clearAuthData = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post('accounts/login', credentials)

    const apiResponse = response.data as StandardResponse<LoginResponse>

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Login failed')
    }

    return apiResponse.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    throw new Error(errorMessage)
  }
}

export const logout = async (): Promise<void> => {
  try {
    const response = await axiosClient.post('accounts/logout')
    const apiResponse = response.data as StandardResponse<null>

    if (!apiResponse.success) {
      console.warn('Logout warning:', apiResponse.message)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Logout error:', error.message)
    }
  } finally {
    clearAuthData()
  }
}

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  try {
    const requestData: RefreshTokenRequest = { refreshToken };

    const response = await axiosClient.post(
      'accounts/refresh-token',
      requestData
    )

    const apiResponse = response.data as StandardResponse<RefreshTokenResponse>

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Unable to refresh token')
    }

    return apiResponse.data.accessToken
  } catch (error: unknown) {
    clearAuthData()

    const errorMessage =
      error instanceof Error ? error.message : 'Unable to refresh token'
    throw new Error(errorMessage)
  }
};

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken')
  return !!accessToken
}

export const getCurrentUser = (): LoginResponse | null => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as LoginResponse;
  } catch {
    return null;
  }
}

export const authService = {
  login,
  logout,
  refreshAccessToken,
  isAuthenticated,
  getCurrentUser
}
