import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthContextType, User, LoginRequest } from '@/types'
import { authService } from '@/services/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // === NEW: bắt token từ OAuth fragment (#access_token=...) và lưu vào localStorage ===
    try {
      const hash = window.location.hash
      if (hash && hash.startsWith('#')) {
        const params = new URLSearchParams(hash.slice(1))
        const at = params.get('access_token')
        const rt = params.get('refresh_token')
        const fullName = params.get('fullName')
        const email = params.get('email')

        if (at) {
          localStorage.setItem('accessToken', at)
          if (rt) localStorage.setItem('refreshToken', rt)

          // (tuỳ chọn) dựng user tạm để UI có gì hiển thị
          if (fullName || email) {
            const stubUser = {
              accountId: '',
              fullName: fullName || '',
              email: email || '',
              phone: '',
              department: '',
              position: '',
              companyAccount: '',
              role: 'READER',
              campus: null,
              createdAt: '',
              updatedAt: ''
            } as User
            localStorage.setItem('user', JSON.stringify(stubUser))
          }

          // Xoá fragment cho sạch
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      }
    } catch (e) {
      console.error('Parse OAuth fragment error:', e)
    }

    // === ORIGINAL: đọc localStorage để khởi tạo context ===
    const initializeAuth = () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedAccessToken) setAccessToken(storedAccessToken)
        if (storedRefreshToken) setRefreshToken(storedRefreshToken)
        if (storedUser) setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error initializing auth:', error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setIsLoading(true)
        const response = await authService.login(credentials)

        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response))

        setAccessToken(response.accessToken)
        setRefreshToken(response.refreshToken)
        setUser(response)

        setTimeout(() => {
          if (response.role === 'ADMIN') {
            navigate('/admin', { replace: true })
          } else {
            navigate('/user', { replace: true })
          }
          setIsLoading(false)
        }, 100)
      } catch (error) {
        setIsLoading(false)
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại')
      }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      setAccessToken(null)
      setRefreshToken(null)
      setUser(null)

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      try {
        await authService.logout()
      } catch (apiError) {
        console.error('AuthContext: Logout API error (ignored):', apiError)
      }
      navigate('/', { replace: true })
    } catch (error) {
      console.error('AuthContext: Logout error:', error)
      setAccessToken(null)
      setRefreshToken(null)
      setUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      navigate('/', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const refreshAccessTokenFn = useCallback(async (): Promise<string> => {
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const newAccessToken = await authService.refreshAccessToken(refreshToken)
      localStorage.setItem('accessToken', newAccessToken)
      setAccessToken(newAccessToken)
      return newAccessToken
    } catch (error) {
      console.error('Refresh token error:', error)
      await logout()
      throw error
    }
  }, [refreshToken, logout])

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isLoading,
    login,
    logout,
    refreshAccessToken: refreshAccessTokenFn,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
