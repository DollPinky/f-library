import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Book } from "@/types";
import { BookOpen, ImageIcon } from "lucide-react";
import { useState } from "react";

interface BookGridProps {
  books: Book[];
  onBorrow: (book: Book) => Promise<void>;
  onReturn?: (book: Book) => Promise<void>;
  refreshBooks?: () => Promise<void>;
}

export default function BookGrid({
  books,
  onBorrow,
  onReturn,
  refreshBooks,
}: BookGridProps) {
  const [loadingBooks, setLoadingBooks] = useState<Record<string, boolean>>({});

  const handleBorrow = async (book: Book) => {
    try {
      setLoadingBooks((prev) => ({ ...prev, [book.bookId]: true }));
      await onBorrow(book);

      if (refreshBooks) await refreshBooks();
    } finally {
      setLoadingBooks((prev) => ({ ...prev, [book.bookId]: false }));
    }
  };

  const handleReturn = async (book: Book) => {
    if (!onReturn) return;
    try {
      setLoadingBooks((prev) => ({ ...prev, [book.bookId]: true }));
      await onReturn(book);

      if (refreshBooks) await refreshBooks();
    } finally {
      setLoadingBooks((prev) => ({ ...prev, [book.bookId]: false }));
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">No matching books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {books.map((book) => {
        const availableCopies = book.bookCopies?.filter(
          (copy) => copy.status === "AVAILABLE"
        ).length;
        const totalCopies = book.bookCopies?.length;
        const isAvailable = (availableCopies as any) > 0;
        const isLoading = loadingBooks[book.bookId] || false;
        const hasBorrowed =
          book.bookCopies?.some((copy) => copy.status === "BORROWED") ?? false;
        return (
          <Card
            key={book.bookId}
            className="h-full flex flex-col overflow-hidden max-w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-opacity-60"
          >
            <div className="relative">
              <Badge
                variant={isAvailable ? "default" : "secondary"}
                className={
                  "absolute top-2 right-2 z-10 px-2 py-0.5 text-xs font-medium " +
                  (isAvailable
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200")
                }
              >
                {isAvailable
                  ? `Available ${availableCopies}/${totalCopies}`
                  : `All borrowed ${totalCopies}/${totalCopies}`}
              </Badge>
            </div>
            <CardContent className="py-4 flex-grow flex flex-row gap-3">
              <div className="flex-shrink-0 w-16 h-24 rounded-sm bg-muted flex items-center justify-center overflow-hidden shadow-sm border border-muted">
                {book.bookCoverUrl ? (
                  <img
                    src={book.bookCoverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col h-full flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 flex-1 text-primary">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-1.5 mt-0.5 italic">
                  by {book.author || "Unknown"}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {book.category?.name && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      {book.category?.name}
                    </Badge>
                  )}
                  {book.year && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-slate-50 px-2 py-0"
                    >
                      {book.year}
                    </Badge>
                  )}
                </div>
                <p className="text-xs line-clamp-2 text-muted-foreground mt-auto">
                  {book.description || "No description available"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-1 pb-4 flex gap-3 justify-between">
              <Button
                variant={isAvailable ? "default" : "outline"}
                onClick={() => handleBorrow(book)}
                disabled={!isAvailable || isLoading}
                className="w-1/2 text-xs py-2 h-8 font-medium"
                size="sm"
              >
                {isLoading ? "Processing..." : "Borrow"}
              </Button>
              <Button
                variant={hasBorrowed ? "secondary" : "outline"}
                onClick={() => handleReturn && handleReturn(book)}
                disabled={isLoading || !hasBorrowed}
                className="w-1/2 text-xs py-2 h-8 font-medium"
                size="sm"
              >
                {isLoading ? "Processing..." : "Return"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
