
export interface User {
  id: number
  username: string
  email: string
  fullName: string
  role: 'ADMIN' | 'LIBRARIAN' | 'MANAGER' | 'READER'
  campusId?: number
  libraryId?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Campus {
  id: number
  name: string
  address: string
  city: string
  isActive: boolean
  libraries: Library[]
}

export interface Library {
  id: number
  name: string
  campusId: number
  address: string
  phone: string
  email: string
  isActive: boolean
  campus?: Campus
}

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  publisher: string
  publishYear: number
  description?: string
  categoryId: number
  category?: Category
  copies: BookCopy[]
  totalCopies: number
  availableCopies: number
}

export interface BookCopy {
  id: number
  bookId: number
  libraryId: number
  qrCode: string
  status: 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'MAINTENANCE'
  location: string
  book?: Book
  library?: Library
  currentBorrowing?: Borrowing
}

export interface Category {
  id: number
  name: string
  description?: string
  parentId?: number
  children?: Category[]
}

export interface Borrowing {
  id: number
  readerId: number
  bookCopyId: number
  borrowedAt: string
  dueDate: string
  returnedAt?: string
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE'
  fineAmount?: number
  reader?: User
  bookCopy?: BookCopy
}

export interface BookSearchParams {
  query?: string
  categoryId?: number
  libraryId?: number
  status?: string
  page?: number
  size?: number
}

export interface BorrowingSearchParams {
  readerId?: number
  status?: string
  libraryId?: number
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface DashboardStats {
  totalBooks: number
  totalReaders: number
  activeBorrowings: number
  overdueBorrowings: number
  totalLibraries: number
  totalCampuses: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

export interface LoginForm {
  username: string
  password: string
}

export interface BookForm {
  title: string
  author: string
  isbn: string
  publisher: string
  publishYear: number
  description?: string
  categoryId: number
  copies: {
    libraryId: number
    quantity: number
    location: string
  }[]
}

export interface BorrowingForm {
  readerId: number
  bookCopyId: number
  dueDate: string
} 