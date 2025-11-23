import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import StatsList from "@/components/feature/admin/dashboard/StatsList";
import {
  BookOpen,
  Book as BookIcon,
  Star,
} from 'lucide-react'
import type { Book } from '@/types'

export default function HomePage(): React.ReactElement {
  const [featuredBooks] = useState<Book[]>([])
  const [loading] = useState(true)
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
                  onClick={() => navigate("/guest/borrow-books")}
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
        <div className="mt-8">
          <StatsList />
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
