'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Book, BookCopy } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/utils'
import { BookOpen, MapPin, Calendar, Eye, Heart, Share2 } from 'lucide-react'

interface BookCardProps {
  book: Book
  onBorrow?: (bookCopy: BookCopy) => void
  onFavorite?: (book: Book) => void
  showActions?: boolean
}

export default function BookCard({ 
  book, 
  onBorrow, 
  onFavorite, 
  showActions = true 
}: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const availableCopy = book.copies?.find(copy => copy.status === 'AVAILABLE')
  const isAvailable = availableCopy && book.availableCopies > 0

  const handleBorrow = async () => {
    if (!availableCopy || !onBorrow) return
    
    setIsLoading(true)
    try {
      await onBorrow(availableCopy)
    } catch (error) {
      console.error('Error borrowing book:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    onFavorite?.(book)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Xem sách "${book.title}" của ${book.author}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
              {book.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Tác giả:</span> {book.author}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">ISBN:</span> {book.isbn}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">NXB:</span> {book.publisher} ({book.publishYear})
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className="text-xs">
              {book.category?.name}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <BookOpen className="h-4 w-4" />
              <span>{book.availableCopies}/{book.totalCopies}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {book.copies?.length || 0} thư viện có sách này
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              className={isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {isAvailable ? 'Có sẵn' : 'Hết sách'}
            </Badge>
            
            {availableCopy && (
              <div className="text-xs text-gray-500">
                <MapPin className="h-3 w-3 inline mr-1" />
                {availableCopy.library?.name}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Link href={`/books/${book.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Chi tiết
              </Button>
            </Link>
            
            {showActions && isAvailable && (
              <Button 
                size="sm" 
                onClick={handleBorrow}
                disabled={isLoading}
              >
                Mượn sách
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={isFavorite ? 'text-red-500' : 'text-gray-400'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-400"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
} 