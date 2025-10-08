import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import BookGrid from "@/components/feature/user/borrowBooks/BookGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBooks } from "@/services/bookApi";
import type { Book } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function BorrowBookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlblZlcnNpb24iOjAsInBlcm1pc3Npb25zIjpbIlVTRVJfVklFVyIsIlJFUE9SVF9WSUVXIiwiVVNFUl9NQU5BR0UiLCJCT09LX1ZJRVciLCJCT09LX01BTkFHRSIsIlNZU1RFTV9DT05GSUciLCJCT1JST1dfTUFOQUdFIl0sInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiZnVsbE5hbWUiOiJOZ3V54buFbiBWxINuIEFkbWluIiwiZW1haWwiOiJhZG1pbkBjb21wYW55LmNvbSIsInVzZXJuYW1lIjoiYWRtaW5AY29tcGFueS5jb20iLCJpYXQiOjE3NTk4NTc4ODgsImV4cCI6MTc1OTg2MTQ4OH0.euwj8kOn6fDnf4LP3syItOI-g--MveDPQueqGhZd31c3crdDlf2OPxROTHtu98qdb8Jpk4PXQIzpn8x7LSF3Ew";
        const data = await getAllBooks(token);
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);
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

  const handleBorrow = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleConfirm = ({
    username,
    bookCopyId,
  }: {
    username: string;
    bookCopyId: string;
  }) => {
    if (!selectedBook) return;
    console.log(
      `Mượn sách ${selectedBook.title} với username ${username} và bookCopyId ${bookCopyId}`
    );

    closeModal();
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold ">Borrow Books</CardTitle>
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
            showClearFilters={true}
          />
          <BookGrid books={paginatedBooks} onBorrow={handleBorrow} />
          {selectedBook && (
            <BookBorrowModal
              book={selectedBook}
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={handleConfirm}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
