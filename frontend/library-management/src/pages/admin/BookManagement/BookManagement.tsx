import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, Search } from "lucide-react";
import BookListTable from "@/components/feature/admin/bookManagerment/BookListTable";
import { books } from "@/data/mockData";
import { useMemo, useState } from "react";
import AddNewBook from "@/components/feature/admin/bookManagerment/AddNewBook";
import type { Book } from "@/types";
import { toast } from "sonner";
import DialogRemoveBook from "@/components/feature/admin/bookManagerment/DialogRemoveBook";
import DialogViewDetail from "@/components/feature/admin/bookManagerment/DialogViewDetail";
import useDebounce from "@/hooks/useDebounce";

export default function BookManagement() {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currBook, setCurrBook] = useState<Book | null>(null);

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [openView, setOpenView] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // search
  const [searchValue, setSearchValue] = useState("");
  const debounceSearch = useDebounce(searchValue, 300);

  const filteredBooks = useMemo(() => {
    if (!debounceSearch) return books;

    return books.filter(
      (book) =>
        book.title
          .toLowerCase()
          .includes(debounceSearch.trim().toLowerCase()) ||
        book.title.toUpperCase().includes(debounceSearch.trim().toUpperCase())
    );
  }, [debounceSearch]);

  // xoa
  const handleDelete = (id: string) => {
    const bookDelete = books.find((book) => book.id === id);
    if (bookDelete && bookDelete.status === "Subscribed") {
      toast.error("Không thể xóa vì sách đã được mượn");
      return;
    }
    setBookToDelete(bookDelete || null);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      console.log("Deleting book:", bookToDelete.id);
      toast.success("Đã xóa thành công");
      setBookToDelete(null);
    }
  };
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setIsEdit(false);
      setCurrBook(null);
    }
  };
  // sua
  const handleEdit = (id: string) => {
    const updateBook = books.find((book) => book.id === id);
    if (updateBook && updateBook.status === "Subscribed") {
      toast.error("Không thể sửa sách vì đã được mượn");
      return;
    }
    setCurrBook(updateBook || null);
    setIsEdit(true);
    setOpen(true);
  };

  // view
  const handleView = (id: string) => {
    console.log("Đã xem chi tiết thành công", id);
    const book = books.find((book) => book.id === id);
    if (book) {
      setSelectedBook(book);
      setOpenView(true);
    }
  };

  // Add va sua
  const handleSubmit = (book: Book) => {
    if (isEdit) {
      console.log("Update book: ", book);
    } else {
      console.log("Add thành công", book);
    }

    setOpen(false);
    setIsEdit(false);
    setCurrBook(null);
  };
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm: justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Book Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-800 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {isMobile ? <PlusCircle size={16} /> : <PlusCircle size={18} />}
            <span>{isMobile ? "Add Book" : "Add New Book"}</span>
          </Button>
          <div className="relative">
            <Input
              value={searchValue}
              type="search"
              placeholder={isMobile ? "Search..." : "Search name book..."}
              className="pl-10 pr-4 py-2 w-full sm:w-[250px]"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
      {/* table */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-white">
          <p className="text-gray-500">
            No books found matching "{searchValue}"
          </p>
        </div>
      )}

      {filteredBooks.length > 0 && (
        <BookListTable
          isMobile={isMobile}
          books={filteredBooks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      <AddNewBook
        isEdit={isEdit}
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        editData={currBook}
      />

      <DialogRemoveBook
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        bookTitle={bookToDelete?.title}
      />
      <DialogViewDetail
        openView={openView}
        openViewChange={setOpenView}
        book={selectedBook}
      />
    </div>
  );
}
