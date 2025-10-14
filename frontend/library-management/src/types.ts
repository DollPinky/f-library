export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  current: boolean;
}

export type RecordStatus = "Subscribed" | "Unsubscribed";

// Auth types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  accessToken?: string;
  refreshToken?: string;
}

export type BrorrowHistory = {
  username: string;
  borrowDate: string;
  returnedDate: string;
};

export type BookStatus = "Available" | "Borrowed" | "Maintenance" | "Reserved";

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  color?: string;
  parentCategory?: Category;
  subCategories?: Category[];
  bookCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  campusId: string;
  name: string;
  code: string;
  address: string;
}
export type BookCopyStatus =
  | "AVAILABLE"
  | "BORROWED"
  | "MAINTENANCE"
  | "RESERVED";
export interface BookCopy {
  bookCopyId: string;
  book: string;
  campus: Campus;
  status: BookCopyStatus;
  shelfLocation: string;
  borrowingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  bookId: string;
  title: string;
  author: string;
  publisher?: string;
  year?: number;
  description?: string;
  category?: Category;
  bookCopies?: BookCopy[];
  createdAt?: string;
  updatedAt?: string;
  bookCoverUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errorCode?: string;
}

export type UserRole = "ADMIN" | "READER";

export interface User {
  accountId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  companyAccount: string;
  role: UserRole;
  campus: Campus | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accountId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  companyAccount: string;
  role: UserRole;
  campus: Campus | null;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
  setUser: (user: User | null) => void;
}

export interface AuthStorage {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthError {
  message: string;
  errorCode?: string;
  status?: number;
}

// Book Management API Types
export interface BookSearchParams {
  query?: string;
  categoryId?: string;
  campusId?: string;
  status?: BookStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface BookSearchResponse {
  books: Book[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  publisher?: string;
  publishYear?: number;
  description?: string;
  categoryId?: string;
  bookCover?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  publisher?: string;
  publishYear?: number;
  description?: string;
  categoryId?: string;
  bookCover?: string;
}

export interface ImportBooksRequest {
  file: File;
}

export interface ImportError {
  rowNumber: number;
  isbn: string;
  errorMessage: string;
}

export interface DeleteBookResponse {
  success: boolean;
  message: string;
}

export interface BorrowedBookResponse {
  success: boolean;
  message: string;
}
export interface ReturnedBookResponse {
  success: boolean;
  message: string;
}
