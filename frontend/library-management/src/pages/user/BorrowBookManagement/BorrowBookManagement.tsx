import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { Search, Filter, Book, Calendar, User } from 'lucide-react'
import { books } from '@/data/mockData'
import { useState } from 'react'
import type { Book as BookType } from '@/types'
import { toast } from 'sonner'

export default function BorrowBookManagement() {
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter books that are available (not subscribed)
  const availableBooks = books.filter((book) => book.status === 'Unsubscribed')

  const filteredBooks = availableBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [
    'All',
    'Fiction',
    'Science',
    'History',
    'Technology',
    'Literature'
  ]

  const handleBorrowBook = (book: BookType) => {
    toast.success(`Successfully borrowed "${book.title}"`)
    console.log('Borrowing book:', book)
  }

  const handleViewDetails = (book: BookType) => {
    console.log('Viewing book details:', book)
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Borrow Books</h2>
          <p className="text-muted-foreground mt-1">
            Discover and borrow books from our library
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Input
              type="search"
              placeholder={
                isMobile ? 'Search...' : 'Search books or authors...'
              }
              className="pl-10 pr-4 py-2 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className={isMobile ? 'space-y-4' : 'grid gap-4 grid-cols-3'}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Books</p>
                <p className="text-2xl font-bold">{availableBooks.length}</p>
              </div>
              <Book className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Borrowed</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold text-orange-500">2</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Available Books ({filteredBooks.length})
          </h3>
        </div>

        {filteredBooks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              isMobile
                ? 'space-y-4'
                : 'grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }
          >
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="w-48 flex flex-col rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                {/* Cover */}
                <div className="relative h-72 bg-gradient-to-b from-blue-400 to-blue-600">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Book className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${
                      book.status === 'Unsubscribed'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {book.status === 'Unsubscribed' ? 'Available' : 'Borrowed'}
                  </Badge>
                </div>

                {/* Nội dung */}
                <CardContent className="flex flex-col flex-1 p-3">
                  {/* Thông tin sách */}
                  <div className="flex-1 text-center space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {book.author}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={book.status === 'Subscribed'}
                      onClick={() => handleBorrowBook(book)}
                    >
                      {book.status === 'Subscribed' ? 'Borrowed' : 'Borrow'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleViewDetails(book)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recently Borrowed */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Borrowed Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {books
              .filter((book) => book.status === 'Subscribed')
              .slice(0, 3)
              .map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {book.author}
                      </p>
                      <p className="text-xs text-blue-600">
                        Borrowed 2 days ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Reading</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due in 12 days
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
