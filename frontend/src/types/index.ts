
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
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'RENEWED'
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
  number: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
  sort?: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  hasContent: boolean
  // Frontend compatibility aliases
  pageNumber?: number
  pageSize?: number
}

export interface DashboardStats {
  totalBooks: number
  totalReaders: number
  activeBorrowings: number
  totalLibraries: number
  
  previousTotalBooks?: number
  previousTotalReaders?: number
  previousActiveBorrowings?: number
  previousTotalLibraries?: number
  
  overdueBooks: number
  returnedToday: number
  newBooksThisMonth: number
  newReadersThisMonth: number
  
  hanoiBooks: number
  hanoiReaders: number
  hanoiBorrowings: number
  
  hcmBooks: number
  hcmReaders: number
  hcmBorrowings: number
  
  danangBooks: number
  danangReaders: number
  danangBorrowings: number
}

export interface ChartData {
  // Borrowing trends over time
  borrowingTrends?: BorrowingTrend[]
  
  // Category distribution
  categoryDistribution?: CategoryDistribution[]
  
  // Top books
  topBooks?: TopBook[]
  
  // Campus comparison
  campusStats?: CampusStats[]
  
  // Monthly stats
  monthlyStats?: MonthlyStats[]
}

export interface BorrowingTrend {
  date: string
  borrowCount: number
  returnCount: number
  overdueCount: number
}

export interface CategoryDistribution {
  categoryName: string
  bookCount: number
  borrowCount: number
  percentage: number
}

export interface TopBook {
  bookId: number
  title: string
  author: string
  borrowCount: number
  rating: number
  category: string
}

export interface CampusStats {
  campusName: string
  totalBooks: number
  totalReaders: number
  activeBorrowings: number
  overdueBooks: number
}

export interface MonthlyStats {
  month: string
  newBooks: number
  newReaders: number
  totalBorrowings: number
  totalReturns: number
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