'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Library,
  MapPin,
  BarChart3,
  Settings,
  FileText,
  QrCode,
  Home,
  Search,
  Heart,
  Clock,
  User,
  LogOut,
  Menu,
  X,
  BookMarked,
  Calendar,
  Bell,
  Star,
  TrendingUp,
  Database,
  Shield,
  Globe,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Trang chủ',
    href: '/',
    icon: Home,
    roles: ['ADMIN', 'LIBRARIAN', 'MANAGER', 'READER'],
  },
  {
    name: 'Khám phá',
    href: '/books',
    icon: Search,
    roles: ['ADMIN', 'LIBRARIAN', 'MANAGER', 'READER'],
  },
  {
    name: 'Sách yêu thích',
    href: '/favorites',
    icon: Heart,
    roles: ['READER'],
  },
  {
    name: 'Lịch sử mượn',
    href: '/borrowings',
    icon: Clock,
    roles: ['READER'],
  },
  {
    name: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'LIBRARIAN', 'MANAGER'],
  },
  {
    name: 'Quản lý sách',
    href: '/admin/books',
    icon: BookOpen,
    roles: ['ADMIN', 'LIBRARIAN', 'MANAGER'],
  },
  {
    name: 'Quản lý bản sao',
    href: '/admin/book-copies',
    icon: QrCode,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    name: 'Mượn/Trả sách',
    href: '/admin/borrowings',
    icon: FileText,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    name: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    name: 'Quản lý thư viện',
    href: '/admin/libraries',
    icon: Library,
    roles: ['ADMIN'],
  },
  {
    name: 'Quản lý phân hiệu',
    href: '/admin/campuses',
    icon: MapPin,
    roles: ['ADMIN'],
  },
  {
    name: 'Báo cáo & Thống kê',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Cài đặt hệ thống',
    href: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
]

const quickActions = [
  {
    name: 'Quét QR nhanh',
    href: '/qr-scan',
    icon: QrCode,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    name: 'Thêm sách mới',
    href: '/admin/books/new',
    icon: BookMarked,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    name: 'Xem thống kê',
    href: '/admin/reports',
    icon: TrendingUp,
    roles: ['ADMIN', 'MANAGER'],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || '')
  )

  const filteredQuickActions = quickActions.filter((item) =>
    item.roles.includes(user?.role || '')
  )

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <div className={cn(
      'sidebar h-full flex flex-col transition-all duration-300 ease-in-out',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Thư Viện</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          {collapsed ? <Menu className="h-5 w-5 text-gray-300" /> : <X className="h-5 w-5 text-gray-300" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 sidebar-scroll p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  'sidebar-item group',
                  isActive && 'active'
                )}>
                  <item.icon className={cn(
                    'h-5 w-5 transition-all duration-200',
                    collapsed ? 'mx-auto' : 'mr-3'
                  )} />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        {filteredQuickActions.length > 0 && (
          <div className="pt-6 border-t border-gray-700/50">
            <div className={cn(
              'text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3',
              collapsed ? 'text-center' : 'px-4'
            )}>
              {!collapsed && 'Thao tác nhanh'}
            </div>
            <div className="space-y-1">
              {filteredQuickActions.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div className="sidebar-item group">
                    <item.icon className={cn(
                      'h-4 w-4 transition-all duration-200',
                      collapsed ? 'mx-auto' : 'mr-3'
                    )} />
                    {!collapsed && (
                      <span className="text-sm">{item.name}</span>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700/50">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.role}
                  </p>
                </div>
              )}
            </button>

            {showUserMenu && !collapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700/50">
                <div className="p-2">
                  <Link href="/profile">
                    <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700/50 transition-colors">
                      <User className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-300">Hồ sơ</span>
                    </div>
                  </Link>
                  <Link href="/settings">
                    <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700/50 transition-colors">
                      <Settings className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-300">Cài đặt</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-2 rounded hover:bg-red-600/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-400">Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/login">
              <div className="sidebar-item">
                <User className="h-5 w-5" />
                {!collapsed && <span>Đăng nhập</span>}
              </div>
            </Link>
            <Link href="/register">
              <div className="sidebar-item">
                <User className="h-5 w-5" />
                {!collapsed && <span>Đăng ký</span>}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 