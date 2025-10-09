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
