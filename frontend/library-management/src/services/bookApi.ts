import axiosClient from '@/services/axiosClient'

export const getAllBooks = async (token: string) => {
  const res = await axiosClient.get('/books/all', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const getBookById = async (bookId: string, token: string) => {
  const res = await axiosClient.get(`/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const getHistoryByBookCopyId = async (
  bookCopyId: string,
  token: string
) => {
  const res = await axiosClient.get(`/borrowings/${bookCopyId}/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}
