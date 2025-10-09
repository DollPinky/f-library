import type {
  BorrowedBookResponse,
  BrorrowHistory,
  StandardResponse,
} from "@/types";
import axiosClient from "./axiosClient";

export const getBorrowHistoryByBookCopyId = async (
  bookCopyId: string
): Promise<StandardResponse<BrorrowHistory>> => {
  const res = await axiosClient.get(`borrowings/${bookCopyId}/history`);
  return res.data;
};

export const borrowBookByBookCopyId = async (
  bookCopyId: string
): Promise<StandardResponse<BorrowedBookResponse>> => {
  const res = await axiosClient.post("/borrowings/borrow", {
    bookCopyId,
  });
  return res.data;
};
