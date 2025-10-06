export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  current: boolean;
}

export type RecordStatus = "Subscribed" | "Unsubscribed";

export type BrorrowHistory = {
  id: string;
  borrower: string;
  borrowDate: string;
  returnDate?: string;
};
export interface Book {
  id: string;
  name: string;
  author: string;
  category: string;
  isbn: string;
  status: "Available" | "Borrowed" | "Maintenance" | "Reserved";
  totalCopies: number;
  availableCopies: number;
  publishedDate: string;
  description: string;
  coverImage?: string;
  readerName?: string;
  readerId?: string;
  duration?: string;
  fee?: number;
  // history: BrorrowHistory[];
}

export type BookStatus = "Available" | "Borrowed" | "Maintenance" | "Reserved";
