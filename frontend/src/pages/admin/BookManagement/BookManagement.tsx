import { BookForm } from "@/components/books/BookForm";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

import type { Book } from "@/types";
import { Download, Plus, Share } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  deleteBook,
  exportBookFromExcel,
  getAllBooks,
} from "@/services/bookManagementService";
import ImportBookModal from "@/components/feature/admin/bookManagerment/ImportBookModal";

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

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
    navigate(`/admin/book-management/book/${book.bookId}`);
    toast.info(`Viewing details for "${book.title}"`);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteBook(bookToDelete.bookId);
      if (response.success) {
        setBooks((prev) =>
          prev.filter((book) => book.bookId !== bookToDelete.bookId)
        );
        toast.success(`Book "${bookToDelete.title}" has been deleted`);
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    } finally {
      setIsDeleting(false);
      setBookToDelete(undefined);
      setIsDeleteDialogOpen(false);
    }
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

  const handleImportFile = () => {
    setIsImportModalOpen(true);
  };

  const handleImported = async (res?: any) => {
    setIsImportModalOpen(false);
    console.log(res);

    try {
      const fetched = await getAllBooks();
      const booksArray = Array.isArray(fetched)
        ? fetched
        : fetched?.data && Array.isArray(fetched.data)
        ? fetched.data
        : [];
      setBooks(booksArray);
      toast.success("Import completed and list refreshed.");
    } catch (err) {
      console.error("Failed to refresh books after import:", err);
      toast.success("Import completed.");
    }
  };

  const handleExportFile = async () => {
    try {
      await exportBookFromExcel();
      toast.success("Exported QR codes PDF successfully!");
    } catch (error) {
      toast.error("Failed to export QR codes PDF.");
      console.error(error);
    }
  };
  const categoryOptions = useMemo(() => {
    // Ensure books is an array before processing
    if (!Array.isArray(books)) {
      return [{ value: "All Categories", label: "All Categories" }];
    }

    const uniqueCategories = Array.from(
      new Set(
        books
          .map((book) => {
            const categoryName =
              typeof book?.category === "string"
                ? book.category
                : book?.category?.name;
            return categoryName;
          })
          .filter((name): name is string => Boolean(name))
      )
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button
                onClick={handleAddBook}
                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
              <Button
                onClick={handleImportFile}
                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
              >
                <Share className="w-4 h-4" />
                Import Excel file
              </Button>
              <Button
                onClick={handleExportFile}
                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Export Excel file
              </Button>
            </div>
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
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
      <ImportBookModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImported={handleImported}
      />
    </div>
  );
}
