import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Book } from "@/types";

import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

interface AddNewBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (book: Book) => void;
  isEdit: boolean;
  editData?: Book | null;
}

export default function AddNewBook({
  open,
  isEdit,
  editData,
  onOpenChange,
  onSubmit,
}: AddNewBookProps) {
  const [book, setBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    price: 0,
    coverUrl: "",
    status: "Unsubscribed",
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isEdit && editData) {
      setBook(editData);
    } else {
      setBook({
        id: `book-${Date.now()}`,
        title: "",
        author: "",
        price: 0,
        coverUrl: "",
        status: "Unsubscribed",
      });
    }
  }, [isEdit, editData, open]);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(book);
    if (isEdit) {
      toast.success("Đã sửa thành công");
      return;
    }
    toast.success("Đã thêm thành công");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          isMobile ? "w-[100vw] h-[60vh] p-6" : "sm:max-w-[500px]"
        }`}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Book" : "Add New Book"}</DialogTitle>

          <DialogDescription>
            Fill in the book information and save.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={book.title}
              onChange={handleOnChange}
              placeholder="Enter book title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={book.author}
              onChange={handleOnChange}
              placeholder="Enter author name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={book.price}
              onChange={handleOnChange}
              placeholder="Enter price"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverUrl">Image Cover</Label>
            <Input
              id="coverUrl"
              name="coverUrl"
              value={book.coverUrl}
              onChange={handleOnChange}
              placeholder="https://example.com/book.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 cursor-pointer"
            onClick={handleSubmit}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
