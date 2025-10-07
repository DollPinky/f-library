import BookBorrowModal from "@/components/feature/user/borrowBooks/BookBorrowModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Book } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface BookInfoCardProps {
  book: Book;
}

export default function BookInforCard({ book }: BookInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasCopies =
    Array.isArray(book.bookCopies) && book.bookCopies.length > 0;
  const totalCopies = hasCopies ? book.bookCopies.length : 0;
  const availableCopies = hasCopies
    ? book.bookCopies.filter((copy) => copy.status === "AVAILABLE").length
    : 0;

  const status = hasCopies ? book.bookCopies[0].status : "Unknown";

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = ({
    username,
    bookCopyId,
  }: {
    username: string;
    bookCopyId: string;
  }) => {
    console.log("Borrow:", { username, bookCopyId });
    setIsModalOpen(false);
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
          <Button onClick={handleBorrow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Borrow Book
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center md:justify-start">
            <img
              src={book.bookCoverUrl}
              alt={book.title}
              className="w-full max-w-[250px] h-auto rounded-md shadow-lg object-cover"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-medium">{book.author || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{book.category?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Publisher</p>
                <p className="font-medium">{book.publisher || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Publication Year</p>
                <p className="font-medium">{book.year || "—"}</p>
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
                {book.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <BookBorrowModal
        book={book}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}
