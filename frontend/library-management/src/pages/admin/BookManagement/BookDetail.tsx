import BookInforCard from "@/components/feature/admin/bookManagerment/bookDetail/BookInforCard";
import BorrowHistoryTable from "@/components/feature/admin/bookManagerment/bookDetail/BorrowHistoryTable";
import { Button } from "@/components/ui/button";
import { getBookById, getHistoryByBookCopyId } from "@/services/bookApi";
import type { Book, BrorrowHistory } from "@/types";
// import { Skeleton } from "@/components/ui/skeleton";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  // console.log(bookId);
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [history, setHistory] = useState<BrorrowHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlblZlcnNpb24iOjAsInBlcm1pc3Npb25zIjpbIlVTRVJfVklFVyIsIlJFUE9SVF9WSUVXIiwiVVNFUl9NQU5BR0UiLCJCT09LX1ZJRVciLCJCT09LX01BTkFHRSIsIlNZU1RFTV9DT05GSUciLCJCT1JST1dfTUFOQUdFIl0sInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiZnVsbE5hbWUiOiJOZ3V54buFbiBWxINuIEFkbWluIiwiZW1haWwiOiJhZG1pbkBjb21wYW55LmNvbSIsInVzZXJuYW1lIjoiYWRtaW5AY29tcGFueS5jb20iLCJpYXQiOjE3NTk4NTc4ODgsImV4cCI6MTc1OTg2MTQ4OH0.euwj8kOn6fDnf4LP3syItOI-g--MveDPQueqGhZd31c3crdDlf2OPxROTHtu98qdb8Jpk4PXQIzpn8x7LSF3Ew";

  useEffect(() => {
    const fetchBookAndHistory = async () => {
      if (!bookId) {
        setError("Book ID is missing");
        return;
      }
      setLoading(true);
      try {
        const bookData = await getBookById(bookId, token);
        setBook(bookData);

        const historyData = await getHistoryByBookCopyId(bookId, token);
        setHistory(historyData ?? []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast.error("Failed to load books");
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
