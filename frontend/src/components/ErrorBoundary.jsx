"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import StatisticCard from "../components/ui/StatisticCard"
import RealTimeSearch from "../components/ui/RealTimeSearch"
import TableView from "../components/ui/TableView"
import DetailDrawer from "../components/ui/DetailDrawer"
import ActionButton from "../components/ui/ActionButton"
import NotificationToast from "../components/ui/NotificationToast"
import useDashboardData from "../hooks/useDashboardData"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import { UserGroupIcon, BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const Dashboard = () => {
    const router = useRouter()
    const {
        dashboardStats,
        recentBooks,
        books, // All books for search
        loading,
        error,
        refreshData,
        showNotification,
    } = useDashboardData()

    // Real-time search state
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAllBooks, setShowAllBooks] = useState(false)

    // Drawer state
    const [selectedBook, setSelectedBook] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: "", type: "info" })

    const icons = {
        books: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        ),
        readers: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
            </svg>
        ),
        borrowings: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        libraries: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
            </svg>
        ),
    }

    // Real-time search handler
    const handleRealTimeSearch = useCallback(
        async (searchTerm) => {
            setSearchLoading(true)
            setSearchTerm(searchTerm)

            try {
                if (!searchTerm.trim()) {
                    setSearchResults([])
                    setShowAllBooks(false)
                    return
                }

                // Filter books based on search term
                const results = books.filter(
                    (book) =>
                        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        book.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        book.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
                )

                // Limit results for dropdown (first 8 results)
                setSearchResults(results.slice(0, 8))

                // If user wants to see all results
                if (searchTerm.length >= 2) {
                    setShowAllBooks(results.length > 8)
                }
            } catch (error) {
                console.error("Search error:", error)
                showNotification("Có lỗi xảy ra khi tìm kiếm", "error")
            } finally {
                setSearchLoading(false)
            }
        },
        [books, showNotification],
    )

    // Handle search result click
    const handleSearchResultClick = useCallback((book) => {
        setSelectedBook(book)
        setIsDrawerOpen(true)
    }, [])

    // Handle view all search results
    const handleViewAllResults = useCallback(() => {
        if (searchTerm.trim()) {
            router.push(`/books?search=${encodeURIComponent(searchTerm.trim())}`)
        }
    }, [searchTerm, router])

    // Book table columns
    const bookColumns = [
        {
            key: "title",
            header: "Tên sách",
            render: (value, row) => (
                <div className="font-medium text-sage-900 dark:text-sage-100 text-responsive-body">{value}</div>
            ),
        },
        {
            key: "author",
            header: "Tác giả",
            render: (value) => <div className="text-sage-600 dark:text-sage-400 text-responsive-small">{value || "N/A"}</div>,
        },
        {
            key: "category",
            header: "Danh mục",
            render: (value, row) => (
                <div className="text-sage-600 dark:text-sage-400 text-responsive-small">{row.category?.name || "N/A"}</div>
            ),
        },
        {
            key: "bookCopies",
            header: "Số bản",
            render: (value) => (
                <div className="text-sage-600 dark:text-sage-400 text-responsive-small">{value?.length || 0}</div>
            ),
        },
        {
            key: "status",
            header: "Trạng thái",
            render: (value, row) => {
                const availableCopies = row.bookCopies?.filter((copy) => copy.status === "AVAILABLE").length || 0
                const totalCopies = row.bookCopies?.length || 0

                return (
                    <div className="flex items-center space-x-2">
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    availableCopies > 0
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
            >
              {availableCopies > 0 ? "Có sẵn" : "Hết sách"}
            </span>
                        <span className="text-xs text-sage-500 dark:text-sage-400">
              {availableCopies}/{totalCopies}
            </span>
                    </div>
                )
            },
        },
        {
            key: "actions",
            header: "Thao tác",
            render: (value, row) => (
                <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSelectedBook(row)
                        setIsDrawerOpen(true)
                    }}
                    className="action-button-responsive"
                >
                    Chi tiết
                </ActionButton>
            ),
        },
    ]

    const handleNotification = (message, type = "info") => {
        setNotification({ show: true, message, type })
    }

    if (error) {
        return (
            <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 section-padding">
                <div className="container-responsive">
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</div>
                        <ActionButton onClick={refreshData}>Thử lại</ActionButton>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-sage-50 dark:bg-neutral-950">
            {/* Main Content */}
            <div className="section-padding">
                <div className="container-responsive">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-responsive-h1 font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                            Dashboard Thư Viện
                        </h1>
                        <p className="text-sage-600 dark:text-sage-400 text-responsive-body">Tổng quan hệ thống quản lý thư viện</p>
                    </div>

                    {/* Statistics Grid - Responsive Layout */}
                    <div className="grid-responsive mb-6 sm:mb-8">
                        <StatisticCard
                            title="Tổng số sách"
                            value={dashboardStats?.totalBooks || 0}
                            change="+12.5%"
                            changeType="positive"
                            icon={icons.books}
                            className="card-responsive"
                        />

                        <StatisticCard
                            title="Độc giả hoạt động"
                            value={dashboardStats?.totalReaders || 0}
                            change="+8.2%"
                            changeType="positive"
                            icon={icons.readers}
                            className="card-responsive"
                        />

                        <StatisticCard
                            title="Sách đang mượn"
                            value={dashboardStats?.activeBorrowings || 892}
                            change="+5.7%"
                            changeType="positive"
                            icon={icons.borrowings}
                            className="card-responsive"
                        />

                        <StatisticCard
                            title="Chi nhánh"
                            value={dashboardStats?.totalLibraries || 0}
                            change="+2.1%"
                            changeType="positive"
                            icon={icons.libraries}
                            className="card-responsive"
                        />
                    </div>

                    {/* Real-time Search Section */}
                    <div className="mb-6 sm:mb-8">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <MagnifyingGlassIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-sage-900 dark:text-sage-100">Tìm kiếm nhanh</h2>
                                </div>
                                {showAllBooks && (
                                    <ActionButton
                                        variant="outline"
                                        size="sm"
                                        onClick={handleViewAllResults}
                                        className="flex items-center space-x-2"
                                    >
                                        <span>Xem tất cả</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </ActionButton>
                                )}
                            </div>

                            <RealTimeSearch
                                onSearch={handleRealTimeSearch}
                                searchResults={searchResults}
                                loading={searchLoading}
                                placeholder="Tìm kiếm sách theo tên, tác giả, ISBN, nhà xuất bản..."
                                className="w-full"
                                onResultClick={handleSearchResultClick}
                            />

                            {/* Search Results Preview */}
                            {searchResults.length > 0 && searchTerm && (
                                <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-sage-700 dark:text-sage-300">
                                            Kết quả tìm kiếm ({searchResults.length} sách)
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setSearchTerm("")
                                                setSearchResults([])
                                                setShowAllBooks(false)
                                            }}
                                            className="text-xs text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {searchResults.slice(0, 6).map((book) => (
                                            <div
                                                key={book.id}
                                                onClick={() => handleSearchResultClick(book)}
                                                className="p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-800/50 cursor-pointer transition-colors duration-200"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8 bg-sage-200 dark:bg-sage-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <BookOpenIcon className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sage-900 dark:text-sage-100 text-sm truncate">
                                                            {book.title}
                                                        </h4>
                                                        <p className="text-xs text-sage-600 dark:text-sage-400 truncate">
                                                            {book.author || "Không rõ tác giả"}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-sage-500 dark:text-sage-400">
                                {book.category?.name || "Chưa phân loại"}
                              </span>
                                                            <span
                                                                className={`text-xs px-2 py-0.5 rounded ${
                                                                    book.bookCopies?.some((copy) => copy.status === "AVAILABLE")
                                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                }`}
                                                            >
                                {book.bookCopies?.some((copy) => copy.status === "AVAILABLE") ? "Có sẵn" : "Hết sách"}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 sm:mb-8">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6">
                            <h2 className="text-xl font-semibold text-sage-900 dark:text-sage-100 mb-4">Thao tác nhanh</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link href="/librarian" className="group">
                                    <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-sage-600 dark:bg-sage-500 rounded-xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-400 transition-colors duration-200">
                                                <UserGroupIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                                                    Quản lý mượn sách
                                                </h3>
                                                <p className="text-sm text-sage-600 dark:text-sage-400">Xác nhận và quản lý mượn trả</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/books" className="group">
                                    <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-700 dark:group-hover:bg-blue-400 transition-colors duration-200">
                                                <BookOpenIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                                                    Khám phá sách
                                                </h3>
                                                <p className="text-sm text-sage-600 dark:text-sage-400">Tìm kiếm và mượn sách</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="group cursor-pointer" onClick={refreshData}>
                                    <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-xl border border-sage-200 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-700 transition-all duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-700 dark:group-hover:bg-emerald-400 transition-colors duration-200">
                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sage-900 dark:text-sage-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors duration-200">
                                                    Làm mới dữ liệu
                                                </h3>
                                                <p className="text-sm text-sage-600 dark:text-sage-400">Cập nhật thông tin mới nhất</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Books Table - Full Width */}
                    <div className="space-responsive">
                        <div className="card-responsive">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-responsive-h2 font-semibold text-sage-900 dark:text-sage-100">Sách mới nhất</h2>
                                <Link href="/books">
                                    <ActionButton variant="outline" size="sm">
                                        Xem tất cả
                                    </ActionButton>
                                </Link>
                            </div>

                            <div className="table-responsive">
                                <TableView data={recentBooks} columns={bookColumns} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <DetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Chi tiết sách">
                {selectedBook && (
                    <div className="space-responsive">
                        <div>
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <BookOpenIcon className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-responsive-h3 font-serif font-semibold text-sage-900 dark:text-sage-100 mb-2">
                                        {selectedBook.title}
                                    </h3>
                                    <p className="text-sage-600 dark:text-sage-400 text-responsive-body">
                                        Tác giả: {selectedBook.author || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Tác giả</label>
                                        <p className="text-sage-900 dark:text-sage-100 font-medium">{selectedBook.author || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                            Nhà xuất bản
                                        </label>
                                        <p className="text-sage-900 dark:text-sage-100">{selectedBook.publisher || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                            Năm xuất bản
                                        </label>
                                        <p className="text-sage-900 dark:text-sage-100">{selectedBook.year || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">ISBN</label>
                                        <p className="text-sage-900 dark:text-sage-100 font-mono">{selectedBook.isbn || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Danh mục</label>
                                        <p className="text-sage-900 dark:text-sage-100">
                                            {selectedBook.category?.name || "Chưa phân loại"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Ngày tạo</label>
                                        <p className="text-sage-900 dark:text-sage-100">
                                            {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                            Cập nhật lần cuối
                                        </label>
                                        <p className="text-sage-900 dark:text-sage-100">
                                            {selectedBook.updatedAt ? new Date(selectedBook.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">Mô tả</label>
                                        <p className="text-sage-900 dark:text-sage-100">{selectedBook.description || "Chưa có mô tả"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Book Copies */}
                        <div>
                            <h4 className="text-responsive-h3 font-medium text-sage-900 dark:text-sage-100 mb-3">
                                Các bản sách ({selectedBook.bookCopies?.length || 0})
                            </h4>
                            <div className="space-y-2">
                                {selectedBook.bookCopies?.map((copy, index) => (
                                    <div key={index} className="p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                                    QR Code
                                                </label>
                                                <p className="text-sage-900 dark:text-sage-100 font-mono text-xs sm:text-sm">
                                                    {copy.qrCode || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                                    Trạng thái
                                                </label>
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
                                                <label className="text-xs sm:text-sm font-medium text-sage-700 dark:text-sage-300">
                                                    Vị trí
                                                </label>
                                                <p className="text-sage-900 dark:text-sage-100">{copy.shelfLocation || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="actions-responsive pt-4">
                            <Link href={`/books/${selectedBook.id}`}>
                                <ActionButton variant="primary" className="action-button-responsive">
                                    Xem chi tiết
                                </ActionButton>
                            </Link>
                            <ActionButton
                                variant="outline"
                                className="action-button-responsive"
                                onClick={() => setIsDrawerOpen(false)}
                            >
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

const HomePage = () => {
    return (
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    )
}

export default HomePage
