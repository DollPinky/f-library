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
export type TitleModalBook = "Borrow" | "Return";
