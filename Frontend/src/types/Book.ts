export interface BorrowedBook {
  id: string;
  bookName: string;
  borrowDate: string;
  returnDate: string;
}

export interface DonatedBook {
  id: string;
  bookName: string;
  donationDate: string;
  campus: string;
  points: number;
}

export interface BookDonationFormData {
  username: string;
  title: string;
  campusCode: string;
  shelfLocation: string;
  category: string;
  description: string;
}

export interface ImportBookFromExcelResponse {
  totalRecords: number;
  successCount: number;
  errorCount: number;
  errors: Errors[];
}
export interface Errors {
  rowNumber: number;
  isbn: string;
  errorMessage: string;
}
