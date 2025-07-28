"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useBooks } from "../../../hooks/useBooksApi"
import TableView from "../../../components/ui/TableView"
import DetailDrawer from "../../../components/ui/DetailDrawer"
import ActionButton from "../../../components/ui/ActionButton"
import NotificationToast from "../../../components/ui/NotificationToast"
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton"
import categoryService from "../../../services/categoryService"
import libraryService from "../../../services/libraryService"
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CheckCircleIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import RealTimeSearch from "../../../components/ui/RealTimeSearch"

const AdminBooksPage = () => {
  const router = useRouter()
  const urlParamsProcessed = useRef(false)
  const hasInitialLoad = useRef(false)

  const { books, pagination, loading, error, loadBooks, refreshBooks, updateFilters, deleteBook, updateBook } =
      useBooks()

  // Local state
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" })
  const [selectedBook, setSelectedBook] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [categories, setCategories] = useState([])
  const [libraries, setLibraries] = useState([])
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    publicationYear: "",
    isbn: "",
    description: "",
    categoryId: "",
  })
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    library: "",
    category: "",
  })

  // Real-time search state
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [isRealTimeSearchActive, setIsRealTimeSearchActive] = useState(false)

  // Stable notification function
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ show: true, message, type })
  }, [])

  // Initial data load - Load books on component mount
  useEffect(() => {
    if (!hasInitialLoad.current) {
      console.log("AdminBooksPage: Initial load triggered")
      hasInitialLoad.current = true
      loadBooks()
    }
  }, [loadBooks])

  // Load categories and libraries on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, librariesResponse] = await Promise.all([
          categoryService.getCategories({
            page: 0,
            size: 100,
            sortBy: "name",
            sortDirection: "ASC",
          }),
          libraryService.getAllLibraries(),
        ])

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.content || [])
        }
        if (librariesResponse.success) {
          setLibraries(librariesResponse.data.content || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        showNotification("Không thể tải dữ liệu danh mục và thư viện", "error")
      }
    }
    fetchData()
  }, [showNotification])

  // Handle URL parameters for category filtering
  useEffect(() => {
    if (urlParamsProcessed.current || !updateFilters) return

    const urlParams = new URLSearchParams(window.location.search)
    const categoryId = urlParams.get("categoryId")
    const categoryName = urlParams.get("categoryName")

    if (categoryId) {
      const newFilters = {
        categoryId: categoryId,
        search: categoryName ? `Danh mục: ${decodeURIComponent(categoryName)}` : "",
      }

      setFilters((prev) => ({
        ...prev,
        category: categoryId,
        search: newFilters.search,
      }))

      updateFilters(newFilters)
      urlParamsProcessed.current = true
    }
  }, [updateFilters])

  // Debug: Log books data
  useEffect(() => {
    console.log("AdminBooksPage: Books data updated", {
      booksCount: books?.length,
      loading,
      error,
      pagination,
    })
  }, [books, loading, error, pagination])

  // Stable search handler
  const handleSearch = useCallback(
      (searchTerm) => {
        console.log("AdminBooksPage: Traditional search triggered", searchTerm)
        if (!updateFilters) {
          console.error("updateFilters is not available")
          return
        }

        const newFilters = { ...filters, search: searchTerm }
        setFilters(newFilters)
        updateFilters(newFilters)
      },
      [filters, updateFilters],
  )

  // Stable filter change handler
  const handleFilterChange = useCallback(
      (filterType, value) => {
        console.log("AdminBooksPage: Filter change", filterType, value)
        if (!updateFilters) {
          console.error("updateFilters is not available")
          return
        }

        const newFilters = { ...filters, [filterType]: value }
        setFilters(newFilters)
        updateFilters(newFilters)
      },
      [filters, updateFilters],
  )

  // Stable page change handler
  const handlePageChange = useCallback(
      (newPage) => {
        console.log("AdminBooksPage: Page change", newPage)
        if (!loadBooks) {
          console.error("loadBooks is not available")
          return
        }

        loadBooks({ ...filters, page: newPage - 1 })
      },
      [filters, loadBooks],
  )

  // Real-time search handler
  const handleRealTimeSearch = useCallback(
      (searchTerm) => {
        console.log("AdminBooksPage: Real-time search triggered", searchTerm)
        setSearchLoading(true)

        try {
          if (!searchTerm.trim()) {
            setSearchResults([])
            setIsRealTimeSearchActive(false)
            setSearchLoading(false)
            return
          }

          // Filter books based on search term for real-time results
          if (books && books.length > 0) {
            const results = books.filter(
                (book) =>
                    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
            )

            setSearchResults(results.slice(0, 8)) // Limit to 8 results for dropdown
            setIsRealTimeSearchActive(true)
          } else {
            setSearchResults([])
            setIsRealTimeSearchActive(false)
          }
        } catch (error) {
          console.error("Real-time search error:", error)
          showNotification("Có lỗi xảy ra khi tìm kiếm", "error")
        } finally {
          setSearchLoading(false)
        }
      },
      [books, showNotification],
  )

  // Handle search result click
  const handleSearchResultClick = useCallback((book) => {
    console.log("AdminBooksPage: Search result clicked", book.title)
    setSelectedBook(book)
    setIsDrawerOpen(true)
    setIsRealTimeSearchActive(false)
  }, [])

  // Refresh data handler
  const handleRefresh = useCallback(async () => {
    console.log("AdminBooksPage: Refresh triggered")
    try {
      await refreshBooks()
      showNotification("Dữ liệu đã được cập nhật", "success")
    } catch (error) {
      console.error("Refresh error:", error)
      showNotification("Không thể cập nhật dữ liệu", "error")
    }
  }, [refreshBooks, showNotification])

  // Book columns definition
  const bookColumns = [
    {
      key: "title",
      header: "Tên sách",
      render: (value, row) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpenIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sage-900 dark:text-sage-100 line-clamp-1">{value}</div>
              <div className="text-sm text-sage-500 dark:text-sage-400 line-clamp-1">ISBN: {row.isbn || "N/A"}</div>
            </div>
          </div>
      ),
    },
    {
      key: "author",
      header: "Tác giả",
      render: (value) => (
          <div className="text-sage-700 dark:text-sage-300 font-medium line-clamp-1">{value || "N/A"}</div>
      ),
    },
    {
      key: "publisher",
      header: "Nhà xuất bản",
      render: (value) => <div className="text-sage-600 dark:text-sage-400 line-clamp-1">{value || "N/A"}</div>,
    },
    {
      key: "year",
      header: "Năm xuất bản",
      render: (value) => <div className="text-sage-600 dark:text-sage-400">{value || "N/A"}</div>,
    },
    {
      key: "category",
      header: "Danh mục",
      render: (value, row) => (
          <div className="text-sage-600 dark:text-sage-400 line-clamp-1">{row.category?.name || "Chưa phân loại"}</div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (value, row) => {
        const availableCopies = row.bookCopies?.filter((copy) => copy.status === "AVAILABLE").length || 0
        const totalCopies = row.bookCopies?.length || 0

        let statusText, statusColor
        if (availableCopies > 0) {
          statusText = `Có sẵn (${availableCopies}/${totalCopies})`
          statusColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
        } else if (totalCopies > 0) {
          statusText = `Đã mượn (${totalCopies}/${totalCopies})`
          statusColor = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
        } else {
          statusText = "Hết sách (0/0)"
          statusColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusText}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (value, row) => (
          <div className="flex items-center space-x-2">
            <ActionButton
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedBook(row)
                  setIsDrawerOpen(true)
                }}
                className="min-h-[32px] px-2"
            >
              <EyeIcon className="w-4 h-4" />
            </ActionButton>
            <ActionButton
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditBook(row)
                }}
                className="min-h-[32px] px-2"
            >
              <PencilIcon className="w-4 h-4" />
            </ActionButton>
            <ActionButton
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteBook(row)
                }}
                className="min-h-[32px] px-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="w-4 h-4" />
            </ActionButton>
          </div>
      ),
    },
  ]

  const handleEditBook = (book) => {
    setEditingBook(book)
    setEditFormData({
      title: book.title || "",
      author: book.author || "",
      publisher: book.publisher || "",
      publicationYear: book.year || "",
      isbn: book.isbn || "",
      description: book.description || "",
      categoryId: book.category?.categoryId || "",
    })
    setIsEditModalOpen(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editFormData.title || !editFormData.author) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "warning")
      return
    }
    if (!editFormData.categoryId) {
      showNotification("Vui lòng chọn danh mục", "warning")
      return
    }

    try {
      const bookData = {
        title: editFormData.title,
        author: editFormData.author,
        publisher: editFormData.publisher,
        publishYear: editFormData.publicationYear ? Number.parseInt(editFormData.publicationYear) : null,
        isbn: editFormData.isbn,
        description: editFormData.description,
        categoryId: editFormData.categoryId,
      }

      await updateBook(editingBook.bookId, bookData)
      showNotification("Cập nhật sách thành công!", "success")
      setIsEditModalOpen(false)
      refreshBooks()
    } catch (error) {
      showNotification(error.message || "Không thể cập nhật sách", "error")
    }
  }

  const handleDeleteBook = async (book) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      try {
        await deleteBook(book.bookId)
        showNotification("Xóa sách thành công", "success")
        refreshBooks()
      } catch (error) {
        showNotification("Lỗi khi xóa sách", "error")
      }
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      status: "",
      library: "",
      category: "",
    }
    setFilters(clearedFilters)
    if (updateFilters) {
      updateFilters(clearedFilters)
    }
  }

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("AdminBooksPage: Error occurred", error)
      showNotification(error, "error")
    }
  }, [error, showNotification])

  // Loading state
  if (loading && (!books || books.length === 0)) {
    return (
        <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <LoadingSkeleton type="card" count={1} className="mb-8" />
              <LoadingSkeleton type="table" count={1} />
            </div>
          </div>
        </div>
    )
  }

  // Error state
  if (error && (!books || books.length === 0)) {
    return (
        <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 text-lg mb-4">Có lỗi xảy ra khi tải dữ liệu: {error}</div>
                <ActionButton onClick={handleRefresh} className="mr-4">
                  Thử lại
                </ActionButton>
                <ActionButton variant="outline" onClick={() => router.push("/admin")}>
                  Quay lại Dashboard
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
        <div className="p-4 sm:p-6 lg:p-6">
          <div className="max-w-none mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                    Quản lý sách
                  </h1>
                  <p className="text-sm sm:text-base text-sage-600 dark:text-sage-400">
                    Quản lý và theo dõi tất cả sách trong hệ thống ({books?.length || 0} sách)
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <ActionButton variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="group">
                    <svg
                        className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-300"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Làm mới
                  </ActionButton>
                  <ActionButton
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="sm:hidden"
                  >
                    <FunnelIcon className="w-4 h-4 mr-1" />
                    Lọc
                  </ActionButton>
                  <ActionButton
                      variant="primary"
                      onClick={() => router.push("/admin/books/create")}
                      className="group min-h-[40px]"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Thêm sách mới</span>
                    <span className="sm:hidden">Thêm</span>
                  </ActionButton>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 min-w-0">
                    <RealTimeSearch
                        onSearch={handleRealTimeSearch}
                        searchResults={searchResults}
                        loading={searchLoading}
                        placeholder="Tìm kiếm theo tên sách, tác giả, ISBN, nhà xuất bản..."
                        className="w-full"
                        onResultClick={handleSearchResultClick}
                    />

                    {/* Traditional search fallback */}
                    <div className="mt-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon className="h-4 w-4 text-sage-400" />
                        </div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="block w-full pl-9 pr-3 py-2 border border-sage-200 dark:border-sage-700 rounded-lg bg-sage-50 dark:bg-neutral-800 text-sage-900 dark:text-sage-100 placeholder-sage-500 dark:placeholder-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-transparent text-sm"
                            placeholder="Hoặc tìm kiếm truyền thống..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("status", filters.status === "available" ? "" : "available")}
                        className={`min-h-[40px] ${filters.status === "available" ? "bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300" : ""}`}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Có sẵn</span>
                    </ActionButton>

                    <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("status", filters.status === "borrowed" ? "" : "borrowed")}
                        className={`min-h-[40px] ${filters.status === "borrowed" ? "bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300" : ""}`}
                    >
                      <UserGroupIcon className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Đã mượn</span>
                    </ActionButton>

                    <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="min-h-[40px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Xóa lọc</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Search Results Indicator */}
            {isRealTimeSearchActive && searchResults.length > 0 && (
                <div className="mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Tìm thấy {searchResults.length} kết quả phù hợp
                    </span>
                      </div>
                      <ActionButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsRealTimeSearchActive(false)
                            setSearchResults([])
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Đóng
                      </ActionButton>
                    </div>
                  </div>
                </div>
            )}

            {/* No Books Message */}
            {!loading && (!books || books.length === 0) && (
                <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-8 text-center">
                  <BookOpenIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-2">Chưa có sách nào</h3>
                  <p className="text-sage-600 dark:text-sage-400 mb-6">
                    Hệ thống chưa có sách nào. Hãy thêm sách đầu tiên để bắt đầu.
                  </p>
                  <ActionButton variant="primary" onClick={() => router.push("/admin/books/create")} className="group">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Thêm sách đầu tiên
                  </ActionButton>
                </div>
            )}

            {/* Books Table */}
            {books && books.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft overflow-hidden">
                  <TableView
                      data={isRealTimeSearchActive ? searchResults : books}
                      columns={bookColumns}
                      loading={loading}
                      pagination={
                        isRealTimeSearchActive
                            ? null
                            : {
                              currentPage: pagination.page + 1,
                              totalPages: pagination.totalPages,
                              total: pagination.totalElements,
                              from: pagination.page * pagination.size + 1,
                              to: Math.min((pagination.page + 1) * pagination.size, pagination.totalElements),
                            }
                      }
                      onPageChange={isRealTimeSearchActive ? null : handlePageChange}
                      onRowClick={(book) => {
                        setSelectedBook(book)
                        setIsDrawerOpen(true)
                      }}
                  />
                </div>
            )}
          </div>
        </div>

        {/* Edit Book Modal */}
        {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100">Chỉnh sửa sách</h2>
                    <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(false)}
                        className="min-h-[32px] px-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </ActionButton>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                          Tên sách *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditInputChange}
                            required
                            className="input-primary"
                            placeholder="Nhập tên sách"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">Tác giả *</label>
                        <input
                            type="text"
                            name="author"
                            value={editFormData.author}
                            onChange={handleEditInputChange}
                            required
                            className="input-primary"
                            placeholder="Nhập tác giả"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                          Nhà xuất bản
                        </label>
                        <input
                            type="text"
                            name="publisher"
                            value={editFormData.publisher}
                            onChange={handleEditInputChange}
                            className="input-primary"
                            placeholder="Nhập nhà xuất bản"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                          Năm xuất bản
                        </label>
                        <input
                            type="number"
                            name="publicationYear"
                            value={editFormData.publicationYear}
                            onChange={handleEditInputChange}
                            min="1900"
                            max="2030"
                            className="input-primary"
                            placeholder="Nhập năm xuất bản"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={editFormData.isbn}
                            onChange={handleEditInputChange}
                            className="input-primary"
                            placeholder="Nhập ISBN"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                          Danh mục *
                        </label>
                        <select
                            name="categoryId"
                            value={editFormData.categoryId}
                            onChange={handleEditInputChange}
                            className="input-primary"
                            required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((category) => (
                              <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">Mô tả</label>
                      <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          rows={4}
                          className="input-primary resize-none"
                          placeholder="Nhập mô tả về sách..."
                      />
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-sage-200 dark:border-sage-700">
                      <ActionButton type="submit" variant="primary" className="group">
                        <PencilIcon className="w-4 h-4 mr-2" />
                        <span>Cập nhật sách</span>
                      </ActionButton>
                      <ActionButton type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                        Hủy
                      </ActionButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        )}

        {/* Detail Drawer */}
        <DetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Chi tiết sách" size="xl">
          {selectedBook && (
              <div className="space-y-6">
                {/* Book Info */}
                <div>
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-20 h-20 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="w-10 h-10 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2 line-clamp-2">
                        {selectedBook.title}
                      </h3>
                      <p className="text-sage-600 dark:text-sage-400 line-clamp-1">
                        Tác giả: {selectedBook.author || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                        <p className="text-sage-900 dark:text-sage-100 font-medium line-clamp-1">
                          {selectedBook.author || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Nhà xuất bản</label>
                        <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{selectedBook.publisher || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Năm xuất bản</label>
                        <p className="text-sage-900 dark:text-sage-100">{selectedBook.publicationYear || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                        <p className="text-sage-900 dark:text-sage-100 font-mono line-clamp-1">
                          {selectedBook.isbn || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Danh mục</label>
                        <p className="text-sage-900 dark:text-sage-100 line-clamp-1">
                          {selectedBook.category?.name || "Chưa phân loại"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                        <p className="text-sage-900 dark:text-sage-100">
                          {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Cập nhật lần cuối</label>
                        <p className="text-sage-900 dark:text-sage-100">
                          {selectedBook.updatedAt ? new Date(selectedBook.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Mô tả</label>
                        <p className="text-sage-900 dark:text-sage-100 line-clamp-3">
                          {selectedBook.description || "Chưa có mô tả"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Copies */}
                <div>
                  <h4 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                    Các bản sách ({selectedBook.bookCopies?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedBook.bookCopies?.map((copy, index) => (
                        <div
                            key={index}
                            className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl border border-sage-200 dark:border-sage-700"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-medium text-sage-700 dark:text-sage-300">QR Code</label>
                              <p className="text-sage-900 dark:text-sage-100 font-mono text-sm line-clamp-1">{copy.qrCode}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Trạng thái</label>
                              <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                      copy.status === "AVAILABLE"
                                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                          : copy.status === "BORROWED"
                                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }`}
                              >
                          {copy.status === "AVAILABLE" ? "Có sẵn" : copy.status === "BORROWED" ? "Đã mượn" : "Bảo trì"}
                        </span>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Vị trí</label>
                              <p className="text-sage-900 dark:text-sage-100 line-clamp-1">{copy.shelfLocation || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                              <p className="text-sage-900 dark:text-sage-100 text-sm">
                                {copy.createdAt ? new Date(copy.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200 dark:border-sage-700">
                  <ActionButton
                      variant="outline"
                      onClick={() => handleEditBook(selectedBook)}
                      className="group min-h-[40px]"
                  >
                    <PencilIcon className="w-4 h-4 mr-2 group-hover:text-sage-600 dark:group-hover:text-sage-400" />
                    <span>Chỉnh sửa</span>
                  </ActionButton>
                  <ActionButton
                      variant="outline"
                      onClick={() => handleDeleteBook(selectedBook)}
                      className="group min-h-[40px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    <span>Xóa</span>
                  </ActionButton>
                  <ActionButton variant="outline" onClick={() => setIsDrawerOpen(false)} className="min-h-[40px]">
                    Đóng
                  </ActionButton>
                </div>
              </div>
          )}
        </DetailDrawer>

        {/* Notification Toast */}
        <NotificationToast
            message={notification.message}
            type={notification.type}
            isVisible={notification.show}
            onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
  )
}

export default AdminBooksPage
