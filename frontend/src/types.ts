export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  current: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
}

export type RecordStatus = "Subscribed" | "Unsubscribed";

export interface RecordEntry {
  bookId: string;
  readerName: string;
  readerId: string;
  bookName: string;
  author: string;
  duration: string;
  status: RecordStatus;
  fee: number;
  readerAvatarUrl: string;
}
