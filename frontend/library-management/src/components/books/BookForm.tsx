import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { Book, BookStatus } from "@/types";
import { generateId } from "@/utils/until";
import { bookCategories } from "@/data/mockData";
import { Textarea } from "../ui/textarea";

interface BookFormProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
}

const bookStatuses: BookStatus[] = [
  "Available",
  "Borrowed",
  "Maintenance",
  "Reserved",
];

export function BookForm({ book, isOpen, onClose, onSave }: BookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    name: "",
    author: "",
    category: "",
    isbn: "",
    status: "Available",
    totalCopies: 1,
    availableCopies: 1,
    publishedDate: "",
    description: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        name: "",
        author: "",
        category: "",
        isbn: "",
        status: "Available",
        totalCopies: 1,
        availableCopies: 1,
        publishedDate: "",
        description: "",
        coverImage: "",
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Book name is required";
    }

    if (!formData.author?.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.isbn?.trim()) {
      newErrors.isbn = "ISBN is required";
    }

    if (!formData.totalCopies || formData.totalCopies < 1) {
      newErrors.totalCopies = "Total copies must be at least 1";
    }

    if (!formData.availableCopies || formData.availableCopies < 0) {
      newErrors.availableCopies = "Available copies cannot be negative";
    }

    if (
      formData.availableCopies &&
      formData.totalCopies &&
      formData.availableCopies > formData.totalCopies
    ) {
      newErrors.availableCopies = "Available copies cannot exceed total copies";
    }

    if (!formData.publishedDate) {
      newErrors.publishedDate = "Published date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const bookData: Book = {
      id: book?.id || generateId(),
      name: formData.name!,
      author: formData.author!,
      category: formData.category!,
      isbn: formData.isbn!,
      status: formData.status!,
      totalCopies: formData.totalCopies!,
      availableCopies: formData.availableCopies!,
      publishedDate: formData.publishedDate!,
      description: formData.description || "",
      coverImage: formData.coverImage || undefined,
    };

    onSave(bookData);
  };

  const handleInputChange = (field: keyof Book, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {book ? "Update book information" : "Add a new book to the library"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Book Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author || ""}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className={errors.author ? "border-destructive" : ""}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories
                    .filter((cat) => cat !== "All Categories")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn || ""}
                onChange={(e) => handleInputChange("isbn", e.target.value)}
                placeholder="978-0-123456-78-9"
                className={errors.isbn ? "border-destructive" : ""}
              />
              {errors.isbn && (
                <p className="text-sm text-destructive">{errors.isbn}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "Available"}
                onValueChange={(value: BookStatus) =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bookStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies *</Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies || ""}
                onChange={(e) =>
                  handleInputChange(
                    "totalCopies",
                    parseInt(e.target.value) || 0
                  )
                }
                className={errors.totalCopies ? "border-destructive" : ""}
              />
              {errors.totalCopies && (
                <p className="text-sm text-destructive">{errors.totalCopies}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCopies">Available Copies *</Label>
              <Input
                id="availableCopies"
                type="number"
                min="0"
                value={formData.availableCopies || ""}
                onChange={(e) =>
                  handleInputChange(
                    "availableCopies",
                    parseInt(e.target.value) || 0
                  )
                }
                className={errors.availableCopies ? "border-destructive" : ""}
              />
              {errors.availableCopies && (
                <p className="text-sm text-destructive">
                  {errors.availableCopies}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedDate">Published Date *</Label>
            <Input
              id="publishedDate"
              type="date"
              value={formData.publishedDate || ""}
              onChange={(e) =>
                handleInputChange("publishedDate", e.target.value)
              }
              className={errors.publishedDate ? "border-destructive" : ""}
            />
            {errors.publishedDate && (
              <p className="text-sm text-destructive">{errors.publishedDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Book description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={formData.coverImage || ""}
              onChange={(e) => handleInputChange("coverImage", e.target.value)}
              placeholder="https://example.com/book-cover.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Optional: Enter a URL for the book cover image
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{book ? "Update Book" : "Add Book"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
