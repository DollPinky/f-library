import { BookForm } from "@/components/books/BookForm";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
// import { bookCategories, mockBooks } from "@/data/mockData";
import type { Book } from "@/types";
import { Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAllBooks } from "@/services/bookApi";

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";

        const data = await getAllBooks(token);
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast.error("Failed to load books");
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

  const handleAddBook = () => {
    setSelectedBook(undefined);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleViewBook = (book: Book) => {
    // In a real app, this would navigate to a detailed view
    navigate(`/admin/book-management/book/${book.bookId}`);
    toast.info(`Viewing details for "${book.title}"`);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      setBooks((prev) =>
        prev.filter((book) => book.bookId !== bookToDelete.bookId)
      );
      toast.success(`Book "${bookToDelete.title}" has been deleted`);
      setBookToDelete(undefined);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSaveBook = (bookData: Book) => {
    if (selectedBook) {
      // Update existing book
      setBooks((prev) =>
        prev.map((book) =>
          book.bookId === selectedBook.bookId ? bookData : book
        )
      );
      toast.success(`Book "${bookData.title}" has been updated`);
    } else {
      // Add new book
      setBooks((prev) => [...prev, bookData]);
      toast.success(`Book "${bookData.title}" has been added`);
    }
    setIsFormOpen(false);
    setSelectedBook(undefined);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

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

  return (
    <div className="space-y-6">
      <Card className="m-3 md:m-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Book Management</CardTitle>
            <Button onClick={handleAddBook} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="text-sm text-muted-foreground">
            Showing {paginatedBooks.length} of {filteredBooks.length} books
          </div>

          <BookTable
            books={paginatedBooks}
            onView={handleViewBook}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
              // currentPage={currentPage}
              // totalPages={totalPages}
              // onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <BookForm
        book={selectedBook}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBook}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Book"
        description={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
