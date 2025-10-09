import axiosClient from '@/services/axiosClient'
import type {
  Book,
  BookSearchParams,
  BookSearchResponse,
  CreateBookRequest,
  UpdateBookRequest,
  DeleteBookResponse,
  StandardResponse
} from '@/types'

// Create new book
export const createBooks = async (
  payload: CreateBookRequest
): Promise<StandardResponse<Book>> => {
  const res = await axiosClient.post('/books/create', payload)
  return res.data
}

// Search books with parameters
export const searchBooks = async (
  params: BookSearchParams
): Promise<StandardResponse<BookSearchResponse>> => {
  const res = await axiosClient.get('/books/search', { params })
  return res.data
}

// Update book
export const updateBook = async (
  bookId: string,
  payload: UpdateBookRequest
): Promise<StandardResponse<Book>> => {
  const res = await axiosClient.put(`/books/${bookId}`, payload)
  return res.data
}

// Delete book
export const deleteBook = async (
  bookId: string
): Promise<StandardResponse<DeleteBookResponse>> => {
  const res = await axiosClient.delete(`/books/${bookId}`)
  return res.data
}

export const bookManagementService = {
  createBooks,
  searchBooks,
  updateBook,
  deleteBook
}

export default bookManagementService
