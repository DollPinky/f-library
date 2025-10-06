import { BookForm } from "@/components/books/BookForm";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { bookCategories, mockBooks } from "@/data/mockData";
import type { Book } from "@/types";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || book.category === categoryFilter;
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
    navigate(`book/${book.id}`);
    toast.info(`Viewing details for "${book.name}"`);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      setBooks((prev) => prev.filter((book) => book.id !== bookToDelete.id));
      toast.success(`Book "${bookToDelete.name}" has been deleted`);
      setBookToDelete(undefined);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSaveBook = (bookData: Book) => {
    if (selectedBook) {
      // Update existing book
      setBooks((prev) =>
        prev.map((book) => (book.id === selectedBook.id ? bookData : book))
      );
      toast.success(`Book "${bookData.name}" has been updated`);
    } else {
      // Add new book
      setBooks((prev) => [...prev, bookData]);
      toast.success(`Book "${bookData.name}" has been added`);
    }
    setIsFormOpen(false);
    setSelectedBook(undefined);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

  const categoryOptions = bookCategories.map((category) => ({
    value: category,
    label: category,
  }));

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
            searchPlaceholder="Search books by name, author, or ISBN..."
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
        description={`Are you sure you want to delete "${bookToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
