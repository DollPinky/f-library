'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  Users, 
  Library, 
  MapPin, 
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  BookMarked,
  QrCode,
  BarChart3
} from 'lucide-react'
import { booksAPI, dashboardAPI } from '@/lib/api'
import { Book, DashboardStats } from '@/types'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, statsResponse] = await Promise.all([
          booksAPI.getBooks({ size: 6 }),
          dashboardAPI.getStats()
        ])
        
        setPopularBooks(booksResponse.content || [])
        setStats(statsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Tìm kiếm thông minh',
      description: 'Tìm sách theo tên, tác giả, ISBN với gợi ý tự động',
    },
    {
      icon: QrCode,
      title: 'Quét QR nhanh chóng',
      description: 'Mượn/trả sách chỉ với một lần quét mã QR',
    },
    {
      icon: Users,
      title: 'Quản lý độc giả',
      description: 'Hệ thống quản lý thông tin độc giả toàn diện',
    },
    {
      icon: BarChart3,
      title: 'Báo cáo chi tiết',
      description: 'Thống kê mượn/trả, phân tích xu hướng đọc sách',
    },
    {
      icon: MapPin,
      title: 'Đa phân hiệu',
      description: 'Quản lý thư viện tại nhiều cơ sở đào tạo',
    },
    {
      icon: Clock,
      title: 'Thông báo tự động',
      description: 'Nhắc nhở hạn trả, thông báo sách mới',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hệ Thống Quản Lý Thư Viện
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Giải pháp quản lý thư viện hiện đại cho trường đại học đa phân hiệu
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sách, tác giả, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 placeholder-gray-500"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  size="sm"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <Button size="lg" variant="secondary">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Khám phá sách
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalBooks.toLocaleString()}
                </div>
                <div className="text-gray-600">Tổng số sách</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalReaders.toLocaleString()}
                </div>
                <div className="text-gray-600">Độc giả</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.activeBorrowings.toLocaleString()}
                </div>
                <div className="text-gray-600">Đang mượn</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.totalLibraries.toLocaleString()}
                </div>
                <div className="text-gray-600">Thư viện</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Hệ thống được thiết kế để phục vụ tốt nhất cho mọi đối tượng người dùng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sách phổ biến
              </h2>
              <p className="text-gray-600">
                Những cuốn sách được mượn nhiều nhất
              </p>
            </div>
            <Link href="/books">
              <Button variant="outline">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBooks.map((book) => (
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
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{book.availableCopies}/{book.totalCopies} có sẵn</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1">4.5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay để sử dụng hệ thống quản lý thư viện hiện đại
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
