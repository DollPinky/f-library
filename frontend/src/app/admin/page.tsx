'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp,
  TrendingDown,
  BookOpen,
  Users,
  Library,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Eye,
  BookMarked,
  QrCode,
  FileText,
  Star,
  DollarSign,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import { DashboardStats, ChartData } from '@/types'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [statsResponse, chartResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData({ timeRange })
      ])

      setStats(statsResponse.data)
      setChartData(chartResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Không thể tải dữ liệu dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <ArrowUp className="h-4 w-4 text-green-600" />
    } else if (percentage < 0) {
      return <ArrowDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getTrendColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600'
    if (percentage < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Tổng quan hệ thống thư viện và thống kê hoạt động
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
            <Button variant="outline" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số sách</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(getPercentageChange(stats.totalBooks, stats.previousTotalBooks || 0))}
                      <span className={`text-sm ml-1 ${getTrendColor(getPercentageChange(stats.totalBooks, stats.previousTotalBooks || 0))}`}>
                        {Math.abs(getPercentageChange(stats.totalBooks, stats.previousTotalBooks || 0)).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                    </div>
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
                    <p className="text-sm text-gray-600">Độc giả</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReaders.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(getPercentageChange(stats.totalReaders, stats.previousTotalReaders || 0))}
                      <span className={`text-sm ml-1 ${getTrendColor(getPercentageChange(stats.totalReaders, stats.previousTotalReaders || 0))}`}>
                        {Math.abs(getPercentageChange(stats.totalReaders, stats.previousTotalReaders || 0)).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đang mượn</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeBorrowings.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(getPercentageChange(stats.activeBorrowings, stats.previousActiveBorrowings || 0))}
                      <span className={`text-sm ml-1 ${getTrendColor(getPercentageChange(stats.activeBorrowings, stats.previousActiveBorrowings || 0))}`}>
                        {Math.abs(getPercentageChange(stats.activeBorrowings, stats.previousActiveBorrowings || 0)).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                    </div>
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
                    <p className="text-sm text-gray-600">Thư viện</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLibraries.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">Hoạt động bình thường</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Library className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Borrowing Trends */}
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Xu hướng mượn sách
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ xu hướng mượn sách</p>
                  <p className="text-sm text-gray-400">Dữ liệu sẽ được hiển thị khi có thông tin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Phân bố danh mục
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ phân bố danh mục</p>
                  <p className="text-sm text-gray-400">Dữ liệu sẽ được hiển thị khi có thông tin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sách mới được thêm</p>
                    <p className="text-xs text-gray-500">2 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Độc giả đăng ký mới</p>
                    <p className="text-xs text-gray-500">15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sách được mượn</p>
                    <p className="text-xs text-gray-500">1 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sách quá hạn</p>
                    <p className="text-xs text-gray-500">2 giờ trước</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Books */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Sách phổ biến
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clean Code</p>
                      <p className="text-xs text-gray-500">Robert C. Martin</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">45 lượt</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Design Patterns</p>
                      <p className="text-xs text-gray-500">Gang of Four</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">38 lượt</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Refactoring</p>
                      <p className="text-xs text-gray-500">Martin Fowler</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">32 lượt</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Cảnh báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-900">5 sách quá hạn</p>
                    <p className="text-xs text-red-600">Cần xử lý ngay</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">12 sách sắp hết</p>
                    <p className="text-xs text-yellow-600">Cần bổ sung</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Hệ thống hoạt động tốt</p>
                    <p className="text-xs text-blue-600">Không có lỗi</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campus Overview */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              Tổng quan phân hiệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Hà Nội</h3>
                <p className="text-sm text-gray-600 mb-2">Thư viện chính</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sách:</span>
                    <span className="font-medium">1,250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Độc giả:</span>
                    <span className="font-medium">850</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đang mượn:</span>
                    <span className="font-medium">45</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">TP.HCM</h3>
                <p className="text-sm text-gray-600 mb-2">Thư viện chi nhánh</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sách:</span>
                    <span className="font-medium">980</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Độc giả:</span>
                    <span className="font-medium">620</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đang mượn:</span>
                    <span className="font-medium">32</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Đà Nẵng</h3>
                <p className="text-sm text-gray-600 mb-2">Thư viện chi nhánh</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sách:</span>
                    <span className="font-medium">750</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Độc giả:</span>
                    <span className="font-medium">480</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đang mượn:</span>
                    <span className="font-medium">28</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 