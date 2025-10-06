export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  current: boolean;
}

export type RecordStatus = "Subscribed" | "Unsubscribed";

// export interface RecordEntry {
//   bookId: string;
//   bookImg: string;
//   readerName: string;
//   readerId: string;
//   bookName: string;
//   author: string;
//   duration: string;
//   status: RecordStatus;
//   fee: number;
//   readerAvatarUrl: string;
// }

export type BrorrowHistory = {
  id: string;
  borrower: string;
  borrowDate: string;
  returnDate?: string;
};
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  status: RecordStatus;
  readerName?: string;
  readerId?: string;
  duration?: string;
  fee?: number;
  history: BrorrowHistory[];
}
