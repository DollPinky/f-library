import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Book } from "@/types";
import { ImageIcon } from "lucide-react";
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy sách phù hợp</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
      {books.map((book) => {
        const availableCopies = book.bookCopies?.filter(
          (copy) => copy.status === "AVAILABLE"
        ).length;
        const totalCopies = book.bookCopies?.length;
        const isAvailable = availableCopies > 0;
        const isLoading = loadingBooks[book.bookId] || false;

        return (
          <Card
            key={book.bookId}
            className="h-full flex flex-col overflow-hidden max-w-full sm:max-w-xs relative"
          >
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className={
                "absolute top-2 right-2 z-10 px-2 py-0.5 text-xs " +
                (isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800")
              }
            >
              {isAvailable
                ? `Còn ${availableCopies}/${totalCopies}`
                : `Đang mượn ${totalCopies}/${totalCopies}`}
            </Badge>
            <CardContent className="py-3 flex-grow flex flex-row gap-2">
              <div className="flex-shrink-0 w-14 h-20 rounded bg-muted flex items-center justify-center overflow-hidden">
                {book.bookCoverUrl ? (
                  <img
                    src={book.bookCoverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col h-full flex-1">
                <h3 className="font-bold text-sm line-clamp-2 flex-1">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {book.author}
                </p>
                <div className="flex flex-wrap gap-1 mb-1 mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {book.category?.name}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {book.year}
                  </Badge>
                </div>
                <p className="text-xs line-clamp-2 text-muted-foreground mt-auto">
                  {book.description || "Không có mô tả"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-3 flex gap-2 justify-between">
              <Button
                variant="default"
                onClick={() => handleBorrow(book)}
                disabled={!isAvailable || isLoading}
                className="w-1/2 text-xs py-2"
              >
                {isLoading ? "Đang xử lý..." : "Mượn"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReturn && handleReturn(book)}
                disabled={isLoading}
                className="w-1/2 text-xs py-2"
              >
                {isLoading ? "Đang xử lý..." : "Trả"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
