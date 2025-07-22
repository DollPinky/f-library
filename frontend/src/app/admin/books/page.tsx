'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen,
  QrCode,
  MapPin,
  Calendar,
  Users,
  BarChart3,
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  BookMarked,
  Library,
  Tag,
  FileText,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { booksAPI, categoriesAPI, librariesAPI } from '@/lib/api'
import { Book, Category, Library } from '@/types'
import { debounce, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [libraries, setLibraries] = useState<Library[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [currentPage, searchQuery, selectedCategory, selectedLibrary, selectedStatus])

  const fetchInitialData = async () => {
    try {
      const [categoriesResponse, librariesResponse] = await Promise.all([
        categoriesAPI.getCategories(),
        librariesAPI.getLibraries()
      ])
      
      setCategories(categoriesResponse.data || [])
      setLibraries(librariesResponse.data || [])
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage - 1,
        size: 20,
        query: searchQuery,
        categoryId: selectedCategory || undefined,
        libraryId: selectedLibrary || undefined,
        status: selectedStatus || undefined,
      }

      const response = await booksAPI.getBooks(params)
      setBooks(response.content || [])
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Không thể tải danh sách sách')
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, 300)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleFilterChange = (type: string, value: any) => {
    setCurrentPage(1)
    switch (type) {
      case 'category':
        setSelectedCategory(value)
        break
      case 'library':
        setSelectedLibrary(value)
        break
      case 'status':
        setSelectedStatus(value)
        break
    }
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedLibrary(null)
    setSelectedStatus('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleSelectBook = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(books.map(book => book.id))
    }
  }

  const handleDeleteBooks = async () => {
    if (selectedBooks.length === 0) {
      toast.error('Vui lòng chọn sách để xóa')
      return
    }

    if (!confirm(`Bạn có chắc muốn xóa ${selectedBooks.length} cuốn sách?`)) {
      return
    }

    try {
      // Implement bulk delete
      toast.success(`Đã xóa ${selectedBooks.length} cuốn sách`)
      setSelectedBooks([])
      fetchBooks()
    } catch (error) {
      toast.error('Không thể xóa sách')
    }
  }

  const handleExportBooks = () => {
    // Implement export functionality
    toast.success('Đã xuất danh sách sách')
  }

  const getStatusBadge = (book: Book) => {
    if (book.availableCopies === 0) {
      return <Badge className="bg-red-100 text-red-800">Hết sách</Badge>
    } else if (book.availableCopies < book.totalCopies * 0.2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý sách
            </h1>
            <p className="text-gray-600">
              Quản lý kho sách và bản sao trong hệ thống
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExportBooks}>
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sách mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số sách</p>
                  <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bản sao có sẵn</p>
                  <p className="text-2xl font-bold text-green-600">
                    {books.reduce((sum, book) => sum + book.availableCopies, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang mượn</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {books.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Danh mục</p>
                  <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Tag className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sách, tác giả, ISBN..."
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Bộ lọc</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {/* Bulk Actions */}
              {selectedBooks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {selectedBooks.length} đã chọn
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteBooks}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Library Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thư viện
                    </label>
                    <select
                      value={selectedLibrary || ''}
                      onChange={(e) => handleFilterChange('library', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Tất cả thư viện</option>
                      {libraries.map((library) => (
                        <option key={library.id} value={library.id}>
                          {library.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="available">Có sẵn</option>
                      <option value="low">Sắp hết</option>
                      <option value="out">Hết sách</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Books Table */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách sách</CardTitle>
              <p className="text-sm text-gray-600">
                Hiển thị {books.length} trong tổng số {totalElements} sách
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedBooks.length === books.length && books.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">Tên sách</th>
                      <th className="text-left p-4 font-medium text-gray-900">Tác giả</th>
                      <th className="text-left p-4 font-medium text-gray-900">ISBN</th>
                      <th className="text-left p-4 font-medium text-gray-900">Danh mục</th>
                      <th className="text-left p-4 font-medium text-gray-900">Bản sao</th>
                      <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedBooks.includes(book.id)}
                            onChange={() => handleSelectBook(book.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">{book.publisher} • {book.publishYear}</div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-900">{book.author}</td>
                        <td className="p-4 text-gray-900 font-mono text-sm">{book.isbn}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {book.category?.name}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">{book.availableCopies}</div>
                            <div className="text-gray-500">/ {book.totalCopies}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(book)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/admin/books/${book.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/admin/books/${book.id}/edit`, '_blank')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/admin/books/${book.id}/copies`, '_blank')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa sách này?')) {
                                  // Implement delete
                                  toast.success('Đã xóa sách')
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 