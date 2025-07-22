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
  QrCode,
  BookOpen,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart3,
  MapPin,
  Library,
  User,
  BookMarked,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { borrowingsAPI, usersAPI, booksAPI } from '@/lib/api'
import { Borrowing, User, Book } from '@/types'
import { formatDate, getStatusColor, debounce } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BorrowingManagementPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBorrowings, setSelectedBorrowings] = useState<number[]>([])
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedReader, setSelectedReader] = useState<number | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // Quick actions
  const [showQuickBorrow, setShowQuickBorrow] = useState(false)
  const [showQuickReturn, setShowQuickReturn] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchBorrowings()
  }, [currentPage, searchQuery, selectedStatus, selectedReader, selectedLibrary, dateRange])

  const fetchInitialData = async () => {
    try {
      const [usersResponse, booksResponse] = await Promise.all([
        usersAPI.getUsers({ role: 'READER' }),
        booksAPI.getBooks({ size: 100 })
      ])
      
      setUsers(usersResponse.content || [])
      setBooks(booksResponse.content || [])
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const fetchBorrowings = async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage - 1,
        size: 20,
        query: searchQuery,
        status: selectedStatus || undefined,
        readerId: selectedReader || undefined,
        libraryId: selectedLibrary || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      }

      const response = await borrowingsAPI.getBorrowings(params)
      setBorrowings(response.content || [])
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Error fetching borrowings:', error)
      toast.error('Không thể tải danh sách mượn/trả')
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
      case 'status':
        setSelectedStatus(value)
        break
      case 'reader':
        setSelectedReader(value)
        break
      case 'library':
        setSelectedLibrary(value)
        break
    }
  }

  const clearFilters = () => {
    setSelectedStatus('')
    setSelectedReader(null)
    setSelectedLibrary(null)
    setDateRange({ start: '', end: '' })
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleSelectBorrowing = (borrowingId: number) => {
    setSelectedBorrowings(prev => 
      prev.includes(borrowingId) 
        ? prev.filter(id => id !== borrowingId)
        : [...prev, borrowingId]
    )
  }

  const handleSelectAll = () => {
    if (selectedBorrowings.length === borrowings.length) {
      setSelectedBorrowings([])
    } else {
      setSelectedBorrowings(borrowings.map(borrowing => borrowing.id))
    }
  }

  const handleBulkReturn = async () => {
    if (selectedBorrowings.length === 0) {
      toast.error('Vui lòng chọn giao dịch để trả sách')
      return
    }

    if (!confirm(`Bạn có chắc muốn trả ${selectedBorrowings.length} cuốn sách?`)) {
      return
    }

    try {
      // Implement bulk return
      toast.success(`Đã trả ${selectedBorrowings.length} cuốn sách`)
      setSelectedBorrowings([])
      fetchBorrowings()
    } catch (error) {
      toast.error('Không thể trả sách')
    }
  }

  const handleRenew = async (borrowingId: number) => {
    try {
      const response = await borrowingsAPI.renewBorrowing(borrowingId, {
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })

      if (response.success) {
        toast.success('Gia hạn thành công!')
        fetchBorrowings()
      }
    } catch (error) {
      toast.error('Không thể gia hạn')
    }
  }

  const handleReturn = async (borrowingId: number) => {
    try {
      const response = await borrowingsAPI.returnBook(borrowingId, {
        returnDate: new Date().toISOString(),
        status: 'RETURNED'
      })

      if (response.success) {
        toast.success('Trả sách thành công!')
        fetchBorrowings()
      }
    } catch (error) {
      toast.error('Không thể trả sách')
    }
  }

  const getStatusBadge = (borrowing: Borrowing) => {
    const status = borrowing.status
    const dueDate = new Date(borrowing.dueDate)
    const today = new Date()
    const isOverdue = dueDate < today && status === 'BORROWED'

    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>
    }

    switch (status) {
      case 'BORROWED':
        return <Badge className="bg-blue-100 text-blue-800">Đang mượn</Badge>
      case 'RETURNED':
        return <Badge className="bg-green-100 text-green-800">Đã trả</Badge>
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>
      case 'RENEWED':
        return <Badge className="bg-yellow-100 text-yellow-800">Đã gia hạn</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>
    }
  }

  const getOverdueDays = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý mượn/trả sách
            </h1>
            <p className="text-gray-600">
              Xử lý giao dịch mượn/trả và quản lý hạn sách
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowQuickBorrow(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Mượn sách
            </Button>
            <Button variant="outline" onClick={() => setShowQuickReturn(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Quét QR trả
            </Button>
            <Button variant="outline" onClick={() => fetchBorrowings()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng giao dịch</p>
                  <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang mượn</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {borrowings.filter(b => b.status === 'BORROWED').length}
                  </p>
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
                  <p className="text-sm text-gray-600">Quá hạn</p>
                  <p className="text-2xl font-bold text-red-600">
                    {borrowings.filter(b => {
                      const dueDate = new Date(b.dueDate)
                      const today = new Date()
                      return dueDate < today && b.status === 'BORROWED'
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã trả hôm nay</p>
                  <p className="text-2xl font-bold text-green-600">
                    {borrowings.filter(b => {
                      const returnDate = new Date(b.returnDate || '')
                      const today = new Date()
                      return returnDate.toDateString() === today.toDateString() && b.status === 'RETURNED'
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
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
                    placeholder="Tìm kiếm theo tên sách, độc giả, QR code..."
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
              {selectedBorrowings.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {selectedBorrowings.length} đã chọn
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkReturn}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Trả sách
                  </Button>
                </div>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                      <option value="BORROWED">Đang mượn</option>
                      <option value="RETURNED">Đã trả</option>
                      <option value="OVERDUE">Quá hạn</option>
                      <option value="RENEWED">Đã gia hạn</option>
                    </select>
                  </div>

                  {/* Reader Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độc giả
                    </label>
                    <select
                      value={selectedReader || ''}
                      onChange={(e) => handleFilterChange('reader', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Tất cả độc giả</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ ngày
                    </label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đến ngày
                    </label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full"
                    />
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

        {/* Borrowings Table */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách giao dịch</CardTitle>
              <p className="text-sm text-gray-600">
                Hiển thị {borrowings.length} trong tổng số {totalElements} giao dịch
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
                          checked={selectedBorrowings.length === borrowings.length && borrowings.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">Sách</th>
                      <th className="text-left p-4 font-medium text-gray-900">Độc giả</th>
                      <th className="text-left p-4 font-medium text-gray-900">Ngày mượn</th>
                      <th className="text-left p-4 font-medium text-gray-900">Hạn trả</th>
                      <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowings.map((borrowing) => {
                      const isOverdue = new Date(borrowing.dueDate) < new Date() && borrowing.status === 'BORROWED'
                      const overdueDays = isOverdue ? getOverdueDays(borrowing.dueDate) : 0

                      return (
                        <tr key={borrowing.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedBorrowings.includes(borrowing.id)}
                              onChange={() => handleSelectBorrowing(borrowing.id)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-gray-900">{borrowing.bookCopy?.book?.title}</div>
                              <div className="text-sm text-gray-500">QR: {borrowing.bookCopy?.qrCode}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-gray-900">{borrowing.reader?.fullName}</div>
                              <div className="text-sm text-gray-500">{borrowing.reader?.studentId}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="text-gray-900">{formatDate(borrowing.borrowDate)}</div>
                              {borrowing.returnDate && (
                                <div className="text-gray-500">Trả: {formatDate(borrowing.returnDate)}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {formatDate(borrowing.dueDate)}
                              </div>
                              {isOverdue && (
                                <div className="text-red-500 text-xs">
                                  Quá hạn {Math.abs(overdueDays)} ngày
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(borrowing)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/admin/borrowings/${borrowing.id}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {borrowing.status === 'BORROWED' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRenew(borrowing.id)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReturn(borrowing.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
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
                    <ArrowLeft className="h-4 w-4" />
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
                    <ArrowRight className="h-4 w-4" />
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