import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  borrowBookByBookCopyId,
  returnedBookByBookCopyId,
} from "@/services/borrowBookService";
import type { Book } from "@/types";
import type { TitleModalBook } from "@/types/Book";
import { Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookInfoCardProps {
  book: Book;
  refreshBookAndHistory: () => void;
}

export default function BookInforCard({
  book,
  refreshBookAndHistory,
}: BookInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<TitleModalBook>("Borrow");
  const [currentBook, setCurrentBook] = useState<Book>(book);

  const hasCopies =
    Array.isArray(currentBook.bookCopies) && currentBook.bookCopies.length > 0;
  const totalCopies = hasCopies ? currentBook.bookCopies?.length : 0;
  const availableCopies = hasCopies
    ? currentBook.bookCopies?.filter((copy) => copy.status === "AVAILABLE")
        .length
    : 0;
  const borrowedCopies = hasCopies
    ? currentBook.bookCopies?.filter((copy) => copy.status === "BORROWED")
        .length
    : 0;

  const status = hasCopies ? currentBook.bookCopies[0].status : "Unknown";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500">Available</Badge>;
      case "BORROWED":
        return <Badge className="bg-blue-500">Borrowed</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      case "RESERVED":
        return <Badge className="bg-orange-500">Reserved</Badge>;
      case "LOST":
        return <Badge className="bg-red-500">Lost</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleBorrow = () => {
    setModalTitle("Borrow");
    setIsModalOpen(true);
  };

  const handleReturn = () => {
    setModalTitle("Return");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async ({
    bookCopyId,
  }: {
    username: string;
    bookCopyId: string;
  }) => {
    try {
      if (modalTitle === "Borrow") {
        await borrowBookByBookCopyId(bookCopyId);
        toast.success("Borrowed successfully!");

        setCurrentBook((prev) => ({
          ...prev,
          bookCopies: prev.bookCopies?.map((copy) =>
            copy.bookCopyId === bookCopyId
              ? { ...copy, status: "BORROWED" }
              : copy
          ),
        }));
      } else {
        await returnedBookByBookCopyId(bookCopyId);
        // toast.success("Returned successfully!");

        setCurrentBook((prev) => ({
          ...prev,
          bookCopies: prev.bookCopies?.map((copy) =>
            copy.bookCopyId === bookCopyId
              ? { ...copy, status: "AVAILABLE" }
              : copy
          ),
        }));
      }
      setIsModalOpen(false);
      refreshBookAndHistory();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            modalTitle === "Borrow" ? "borrow" : "return"
          } the book. Please try again.`
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">
            {currentBook.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleBorrow}
              className="flex items-center gap-2"
              disabled={availableCopies === 0}
            >
              <Plus className="h-4 w-4" />
              Borrow Book
            </Button>
            <Button
              onClick={handleReturn}
              className="flex items-center gap-2"
              variant="secondary"
              disabled={borrowedCopies === 0}
            >
              <RotateCcw className="h-4 w-4" />
              Return Book
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center md:justify-start">
            <img
              src={currentBook.bookCoverUrl}
              alt={currentBook.title}
              className="w-full max-w-[250px] h-auto rounded-md shadow-lg object-cover"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-medium">{currentBook.author || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">
                  {currentBook.category?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Publisher</p>
                <p className="font-medium">{currentBook.publisher || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Publication Year</p>
                <p className="font-medium">{currentBook.year || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="font-medium">{getStatusBadge(status)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Copies</p>
                <p className="font-medium">
                  {hasCopies
                    ? `${availableCopies} / ${totalCopies} available`
                    : "No copies"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-base leading-relaxed">
                {currentBook.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <BookBorrowModal
        title={modalTitle}
        book={currentBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}
