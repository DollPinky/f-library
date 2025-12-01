import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/types";
import CommentBookModal from "@/components/feature/user/commentBooks/CommentBookModal";
import { toast } from "sonner";
import { createCommentBook } from "@/services/commentsApi";

interface BookReturnModalProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    companyAccount: string;
    bookCopyId: string;
  }) => Promise<boolean>;
  bookCopyId: string | null;
}

export default function BookReturnModal({
  book,
  isOpen,
  onClose,
  onConfirm,
  bookCopyId,
}: BookReturnModalProps) {
  const [companyAccount, setCompanyAccount] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.role || "";
  const isReader = role === "READER";

  const handleConfirm = async () => {
    if (!companyAccount.trim() || !bookCopyId) return;

    try {
      const success = await onConfirm({ companyAccount, bookCopyId });

      if (success && isReader && book) {
        toast.success("Book returned successfully!");

        setTimeout(() => {
          setIsCommentModalOpen(true);
        }, 500);
      } else if (success) {
        toast.success("Book returned successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book");
    }
  };

  const handleSubmitComment = async (data: {
    stars: number;
    content: string;
  }) => {
    try {
      if (!book?.bookId) {
        toast.error("Missing book information");
        return;
      }

      const payload = {
        bookId: book.bookId,
        content: data.content,
        star: data.stars,
      };

      await createCommentBook(payload);
      toast.success("Thank you for your review!");
      setIsCommentModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit your review");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCompanyAccount("");
      setIsCommentModalOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog
        open={isOpen && !isCommentModalOpen}
        onOpenChange={(open) => {
          if (!open && !isCommentModalOpen) onClose();
        }}
      >
        <DialogContent
          className="sm:max-w-lg h-[250px] flex flex-col justify-between"
          aria-describedby="return-modal-desc"
        >
          <DialogHeader>
            <DialogTitle>Return {book?.title || "Book"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter your FPT account to return this book.
          </DialogDescription>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            <Label htmlFor="username">Account</Label>
            <Input
              id="username"
              placeholder="Enter your FPT account..."
              value={companyAccount}
              onChange={(e) => setCompanyAccount(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!companyAccount.trim() || !bookCopyId}
              variant="default"
            >
              Return Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {book && (
        <CommentBookModal
          book={book}
          isOpen={isCommentModalOpen}
          onClose={() => {
            setIsCommentModalOpen(false);
            onClose();
          }}
          onSubmit={handleSubmitComment}
        />
      )}
    </>
  );
}
