import axiosClient from '@/services/axiosClient'
import axios from 'axios'
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
    const response = await axiosClient.post('/accounts/login', credentials)

    const apiResponse = response.data as StandardResponse<LoginResponse>

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Login failed')
    }

    return apiResponse.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const apiResponse = error.response.data as StandardResponse<null>
      const statusCode = error.response.status

      let errorMessage = apiResponse.message || 'Đăng nhập thất bại'

      if (errorMessage.includes('Không thể đăng nhập:')) {
        errorMessage = errorMessage.replace('Không thể đăng nhập:', '').trim()
      }

      if (statusCode === 401) {
        const lowerMessage = errorMessage.toLowerCase()

        if (
          lowerMessage.includes('email') &&
          lowerMessage.includes('mật khẩu')
        ) {
          throw new Error('Email hoặc mật khẩu không chính xác')
        } else if (lowerMessage.includes('mật khẩu')) {
          throw new Error('Mật khẩu không chính xác')
        } else if (
          lowerMessage.includes('email') ||
          lowerMessage.includes('tài khoản')
        ) {
          throw new Error('Email không tồn tại trong hệ thống')
        } else {
          throw new Error(errorMessage || 'Email hoặc mật khẩu không chính xác')
        }
      } else if (statusCode === 403) {
        throw new Error(errorMessage || 'Tài khoản của bạn đã bị khóa')
      } else if (statusCode === 404) {
        throw new Error('Email không tồn tại trong hệ thống')
      } else if (statusCode === 400) {
        throw new Error(errorMessage || 'Thông tin đăng nhập không hợp lệ')
      } else {
        throw new Error(errorMessage || 'Đăng nhập thất bại')
      }
    }

    // Handle network error
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error(
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng'
      )
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : 'Đăng nhập thất bại'
    throw new Error(errorMessage)
  }
}

export const logout = async (): Promise<void> => {
  try {
    const response = await axiosClient.post('/accounts/logout')
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
    const requestData: RefreshTokenRequest = { refreshToken }

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
}

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken')
  return !!accessToken
}

export const getCurrentUser = (): LoginResponse | null => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as LoginResponse
  } catch {
    return null
  }
}

export const authService = {
  login,
  logout,
  refreshAccessToken,
  isAuthenticated,
  getCurrentUser
}
