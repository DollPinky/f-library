'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  BookOpen,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Share2,
  QrCode,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Download,
  Eye,
  BookMarked,
  Library,
  Tag,
  FileText,
  BarChart3,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { booksAPI, bookCopiesAPI, borrowingsAPI } from '@/lib/api'
import { Book, BookCopy, Borrowing } from '@/types'
import { formatDate, getStatusColor } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const bookId = Number(params.id)

  const [book, setBook] = useState<Book | null>(null)
  const [copies, setCopies] = useState<BookCopy[]>([])
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCopies, setShowCopies] = useState(false)
  const [showBorrowings, setShowBorrowings] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (bookId) {
      fetchBookData()
    }
  }, [bookId])

  const fetchBookData = async () => {
    setIsLoading(true)
    try {
      const [bookResponse, copiesResponse, borrowingsResponse] = await Promise.all([
        booksAPI.getBook(bookId),
        bookCopiesAPI.getBookCopies({ bookId }),
        borrowingsAPI.getBorrowings({ bookId })
      ])

      setBook(bookResponse.data)
      setCopies(copiesResponse.content || [])
      setBorrowings(borrowingsResponse.content || [])
    } catch (error) {
      console.error('Error fetching book data:', error)
      toast.error('Không thể tải thông tin sách')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorrow = async (copyId: number) => {
    try {
      const response = await borrowingsAPI.createBorrowing({
        bookCopyId: copyId,
        readerId: user?.id || 0,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        status: 'BORROWED'
      })

      if (response.success) {
        toast.success('Mượn sách thành công!')
        fetchBookData() // Refresh data
      }
    } catch (error) {
      toast.error('Không thể mượn sách')
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
        fetchBookData() // Refresh data
      }
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
        fetchBookData() // Refresh data
      }
    } catch (error) {
      toast.error('Không thể gia hạn')
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích')
  }

  const shareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: `Xem sách: ${book?.title} - ${book?.author}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link')
    }
  }

  const getCopyStatusBadge = (copy: BookCopy) => {
    switch (copy.status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>
      case 'BORROWED':
        return <Badge className="bg-blue-100 text-blue-800">Đang mượn</Badge>
      case 'RESERVED':
        return <Badge className="bg-yellow-100 text-yellow-800">Đã đặt</Badge>
      case 'MAINTENANCE':
        return <Badge className="bg-red-100 text-red-800">Bảo trì</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sách</h2>
          <p className="text-gray-600 mb-4">Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-600">Chi tiết sách và quản lý bản sao</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={toggleFavorite}>
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
            </Button>
            <Button variant="outline" onClick={shareBook}>
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
            {user?.role === 'ADMIN' || user?.role === 'LIBRARIAN' ? (
              <Button onClick={() => router.push(`/admin/books/${book.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            ) : null}
          </div>
        </div>

        {/* Book Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tác giả</label>
                    <p className="text-lg font-semibold text-gray-900">{book.author}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ISBN</label>
                    <p className="text-lg font-mono text-gray-900">{book.isbn}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nhà xuất bản</label>
                    <p className="text-lg text-gray-900">{book.publisher}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Năm xuất bản</label>
                    <p className="text-lg text-gray-900">{book.publishYear}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Danh mục</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {book.category?.name}
                    </Badge>
                  </div>
                </div>

                {book.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mô tả</label>
                    <p className="text-gray-900 mt-1 leading-relaxed">{book.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability & Statistics */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Tình trạng & Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{book.availableCopies}</div>
                    <div className="text-sm text-gray-600">Có sẵn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{book.totalCopies - book.availableCopies}</div>
                    <div className="text-sm text-gray-600">Đang mượn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{book.totalCopies}</div>
                    <div className="text-sm text-gray-600">Tổng số</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">4.5</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Copies */}
            <Card className="card-modern">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Copy className="h-5 w-5 mr-2 text-purple-600" />
                    Bản sao sách
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCopies(!showCopies)}
                  >
                    {showCopies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showCopies && (
                <CardContent>
                  <div className="space-y-3">
                    {copies.map((copy) => (
                      <div key={copy.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <QrCode className="h-6 w-6 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">QR: {copy.qrCode}</div>
                            <div className="text-sm text-gray-600">
                              {copy.library?.name} • {copy.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getCopyStatusBadge(copy)}
                          {copy.status === 'AVAILABLE' && user?.role === 'READER' && (
                            <Button
                              size="sm"
                              onClick={() => handleBorrow(copy.id)}
                            >
                              Mượn
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Borrowing History */}
            {user?.role !== 'READER' && (
              <Card className="card-modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      Lịch sử mượn
                    </CardTitle>
                    <Button
                      variant="ghost"
                      onClick={() => setShowBorrowings(!showBorrowings)}
                    >
                      {showBorrowings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {showBorrowings && (
                  <CardContent>
                    <div className="space-y-3">
                      {borrowings.map((borrowing) => (
                        <div key={borrowing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {borrowing.reader?.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(borrowing.borrowDate)} - {formatDate(borrowing.dueDate)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(borrowing.status)}>
                              {borrowing.status}
                            </Badge>
                            {borrowing.status === 'BORROWED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReturn(borrowing.id)}
                              >
                                Trả sách
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookMarked className="h-5 w-5 mr-2 text-green-600" />
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {book.availableCopies > 0 && user?.role === 'READER' ? (
                  <Button className="w-full btn-primary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Mượn sách ngay
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Hết sách
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem bản sao
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Tải thông tin
                </Button>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-600" />
                  Vị trí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {copies.slice(0, 3).map((copy) => (
                    <div key={copy.id} className="flex items-center space-x-3">
                      <Library className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {copy.library?.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          Kệ: {copy.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Books */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-purple-600" />
                  Sách tương tự
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm">Clean Architecture</div>
                    <div className="text-xs text-gray-600">Robert C. Martin</div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm">Design Patterns</div>
                    <div className="text-xs text-gray-600">Gang of Four</div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm">Refactoring</div>
                    <div className="text-xs text-gray-600">Martin Fowler</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 