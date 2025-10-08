import BookInforCard from "@/components/feature/admin/bookManagerment/bookDetail/BookInforCard";
import BorrowHistoryTable from "@/components/feature/admin/bookManagerment/bookDetail/BorrowHistoryTable";
import { Button } from "@/components/ui/button";
import { getBookById, getHistoryByBookCopyId } from "@/services/bookApi";
import type { Book, BrorrowHistory } from "@/types";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [history, setHistory] = useState<BrorrowHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookAndHistory = async () => {
      if (!bookId) {
        setError("Book ID is missing");
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || "";

        // Fetch book data
        const bookData = await getBookById(bookId, token);
        setBook(bookData);

        // Get the first bookCopy's ID directly without checking status
        if (bookData?.bookCopies?.length > 0) {
          const firstBookCopyId = bookData.bookCopies[0].bookCopyId;

          if (firstBookCopyId) {
            // Fetch history using this ID
            const historyData = await getHistoryByBookCopyId(
              firstBookCopyId,
              token
            );
            setHistory(historyData ?? []);
          } else {
            setHistory([]);
          }
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Failed to fetch book or history:", error);
        toast.error("Failed to load book details");
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndHistory();
  }, [bookId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Book Management</span>
        </Button>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Book Management</span>
        </Button>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg">Book not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Book Management</span>
        </Button>
      </div>

      <BookInforCard book={book} />

      <BorrowHistoryTable history={history} />
    </div>
  );
}
