import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import BookGrid from "@/components/feature/user/borrowBooks/BookGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { borrowBookByBookCopyId, getAllBooks } from "@/services/bookApi";
import type { Book } from "@/types";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

export default function BorrowBookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

  // Function to fetch books - made reusable with useCallback
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const data = await getAllBooks(token);
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        book.category.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(books.map((book) => book.category.name))
    );
    return [
      { value: "All Categories", label: "All Categories" },
      ...uniqueCategories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [books]);

  // Updated to return a Promise as expected by BookGrid
  const handleBorrow = async (book: Book): Promise<void> => {
    setSelectedBook(book);
    setIsModalOpen(true);
    // This doesn't actually perform the borrow operation yet,
    // it just opens the modal
    return Promise.resolve();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleConfirm = async ({
    username,
    bookCopyId,
  }: {
    username: string;
    bookCopyId: string;
  }) => {
    if (!selectedBook) return;

    setLoadingBookId(selectedBook.bookId);

    try {
      console.log(
        `Mượn sách ${selectedBook.title} với username ${username} và bookCopyId ${bookCopyId}`
      );
      const token = localStorage.getItem("accessToken") || "";
      await borrowBookByBookCopyId(bookCopyId, token);

      toast.success(`Đã mượn sách "${selectedBook.title}" thành công!`);

      // Refresh the book list to update availability
      await fetchBooks();

      closeModal();
    } catch (error: any) {
      console.error("Error borrowing book:", error);
      toast.error(
        `Không thể mượn sách: ${
          error?.response?.data?.message || "Đã xảy ra lỗi"
        }`
      );
    } finally {
      setLoadingBookId(null);
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
              onBorrow={handleBorrow}
              refreshBooks={fetchBooks}
            />
          )}

          {selectedBook && (
            <BookBorrowModal
              book={selectedBook}
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={handleConfirm}
              isLoading={loadingBookId === selectedBook.bookId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
