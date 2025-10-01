import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Search,
  Book,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'
import { books } from '@/data/mockData'
import { useState } from 'react'
import type { Book as BookType } from '@/types'
import { toast } from 'sonner'

export default function ReturnBookManagement() {
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter books that are currently borrowed (subscribed)
  const borrowedBooks = books.filter((book) => book.status === 'Subscribed')

  const filteredBooks = borrowedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReturnBook = (book: BookType) => {
    toast.success(`Successfully returned "${book.title}"`)
    console.log('Returning book:', book)
  }

  const handleRenewBook = (book: BookType) => {
    toast.success(`Successfully renewed "${book.title}" for 14 more days`)
    console.log('Renewing book:', book)
  }

  const getDaysUntilDue = () => {
    // Mock data - in real app this would come from API
    return Math.floor(Math.random() * 15) - 2 // -2 to 13 days
  }

  const getDueBadgeVariant = (days: number) => {
    if (days < 0) return 'destructive'
    if (days <= 3) return 'destructive'
    if (days <= 7) return 'secondary'
    return 'default'
  }

  const getDueBadgeText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Return Books</h2>
          <p className="text-muted-foreground mt-1">
            Manage your borrowed books and returns
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Input
              type="search"
              placeholder={isMobile ? 'Search...' : 'Search your books...'}
              className="pl-10 pr-4 py-2 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={isMobile ? 'space-y-4' : 'grid gap-4 grid-cols-4'}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Currently Borrowed
                </p>
                <p className="text-2xl font-bold">{borrowedBooks.length}</p>
              </div>
              <Book className="w-8 h-8 text-blue-500" />
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
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Returned This Month
                </p>
                <p className="text-2xl font-bold text-green-500">8</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currently Borrowed Books */}
      <Card>
        <CardHeader>
          <CardTitle>
            Currently Borrowed Books ({filteredBooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No borrowed books found</h3>
              <p className="text-muted-foreground">
                You don't have any books to return at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map((book) => {
                const daysUntilDue = getDaysUntilDue()
                return (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Book className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {book.author}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Borrowed: Jan 15, 2025
                            </span>
                          </div>
                          <Badge variant={getDueBadgeVariant(daysUntilDue)}>
                            {getDueBadgeText(daysUntilDue)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRenewBook(book)}
                        disabled={daysUntilDue < 0}
                      >
                        Renew
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReturnBook(book)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Return
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Book Title {item}</p>
                    <p className="text-xs text-muted-foreground">Author Name</p>
                    <p className="text-xs text-green-600">
                      Returned on Jan {10 + item}, 2025
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 text-gray-300" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Returned on time
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={isMobile ? 'space-y-4' : 'grid gap-6 grid-cols-2'}>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Borrow More Books</h3>
                <p className="text-sm text-muted-foreground">
                  Discover new books to read
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Report Issue</h3>
                <p className="text-sm text-muted-foreground">
                  Report damaged or lost books
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
