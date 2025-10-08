
export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface StandardResponse<T> {
  success: boolean
  message: string
  data: T | null
  timestamp: string
  errorCode?: string
}

export interface Campus {
  campusId: string
  name: string
  code: string
  address: string
}


export type UserRole = 'ADMIN' | 'READER'

export interface User {
  accountId: string
  fullName: string
  email: string
  phone: string
  department: string
  position: string
  companyAccount: string
  role: UserRole
  campus: Campus | null
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  accountId: string
  fullName: string
  email: string
  phone: string
  department: string
  position: string
  companyAccount: string
  role: UserRole
  campus: Campus | null
  createdAt: string
  updatedAt: string
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string>
  setUser: (user: User | null) => void
}

export interface AuthStorage {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export interface AuthError {
  message: string
  errorCode?: string
  status?: number
}
