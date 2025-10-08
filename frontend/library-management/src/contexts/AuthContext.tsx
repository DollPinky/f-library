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
    const initializeAuth = () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedAccessToken && storedRefreshToken && storedUser) {
          setAccessToken(storedAccessToken)
          setRefreshToken(storedRefreshToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear corrupted data
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
        setUser({
          accountId: response.accountId,
          fullName: response.fullName,
          email: response.email,
          phone: response.phone,
          department: response.department,
          position: response.position,
          companyAccount: response.companyAccount,
          role: response.role,
          campus: response.campus,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        })

        if (response.role === 'ADMIN') {
          navigate('/admin')
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        setIsLoading(false)
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
