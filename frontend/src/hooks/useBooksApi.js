"use client"

import { useState, useCallback, useRef } from "react"
import bookService from "../services/bookService"

export const useBooksApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiFunction(...args)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoize all API functions to prevent re-creation
  const getBookById = useCallback(
      async (bookId) => {
        const response = await apiCall(bookService.getBookById, bookId)
        return response.data
      },
      [apiCall],
  )

  const searchBooks = useCallback(
      async (params = {}) => {
        const response = await apiCall(bookService.getBooks, params)
        return response.data
      },
      [apiCall],
  )

  const createBook = useCallback(
      async (bookData) => {
        const response = await apiCall(bookService.createBook, bookData)
        return response.data
      },
      [apiCall],
  )

  const updateBook = useCallback(
      async (bookId, bookData) => {
        const response = await apiCall(bookService.updateBook, bookId, bookData)
        return response.data
      },
      [apiCall],
  )

  const deleteBook = useCallback(
      async (bookId) => {
        const response = await apiCall(bookService.deleteBook, bookId)
        return response.data
      },
      [apiCall],
  )

  return {
    loading,
    error,
    getBookById,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
  }
}

export const useBooks = () => {
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })

  // Use refs to prevent unnecessary re-renders
  const isLoadingRef = useRef(false)
  const hasLoadedRef = useRef(false)
  const lastLoadTime = useRef(0)

  const api = useBooksApi()

  // Stable loadBooks function that prevents duplicate calls
  const loadBooks = useCallback(
      async (searchParams = {}) => {
        const now = Date.now()

        // Prevent duplicate calls within 1 second
        if (isLoadingRef.current || now - lastLoadTime.current < 1000) {
          console.log("useBooks: Skipping duplicate loadBooks call")
          return
        }

        isLoadingRef.current = true
        lastLoadTime.current = now

        try {
          console.log("useBooks: Loading books with params:", searchParams)
          const result = await api.searchBooks(searchParams)

          setBooks(result.content || [])
          setPagination({
            page: result.pageable?.pageNumber || 0,
            size: result.pageable?.pageSize || 10,
            totalElements: result.totalElements || 0,
            totalPages: result.totalPages || 0,
          })

          hasLoadedRef.current = true
        } catch (error) {
          console.error("Error loading books:", error)
        } finally {
          isLoadingRef.current = false
        }
      },
      [api.searchBooks],
  )

  // Stable refreshBooks function
  const refreshBooks = useCallback(async () => {
    console.log("useBooks: Refreshing books")
    hasLoadedRef.current = false // Reset to allow refresh
    return loadBooks()
  }, [loadBooks])

  return {
    books,
    pagination,
    loading: api.loading,
    error: api.error,
    loadBooks,
    refreshBooks,
    ...api,
  }
}
