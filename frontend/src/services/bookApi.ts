import type { BookDonationFormData } from "@/types/Book";
import axiosClient from "./axiosClient";

export const getAllBooks = async () => {
  const res = await axiosClient.get("/books/all");
  return res.data.data;
};

export const getBookById = async (bookId: string, token: string) => {
  const res = await axiosClient.get(`/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const getHistoryByBookCopyId = async (
  bookCopyId: string,
  token: string
) => {
  const res = await axiosClient.get(`/borrowings/${bookCopyId}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const borrowBookByBookCopyId = async (
  bookCopyId: string,
  companyAccount: string
) => {
  const res = await axiosClient.post(
    "/borrowings/borrow",
    {
      bookCopyId,
      companyAccount
    }
  );
  return res;
};

export const donateBook = async (payload: BookDonationFormData) => {
  const res = await axiosClient.post("/book-copies/donation", {
    payload,
  });
  return res;
};
