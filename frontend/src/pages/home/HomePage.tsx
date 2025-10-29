import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  BookOpen,
  Book as BookIcon,
  Users,
  TrendingUp,
  Search,
  Calendar,
  RotateCcw,
  Star,
  Menu,
  X,
  LogIn,
  Bell
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import logoImage from '@/assets/logo.png'
import { useAuth } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getHomePageStats } from '@/services/dashboardService'
import { getAllBooks } from '@/services/bookManagementService'
import type { Book } from '@/types'
import { toast } from 'react-hot-toast'

export default function HomePage(): React.ReactElement {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [stats, setStats] = useState({ totalBook: 0, totalUsers: 0, totalBorrow: 0 })
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await getDashboardStats()
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data)
        }

        // Fetch featured books
        const booksRes = await getAllBooks()
        if (booksRes.success && booksRes.data) {
          // Take first 4 books as featured
          setFeaturedBooks(booksRes.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
        toast.error('Failed to load homepage data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('❌ Logout failed:', error)
      navigate('/', { replace: true })
    }
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header - Using same style as Header.tsx */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 container mx-auto">
          {/* Mobile menu */}
          {isMobile && (
            <Button
              variant={'ghost'}
              size={'icon'}
              className="mr-2"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center space-x-4">
            <img
              src={logoImage}
              alt="Book Library Logo"
              className="w-14 h-14"
            />
            <h2 className="lg:text-2xl font-bold tracking-tight sm:text-lg">
              Book Library
            </h2>
          </div>

          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            {!isMobile && (
              <Input
                type="search"
                placeholder="Search your book..."
                className="md:w-[200px] lg:w-[300px]"
              />
            )}

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
              >
                {isSearchVisible ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>

            {/* Hiển thị nút đăng nhập hoặc avatar tùy theo trạng thái */}
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@user"
                      />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role || 'User'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size={isMobile ? 'sm' : 'default'}
                onClick={handleLoginClick}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {!isMobile && 'Đăng nhập'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {isMobile && isSearchVisible && (
          <div className="px-4 pb-3">
            <Input
              type="search"
              placeholder="Search book..."
              className="w-full"
              autoFocus
            />
          </div>
        )}
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Menu</h2>
                <Button
                  variant="ghost"
                  size={'icon'}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="space-y-2">
                  <Button
                    variant={'ghost'}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal bg-primary/10 text-primary"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Home
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    About
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Books
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Welcome Hero Card */}
        <Card className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg border-none">
          <CardContent className="flex h-full items-center justify-between p-6 md:p-8">
            <div className="z-10 flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                <p className="text-sm font-medium uppercase tracking-wider opacity-90">
                  Library Management System
                </p>
              </div>
              <h1
                className={
                  isMobile
                    ? 'text-2xl font-bold'
                    : 'text-4xl md:text-5xl font-bold'
                }
              >
                Welcome to{' '}
                <span className="text-amber-200">Library Borrow</span>
              </h1>
              <p
                className={
                  isMobile
                    ? 'text-sm opacity-90 leading-relaxed'
                    : 'text-base opacity-90 leading-relaxed'
                }
              >
                Discover thousands of books, borrow instantly and manage returns
                easily. Explore curated collections and enjoy reading anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className={
                    isMobile
                      ? 'text-sm w-full sm:w-fit bg-white text-primary hover:bg-gray-100 shadow-md'
                      : 'w-fit bg-white text-primary hover:bg-gray-100 shadow-md'
                  }
                >
                  Browse Books
                </Button>
                {!token && (
                  <Button
                    variant="outline"
                    onClick={handleLoginClick}
                    className={
                      isMobile
                        ? 'text-sm w-full bg-transparent border-white text-white hover:bg-white/20'
                        : 'w-fit bg-transparent border-white text-white hover:bg-white/20'
                    }
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            <div className="absolute right-0 bottom-0 opacity-20 md:opacity-50 pointer-events-none">
              <BookOpen size={isMobile ? 140 : 200} />
            </div>

            <div className="absolute top-0 right-0 -mt-4 -mr-8 h-24 w-24 rotate-12 rounded-full bg-white/20 blur-2xl filter"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-4 h-20 w-20 rounded-full bg-white/20 blur-xl filter"></div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div
          className={
            isMobile ? 'mt-6 space-y-4' : 'mt-8 grid gap-6 grid-cols-3'
          }
        >
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>
                Total Books
              </CardTitle>
              <BookIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={
                  isMobile ? 'text-2xl font-bold' : 'text-3xl font-bold'
                }
              >
                {loading ? '...' : stats.totalBook.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available in library
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>
                Active Readers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={
                  isMobile ? 'text-2xl font-bold' : 'text-3xl font-bold'
                }
              >
                {loading ? '...' : stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={isMobile ? 'text-sm' : 'text-base'}>
                Books Borrowed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={
                  isMobile ? 'text-2xl font-bold' : 'text-3xl font-bold'
                }
              >
                {loading ? '...' : stats.totalBorrow.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Books */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Featured Books</CardTitle>
            <Button variant="link" className={isMobile ? 'text-xs' : 'text-sm'}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Hand-picked titles recommended for you
            </p>
            <div
              className={
                isMobile
                  ? 'grid grid-cols-2 gap-4'
                  : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'
              }
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 md:h-40 bg-gradient-to-b from-gray-200 to-gray-300 rounded flex items-center justify-center animate-pulse">
                      <BookIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                    </div>
                    <div className="mt-3 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="mt-1 h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                ))
              ) : featuredBooks.length > 0 ? (
                featuredBooks.map((book) => (
                  <div
                    key={book.bookId}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 md:h-40 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                      <BookIcon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                    <h3 className="mt-3 font-semibold text-sm line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {book.author}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-green-600">
                        Available
                      </span>
                      <Button
                        size="sm"
                        variant="link"
                        className="text-xs p-0 h-auto"
                        onClick={() => navigate(`/books/${book.bookId}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No featured books available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={isMobile ? 'space-y-6' : 'grid sm:grid-cols-3 gap-6'}
            >
              <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="mt-4 font-semibold">Search</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Find books by title, author or category.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="mt-4 font-semibold">Borrow</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Reserve a copy and pick it up from the library.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="mt-4 font-semibold">Return</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Return on time or renew online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What Our Readers Say</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={isMobile ? 'space-y-4' : 'grid md:grid-cols-3 gap-6'}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    "This library made borrowing books so easy. Highly
                    recommended!"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                      R{i}
                    </div>
                    <div>
                      <div className="font-medium text-sm">Reader {i}</div>
                      <div className="text-xs text-muted-foreground">
                        Member since 2023
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Library Borrow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
