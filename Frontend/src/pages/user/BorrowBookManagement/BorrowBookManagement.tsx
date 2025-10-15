import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import BookGrid from "@/components/feature/user/borrowBooks/BookGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBooks } from "@/services/bookManagementService";
import {
  borrowBookByBookCopyId,
  returnedBookByBookCopyId,
} from "@/services/borrowBookService";
import type { Book } from "@/types";
import type { TitleModalBook } from "@/types/Book";
import { useEffect, useMemo, useState } from "react";

export default function BorrowBookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleModal, setTitleModal] = useState<TitleModalBook>("Borrow");
  const itemsPerPage = 10;

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

  // const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
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
    setSelectedBook(book);
    setIsModalOpen(true);
    setTitleModal("Borrow");
    return Promise.resolve();
  };
  const handleReturnBook = async (book: Book): Promise<void> => {
    setSelectedBook(book);
    setIsModalOpen(true);
    setTitleModal("Return");
    return Promise.resolve();
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleBorrowOrReturnBook = async ({
    bookCopyId,
  }: {
    bookCopyId: string;
  }) => {
    console.log(selectedBook);

    if (!selectedBook) return;
    try {
      if (titleModal === "Borrow") {
        await borrowBookByBookCopyId(bookCopyId);
      } else {
        await returnedBookByBookCopyId(bookCopyId);
      }
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
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
            filterOptions={categoryOptions}
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

          {selectedBook && (
            <BookBorrowModal
              title={titleModal}
              book={selectedBook}
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={handleBorrowOrReturnBook}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
