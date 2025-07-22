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
  BarChart3,
  Zap,
  Globe,
  Shield,
  Database,
  Heart,
  Calendar,
  Bell,
  Play,
  Plus
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
      icon: Search,
      title: 'Tìm kiếm thông minh',
      description: 'Tìm sách theo tên, tác giả, ISBN với gợi ý tự động',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: QrCode,
      title: 'Quét QR nhanh chóng',
      description: 'Mượn/trả sách chỉ với một lần quét mã QR',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Quản lý độc giả',
      description: 'Hệ thống quản lý thông tin độc giả toàn diện',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Báo cáo chi tiết',
      description: 'Thống kê mượn/trả, phân tích xu hướng đọc sách',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MapPin,
      title: 'Đa phân hiệu',
      description: 'Quản lý thư viện tại nhiều cơ sở đào tạo',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Bell,
      title: 'Thông báo tự động',
      description: 'Nhắc nhở hạn trả, thông báo sách mới',
      color: 'from-pink-500 to-pink-600'
    },
  ]

  const quickActions = [
    {
      title: 'Quét QR nhanh',
      description: 'Mượn/trả sách',
      icon: QrCode,
      href: '/qr-scan',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Thêm sách mới',
      description: 'Quản lý kho sách',
      icon: BookMarked,
      href: '/admin/books/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Xem thống kê',
      description: 'Báo cáo chi tiết',
      icon: TrendingUp,
      href: '/admin/reports',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Quản lý mượn',
      description: 'Xử lý giao dịch',
      icon: Calendar,
      href: '/admin/borrowings',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient">
            Chào mừng trở lại
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hệ thống quản lý thư viện hiện đại với giao diện thân thiện và tính năng mạnh mẽ
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sách, tác giả, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl shadow-lg"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="card-modern">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalBooks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Tổng số sách</div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalReaders.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Độc giả</div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.activeBorrowings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Đang mượn</div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalLibraries.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Thư viện</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="spotify-card group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-300">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-modern hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
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

        {/* Popular Books */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sách phổ biến</h2>
            <Link href="/books">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Xem tất cả</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-modern animate-pulse">
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
                <Card key={book.id} className="spotify-card group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-1">
                          {book.author}
                        </p>
                        <p className="text-xs text-gray-400">
                          {book.publisher} • {book.publishYear}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {book.category?.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{book.availableCopies}/{book.totalCopies} có sẵn</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1">4.5</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-1" />
                        Mượn sách
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sẵn sàng trải nghiệm?
            </h2>
            <p className="text-lg text-gray-600">
              Đăng ký ngay để sử dụng hệ thống quản lý thư viện hiện đại
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="btn-primary">
                  <Plus className="mr-2 h-5 w-5" />
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="btn-secondary">
                  <Globe className="mr-2 h-5 w-5" />
                  Liên hệ tư vấn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
