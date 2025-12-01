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
import type { Book } from "@/types";

interface BookBorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { bookCopyId: string; companyAccount: string }) => void;
  bookCopyId: string | null;
}

export default function BookBorrowModal({
  book,
  isOpen,
  onClose,
  onConfirm,
  bookCopyId,
}: BookBorrowModalProps) {
  const [companyAccount, setCompanyAccount] = useState("");

  const handleConfirm = () => {
    if (!companyAccount.trim() || !bookCopyId) return;
    onConfirm({ bookCopyId, companyAccount });
    setCompanyAccount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg h-[250px] flex flex-col justify-between"
        aria-describedby="borrow-modal-desc"
      >
        <DialogHeader>
          <DialogTitle>Borrow {book.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter your FPT account to borrow this book.
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
          >
            Borrow Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
