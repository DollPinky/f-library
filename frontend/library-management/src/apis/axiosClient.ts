import axios from 'axios'
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import type { StandardResponse } from '@/types/authTypes'

const BASE_URL = 'http://localhost:8080'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token?: string) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null = null, newToken?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(newToken)
    }
  })
  failedQueue = []
}

const handleLogout = () => {
  localStorage.clear()
  window.location.replace('/')
}

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse<StandardResponse<unknown>>) =>
    response.data as unknown as AxiosResponse<StandardResponse<unknown>>,
  async (error: AxiosError<StandardResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url ?? ''
      if (url.includes('/refresh-token') || url.includes('/login')) {
        handleLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axiosClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        handleLogout()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post<
          StandardResponse<{ accessToken: string }>
        >(`${BASE_URL}/v1/accounts/refresh-token`, { refreshToken })

        const newToken = data.data?.accessToken
        if (!data.success || !newToken) throw new Error('Refresh token failed')

        localStorage.setItem('accessToken', newToken)
        processQueue(null, newToken)
        isRefreshing = false

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return axiosClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        isRefreshing = false
        handleLogout()
        return Promise.reject(refreshError)
      }
    }

    console.error('API Error:', error.response?.data?.message || error.message)
    return Promise.reject(error)
  }
)

export default axiosClient
