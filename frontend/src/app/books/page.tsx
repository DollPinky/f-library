'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen,
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { booksAPI, categoriesAPI, librariesAPI } from '@/lib/api'
import { Book, Category, Library } from '@/types'
import { debounce } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [libraries, setLibraries] = useState<Library[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
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
        size: 12,
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

  const handleBorrow = async (book: Book) => {
    try {
      // Implement borrow logic
      toast.success(`Đã mượn sách: ${book.title}`)
    } catch (error) {
      toast.error('Không thể mượn sách')
    }
  }

  const handleFavorite = (book: Book) => {
    toast.success(`Đã thêm "${book.title}" vào yêu thích`)
  }

  const handleShare = (book: Book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Xem sách "${book.title}" của ${book.author}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thư viện sách
          </h1>
          <p className="text-gray-600">
            Khám phá bộ sưu tập sách phong phú của chúng tôi
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
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

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="available">Có sẵn</option>
                    <option value="borrowed">Đang mượn</option>
                    <option value="reserved">Đã đặt trước</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Hiển thị {books.length} trong tổng số {totalElements} sách
          </p>
        </div>

        {/* Books Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sách
              </h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {books.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {book.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-1">
                          {book.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {book.publisher} • {book.publishYear}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {book.category?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{book.availableCopies}/{book.totalCopies} có sẵn</span>
                        </div>
                        <Badge 
                          className={book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {book.availableCopies > 0 ? 'Có sẵn' : 'Hết sách'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/books/${book.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>
                          
                          {book.availableCopies > 0 && (
                            <Button
                              size="sm"
                              onClick={() => handleBorrow(book)}
                            >
                              Mượn sách
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavorite(book)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(book)}
                            className="text-gray-400"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
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
          </>
        )}
      </div>
    </div>
  )
} 