import axios from 'axios'
import { 
  Book, 
  BookCopy, 
  Borrowing, 
  User, 
  Campus, 
  Library, 
  Category,
  BookSearchParams,
  BorrowingSearchParams,
  PaginatedResponse,
  ApiResponse,
  DashboardStats
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials)
    return response.data
  },
  
  register: async (userData: {
    username: string
    email: string
    password: string
    fullName: string
    phone: string
    studentId?: string | null
    faculty?: string | null
    major?: string | null
    year?: number | null
    campusId?: number | null
    libraryId?: number | null
    role: string
    isActive: boolean
    profile?: {
      studentId?: string
      faculty?: string
      major?: string
      year?: number
      campusId?: number
      libraryId?: number
    }
  }) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', userData)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout')
    return response.data
  },
  
  refreshToken: async () => {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh')
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/profile')
    return response.data
  },
  
  updateProfile: async (profileData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', profileData)
    return response.data
  },
  
  changePassword: async (passwordData: { oldPassword: string; newPassword: string }) => {
    const response = await api.post<ApiResponse<void>>('/auth/change-password', passwordData)
    return response.data
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email })
    return response.data
  },
  
  resetPassword: async (resetData: { token: string; newPassword: string }) => {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', resetData)
    return response.data
  }
}

export const booksAPI = {
  getBooks: async (params: BookSearchParams = {}) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Book>>>('/books', { params })
    return response.data
  },
  
  getBook: async (id: number) => {
    const response = await api.get<ApiResponse<Book>>(`/books/${id}`)
    return response.data
  },
  
  createBook: async (bookData: any) => {
    const response = await api.post<ApiResponse<Book>>('/books', bookData)
    return response.data
  },
  
  updateBook: async (id: number, bookData: any) => {
    const response = await api.put<ApiResponse<Book>>(`/books/${id}`, bookData)
    return response.data
  },
  
  deleteBook: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/books/${id}`)
    return response.data
  },
  
  searchBooks: async (query: string) => {
    const response = await api.get<ApiResponse<Book[]>>('/books/search', {
      params: { q: query }
    })
    return response.data
  },
}

export const bookCopiesAPI = {
  getBookCopies: async (bookId: number) => {
    const response = await api.get<ApiResponse<BookCopy[]>>(`/books/${bookId}/copies`)
    return response.data
  },
  
  getBookCopy: async (id: number) => {
    const response = await api.get<ApiResponse<BookCopy>>(`/book-copies/${id}`)
    return response.data
  },
  
  createBookCopy: async (bookCopyData: any) => {
    const response = await api.post<ApiResponse<BookCopy>>('/book-copies', bookCopyData)
    return response.data
  },
  
  updateBookCopy: async (id: number, bookCopyData: any) => {
    const response = await api.put<ApiResponse<BookCopy>>(`/book-copies/${id}`, bookCopyData)
    return response.data
  },
  
  deleteBookCopy: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/book-copies/${id}`)
    return response.data
  },
}

export const borrowingsAPI = {
  getBorrowings: async (params: BorrowingSearchParams = {}) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Borrowing>>>('/borrowings', { params })
    return response.data
  },
  
  getBorrowing: async (id: number) => {
    const response = await api.get<ApiResponse<Borrowing>>(`/borrowings/${id}`)
    return response.data
  },
  
  createBorrowing: async (borrowingData: any) => {
    const response = await api.post<ApiResponse<Borrowing>>('/borrowings', borrowingData)
    return response.data
  },
  
  returnBook: async (id: number) => {
    const response = await api.put<ApiResponse<Borrowing>>(`/borrowings/${id}/return`)
    return response.data
  },
  
  renewBook: async (id: number) => {
    const response = await api.put<ApiResponse<Borrowing>>(`/borrowings/${id}/renew`)
    return response.data
  },
  
  getReaderBorrowings: async (readerId: number) => {
    const response = await api.get<ApiResponse<Borrowing[]>>(`/readers/${readerId}/borrowings`)
    return response.data
  },
}

export const usersAPI = {
  getUsers: async (params: any = {}) => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params })
    return response.data
  },
  
  getUser: async (id: number) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`)
    return response.data
  },
  
  createUser: async (userData: any) => {
    const response = await api.post<ApiResponse<User>>('/users', userData)
    return response.data
  },
  
  updateUser: async (id: number, userData: any) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData)
    return response.data
  },
  
  deleteUser: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`)
    return response.data
  },
}

export const librariesAPI = {
  getLibraries: async () => {
    const response = await api.get<ApiResponse<Library[]>>('/libraries')
    return response.data
  },
  
  getLibrary: async (id: number) => {
    const response = await api.get<ApiResponse<Library>>(`/libraries/${id}`)
    return response.data
  },
}

export const campusesAPI = {
  getCampuses: async () => {
    const response = await api.get<ApiResponse<Campus[]>>('/campuses')
    return response.data
  },
  
  getCampus: async (id: number) => {
    const response = await api.get<ApiResponse<Campus>>(`/campuses/${id}`)
    return response.data
  },
}

export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data
  },
  
  getCategory: async (id: number) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    return response.data
  },
}

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return response.data
  },
  
  getBorrowingChart: async (period: string = 'month') => {
    const response = await api.get<ApiResponse<any>>('/dashboard/borrowings-chart', {
      params: { period }
    })
    return response.data
  },
  
  getPopularBooks: async (limit: number = 10) => {
    const response = await api.get<ApiResponse<Book[]>>('/dashboard/popular-books', {
      params: { limit }
    })
    return response.data
  },
}

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health')
    return response.data
  },
}

export default api 