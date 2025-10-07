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
  color: string;
  parentCategory: string;
  subCategories: string[];
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
  publisher: string;
  year: number;
  description: string;
  category: Category;
  bookCopies: BookCopy[];
  
  createdAt: string;
  updatedAt: string;
  bookCoverUrl: string;
}
