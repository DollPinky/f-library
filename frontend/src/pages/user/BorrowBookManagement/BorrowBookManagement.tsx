import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import BookGrid from "@/components/feature/user/borrowBooks/BookGrid";
import BookReturnModal from "@/components/feature/user/borrowBooks/BookReturnModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBooks } from "@/services/bookManagementService";
import {
  borrowBookByBookCopyId,
  returnedBookByBookCopyId,
} from "@/services/borrowBookService";
import type { Book } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function BorrowBookManagement() {
  console.log('BorrowBookManagement rendered');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [error, setError] = useState<string | null>(null);
  console.log(error);

  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [bookToBorrow, setBookToBorrow] = useState<Book | null>(null);
  const [borrowBookCopyId, setBorrowBookCopyId] = useState<string | null>(null);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [bookToReturn, setBookToReturn] = useState<Book | null>(null);
  const [returnBookCopyId, setReturnBookCopyId] = useState<string | null>(null);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllBooks();
        console.log("API Response:", res);

        const booksArray = Array.isArray(res)
          ? res
          : res?.data && Array.isArray(res.data)
            ? res.data
            : [];

        setBooks(booksArray);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast.error("Failed to load books");
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) {
      console.warn("Books is not an array:", books);
      return [];
    }

    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book?.publisher?.toLowerCase().includes(searchTerm.toLowerCase());

      // Handle category being either a string or Category object
      const categoryName =
        typeof book?.category === "string"
          ? book.category
          : book?.category?.name || "";

      const matchesCategory =
        categoryFilter === "All Categories" || categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, categoryFilter]);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(books.map((book) => book.category?.name))
    );
    return [
      { value: "All Categories", label: "All Categories" },
      ...uniqueCategories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [books]);

  const handleBorrowBook = async (book: Book): Promise<void> => {
    const availableCopy = book.bookCopies?.find(
      (copy) => copy.status === "AVAILABLE"
    );

    if (availableCopy) {
      setBookToBorrow(book);
      setBorrowBookCopyId(availableCopy.bookCopyId);
      setBorrowModalOpen(true);
    } else {
      toast.error("No copies of this book are currently available to borrow.");
    }
    return Promise.resolve();
  };

  const handleReturnBook = async (book: Book): Promise<void> => {
    const borrowedCopy = book.bookCopies?.find(
      (copy) => copy.status === "BORROWED"
    );

    if (borrowedCopy) {
      setBookToReturn(book);
      console.log({ book })
      setReturnBookCopyId(borrowedCopy.bookCopyId);
      setReturnModalOpen(true);
    } else {
      toast.error("You have no borrowed copies of this book to return.");
    }
    return Promise.resolve();
  };

  const handleConfirmBorrow = async ({
    companyAccount,
    bookCopyId,
  }: {
    companyAccount: string;
    bookCopyId: string;
  }) => {
    try {
      await borrowBookByBookCopyId(bookCopyId, companyAccount);

      toast.success("Book borrowed successfully!");
      setBooks((prevBooks) => {
        if (!bookToBorrow || !bookCopyId) {
          return prevBooks;
        }

        return prevBooks.map((book) => {
          if (book.bookId === bookToBorrow.bookId) {
            if (!book.bookCopies || !Array.isArray(book.bookCopies)) {
              return book;
            }

            const foundCopy = book.bookCopies.find(
              (copy) => copy.bookCopyId === bookCopyId
            );

            if (!foundCopy) {
              return book;
            }

            return {
              ...book,
              bookCopies: book.bookCopies.map((copy) =>
                copy.bookCopyId === bookCopyId
                  ? { ...copy, status: "BORROWED" }
                  : copy
              ),
            };
          }
          return book;
        });
      });

      setBorrowModalOpen(false);
      setBookToBorrow(null);
      setBorrowBookCopyId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to borrow book");
      console.error("Error:", error);
    }
  };

  const handleConfirmReturn = async ({
    companyAccount,
    bookCopyId,
  }: {
    companyAccount: string;
    bookCopyId: string;
  }) => {
    try {
      debugger
      await returnedBookByBookCopyId(bookCopyId, companyAccount);
      console.log(companyAccount);

      setBooks((prevBooks) => {
        if (!bookToReturn || !bookCopyId) {
          return prevBooks;
        }

        return prevBooks.map((book) => {
          if (book.bookId === bookToReturn.bookId) {
            if (!book.bookCopies || !Array.isArray(book.bookCopies)) {
              return book;
            }

            const foundCopy = book.bookCopies.find(
              (copy) => copy.bookCopyId === bookCopyId
            );

            if (!foundCopy) {
              return book;
            }

            return {
              ...book,
              bookCopies: book.bookCopies.map((copy) =>
                copy.bookCopyId === bookCopyId
                  ? { ...copy, status: "AVAILABLE" }
                  : copy
              ),
            };
          }
          return book;
        });
      });

      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to return book");
      console.error("Error:", error);
      return false;
    }
  };

  const handleCloseReturnProcess = () => {
    console.log("Closing return modal");
    setReturnModalOpen(false);
    setBookToReturn(null);
    setReturnBookCopyId(null);
  };

  return (
    <div className="space-y-6">
      <Card className="m-3 md:m-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Borrow Books</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue={categoryFilter}
            onFilterChange={setCategoryFilter}
            filterOptions={categoryOptions as any}
            filterPlaceholder="Filter by category"
            searchPlaceholder="Search books by title, author, or publisher..."
            onClearFilters={handleClearFilters}
            showClearFilters={
              searchTerm !== "" || categoryFilter !== "All Categories"
            }
          />
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredBooks.length)} of {filteredBooks.length} books
          </div>
          <BookGrid
            books={filteredBooks}
            onBorrow={handleBorrowBook}
            onReturn={handleReturnBook}
          />


          {bookToBorrow && (
            <BookBorrowModal
              book={bookToBorrow}
              isOpen={borrowModalOpen}
              onClose={() => {
                setBorrowModalOpen(false);
                setBookToBorrow(null);
              }}
              onConfirm={handleConfirmBorrow}
              bookCopyId={borrowBookCopyId}
            />
          )}

          {bookToReturn && (
            <BookReturnModal
              book={bookToReturn}
              isOpen={returnModalOpen}
              onClose={handleCloseReturnProcess}
              onConfirm={handleConfirmReturn}
              bookCopyId={returnBookCopyId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
