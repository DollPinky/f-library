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
  const itemsPerPage = 10;
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
    const fetchAllBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllBooks();
        const booksArray = Array.isArray(res)
          ? res
          : res?.data && Array.isArray(res.data)
            ? res.data
            : [];
        setBooks(booksArray);
      } catch (error: any) {
        setError("Failed to load book list. Please try again later.");
        console.log(error, "Error fetching book list");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        book.category?.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, categoryFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      console.log(companyAccount);

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
    setReturnModalOpen(false);
    setBookToReturn(null);
    setReturnBookCopyId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Borrow Books</CardTitle>
        </CardHeader>
        <CardContent>
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <BookGrid
              books={paginatedBooks}
              onBorrow={handleBorrowBook}
              onReturn={handleReturnBook}
            />
          )}

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
