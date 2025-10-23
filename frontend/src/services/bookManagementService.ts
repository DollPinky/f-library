import axiosClient from "@/services/axiosClient";
import type {
  Book,
  BookSearchParams,
  BookSearchResponse,
  CreateBookRequest,
  UpdateBookRequest,
  DeleteBookResponse,
  StandardResponse,
} from "@/types";
import type { ImportBookFromExcelResponse } from "@/types/Book";

// Create new book
export const createBooks = async (
  payload: CreateBookRequest
): Promise<StandardResponse<Book>> => {
  const res = await axiosClient.post("/books/create", payload);
  return res.data;
};

// Search books with parameters
export const searchBooks = async (
  params: BookSearchParams
): Promise<StandardResponse<BookSearchResponse>> => {
  const res = await axiosClient.get("/books/search", { params });
  return res.data;
};

// Update book
export const updateBook = async (
  bookId: string,
  payload: UpdateBookRequest
): Promise<StandardResponse<Book>> => {
  const res = await axiosClient.put(`/books/${bookId}`, payload);
  return res.data;
};

// Delete book
export const deleteBook = async (
  bookId: string
): Promise<StandardResponse<DeleteBookResponse>> => {
  const res = await axiosClient.delete(`/books/${bookId}`);
  return res.data;
};
// get All Book

export const getAllBooks = async (): Promise<StandardResponse<Book[]>> => {
  const res = await axiosClient.get("/books/all");
  return res.data;
};
export const getBookByBookId = async (
  bookId: string
): Promise<StandardResponse<Book>> => {
  const res = await axiosClient.get(`/books/${bookId}`);
  return res.data;
};

export const importBookFromExcel = async (
  file: File
): Promise<StandardResponse<ImportBookFromExcelResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post("/books/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const exportBookFromExcel = async (): Promise<void> => {
  const res = await axiosClient.get("/book-copies/generate-all-qr-codes", {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });

  const url = window.URL.createObjectURL(
    new Blob([res.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "book-qr-codes.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
export const bookManagementService = {
  createBooks,
  searchBooks,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookByBookId,
  importBookFromExcel,
};

export default bookManagementService;
