# Library Management Frontend

## BookController API Integration

This frontend application is fully integrated with the BookController API from the Spring Boot backend. The integration provides a complete book management interface with real-time search, filtering, sorting, and cache management capabilities.

### API Endpoints Used

The frontend integrates with the following BookController endpoints:

#### Query Endpoints
- `GET /api/v1/books/{bookId}` - Get book by ID
- `GET /api/v1/books` - Search books with pagination and filters
- `GET /api/v1/books/health` - Health check

#### Cache Management Endpoints
- `DELETE /api/v1/books/{bookId}/cache` - Clear book cache
- `DELETE /api/v1/books/cache/search` - Clear search cache
- `DELETE /api/v1/books/cache` - Clear all cache
- `POST /api/v1/books/cache/bulk-clear` - Clear multiple books cache
- `GET /api/v1/books/{bookId}/cache/status` - Get book cache status
- `GET /api/v1/books/cache/statistics` - Get cache statistics

### Features Implemented

#### 1. Book Listing and Search
- Real-time search with dropdown suggestions
- Advanced filtering by status, category, and library
- Sorting by title, author, publisher, year, ISBN, and creation date
- Pagination support
- URL state management for filters and search

#### 2. Book Details
- Detailed book information display
- Book copy status tracking
- Available/borrowed copy counts
- Book metadata (ISBN, publisher, year, etc.)

#### 3. System Monitoring
- Service health status indicator
- Cache performance statistics
- Cache hit rate display
- Manual cache clearing functionality

#### 4. User Actions
- Book borrowing (placeholder for future implementation)
- Book detail viewing
- Admin book management links

### Data Structure

The frontend expects the following data structure from the BookController API:

```typescript
interface BookResponse {
  bookId: UUID;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: {
    categoryId: UUID;
    name: string;
    description: string;
  };
  bookCopies: Array<{
    bookCopyId: UUID;
    bookId: UUID;
    libraryId: UUID;
    qrCode: string;
    status: 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED';
    shelfLocation: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

### Search Parameters

The frontend supports all search parameters defined in `BookSearchParams`:

- `query` - Search term for title, author, ISBN, publisher
- `categoryId` - Filter by category
- `libraryId` - Filter by library
- `status` - Filter by book copy status
- `page` - Page number (0-based)
- `size` - Page size
- `sortBy` - Sort field
- `sortDirection` - Sort direction (ASC/DESC)

### Environment Configuration

Set the following environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Usage

1. Start the backend Spring Boot application
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000/books`

### Key Components

- `useBooksApi.js` - API integration hook
- `useBooks.js` - Books state management hook
- `BooksPage.jsx` - Main books listing page
- `RealTimeSearch.jsx` - Search component with suggestions
- `TableView.jsx` - Data table with sorting and pagination
- `DetailDrawer.jsx` - Book detail modal

### Error Handling

The application includes comprehensive error handling:
- API error responses
- Network connectivity issues
- Invalid data formats
- User-friendly error messages

### Performance Features

- Client-side caching through React hooks
- Server-side cache management
- Optimistic UI updates
- Lazy loading of book details
- Efficient pagination

### Future Enhancements

- Book borrowing functionality
- User authentication integration
- Advanced analytics dashboard
- Export functionality
- Bulk operations
- Real-time notifications 