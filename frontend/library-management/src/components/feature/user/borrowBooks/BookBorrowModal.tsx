import { useState } from "react";
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
import { toast } from "sonner";
import type { Book } from "@/types";

interface BookBorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { username: string; bookCopyId: string }) => void;
}
export default function BookBorrowModal({
  book,
  isOpen,
  onClose,
  onConfirm,
}: BookBorrowModalProps) {
  const [username, setUsername] = useState("");
  const availableCopy = book.bookId;

  //   .find((copy) => copy.status === "AVAILABLE");
  const bookCopyId = availableCopy || "";

  const handleConfirm = () => {
    if (!username.trim() || !bookCopyId) return;
    onConfirm({ username, bookCopyId });
    setUsername("");
    toast.success(`Borrow ${book.title} successfully!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xs"
        aria-describedby="borrow-modal-desc"
      >
        <DialogHeader>
          <DialogTitle>Borrow {book.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Nhập account để mượn sách. Bạn cần điền đúng account FPT của mình.
        </DialogDescription>

        <div className="space-y-2">
          <Label htmlFor="username">Account</Label>
          <Input
            id="username"
            placeholder="Enter your FPT account..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!username.trim()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
