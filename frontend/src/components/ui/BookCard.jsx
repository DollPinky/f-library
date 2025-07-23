import React from 'react';
import { BookOpenIcon, EyeIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import ActionButton from './ActionButton';

const BookCard = ({ 
  book, 
  onViewDetails, 
  onBorrow, 
  className = '' 
}) => {
  const availableCopies = book.bookCopies?.filter(copy => copy.status === 'AVAILABLE').length || 0;
  const totalCopies = book.bookCopies?.length || 0;

  const getStatusColor = () => {
    if (availableCopies > 0) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    } else if (totalCopies > 0) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusText = () => {
    if (availableCopies > 0) {
      return `${availableCopies}/${totalCopies} bản có sẵn`;
    } else if (totalCopies > 0) {
      return `${totalCopies} bản đã mượn`;
    } else {
      return 'Không có bản sách';
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer ${className}`} 
      onClick={onViewDetails}
    >
      {/* Card Layout using CSS Grid for perfect responsive behavior */}
      <div className="grid grid-rows-[auto_1fr_auto] h-full p-4 sm:p-6">
        
        {/* Header: Cover + Badges */}
        <div className="relative mb-4">
          <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-800 dark:to-sage-900 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
            <BookOpenIcon className="w-12 h-12 sm:w-16 sm:h-16 text-sage-600 dark:text-sage-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Status Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          
          {/* Category Badge */}
          {book.category && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-800 dark:bg-sage-800 dark:text-sage-200">
              {book.category.name}
            </div>
          )}
        </div>

        {/* Content: Book Info - Flexible height with proper spacing */}
        <div className="flex flex-col space-y-3 min-h-0">
          {/* Title - Flexible height with proper line spacing */}
          <h3 className="text-base sm:text-lg font-semibold text-sage-900 dark:text-sage-100 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors duration-200 leading-relaxed">
            <span className="line-clamp-2 block">
              {book.title}
            </span>
          </h3>
          
          {/* Author */}
          <p className="text-sm text-sage-600 dark:text-sage-400 leading-relaxed">
            <span className="line-clamp-1 block">
              {book.author || 'Tác giả chưa xác định'}
            </span>
          </p>
          
          {/* Publisher & Year - Flex layout to prevent overflow */}
          <div className="flex items-center justify-between text-xs text-sage-500 dark:text-sage-500 leading-relaxed">
            <span className="line-clamp-1 flex-1 mr-2 min-w-0">
              {book.publisher || 'N/A'}
            </span>
            <span className="flex-shrink-0 text-right">
              {book.year || 'N/A'}
            </span>
          </div>
          
          {/* ISBN */}
          {book.isbn && (
            <p className="text-xs text-sage-500 dark:text-sage-500 font-mono leading-relaxed">
              <span className="line-clamp-1 block">
                ISBN: {book.isbn}
              </span>
            </p>
          )}
        </div>

        {/* Footer: Actions - Fixed height */}
        <div className="pt-4 mt-auto border-t border-sage-200 dark:border-sage-700">
          <div className="flex items-center space-x-2">
            <ActionButton
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 min-h-[40px] text-xs sm:text-sm"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Chi tiết
            </ActionButton>
            
            <ActionButton
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBorrow();
              }}
              disabled={availableCopies === 0}
              className="flex-1 min-h-[40px] text-xs sm:text-sm"
            >
              <BookmarkIcon className="w-4 h-4 mr-1" />
              Mượn
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 