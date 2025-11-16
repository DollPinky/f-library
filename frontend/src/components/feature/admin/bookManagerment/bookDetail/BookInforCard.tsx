import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { borrowBookByBookCopyId } from "@/services/borrowBookService";
import type { Book } from "@/types";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookInfoCardProps {
  book: Book;
  refreshBookAndHistory?: () => void;
}

export default function BookInforCard({
  book,
  refreshBookAndHistory,
}: BookInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>(book);
  const [selectedBookCopyId, setSelectedBookCopyId] = useState<string | null>(
    null
  );

  const hasCopies =
    Array.isArray(currentBook.bookCopies) && currentBook.bookCopies.length > 0;
  const totalCopies = hasCopies ? currentBook.bookCopies?.length ?? 0 : 0;
  const availableCopies = hasCopies
    ? (
      currentBook.bookCopies?.filter((copy) => copy.status === "AVAILABLE") ??
      []
    ).length
    : 0;
  const locationCounts = hasCopies
    ? (currentBook.bookCopies?.reduce((acc: Record<string, number>, copy) => {
      const loc = copy.shelfLocation || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {}) ?? {})
    : {};
  const locationDisplay = Object.entries(locationCounts)
    .map(([loc, count]) => `${loc} (Amount: ${count})`)
    .join(', ');
  const borrowedCopies = hasCopies
    ? (
      currentBook.bookCopies?.filter((copy) => copy.status === "BORROWED") ??
      []
    ).length
    : 0;

  const firstCopyStatus: string =
    currentBook.bookCopies?.[0]?.status ?? "Unknown";

  const status: string =
    availableCopies > 0
      ? "AVAILABLE"
      : borrowedCopies > 0
        ? "BORROWED"
        : hasCopies
          ? firstCopyStatus
          : "Unknown";
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
    const availableCopy = currentBook.bookCopies?.find(
      (copy) => copy.status === "AVAILABLE"
    );

    if (availableCopy) {
      setSelectedBookCopyId(availableCopy.bookCopyId);
      console.log(availableCopy.bookCopyId);

      setIsModalOpen(true);
    } else {
      toast.error("No available copies to borrow");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookCopyId(null);
  };

  const handleConfirm = async (payload: {
    username: string;
    bookCopyId: string;
  }): Promise<boolean> => {
    const { bookCopyId } = payload;
    try {
      const copyToUpdate = currentBook.bookCopies?.find(
        (copy) => copy.bookCopyId === bookCopyId && copy.status === "AVAILABLE"
      );

      if (!copyToUpdate) {
        toast.error("This copy is no longer available");
        setIsModalOpen(false);
        return false;
      }

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

      setIsModalOpen(false);

      if (refreshBookAndHistory) {
        refreshBookAndHistory();
      }
      return true;
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
        `Failed to borrow the book. Please try again.`
      );
      return false;
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
              <p className="text-sm text-gray-500 mb-2">Location</p>
              <p className="text-base leading-relaxed">
                {locationDisplay || "No description available."}
              </p>
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
        book={currentBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        bookCopyId={selectedBookCopyId}
      />
    </Card>
  );
}
