import { Eye, Edit, Trash2, MoreHorizontal, ImageIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageWithFallback } from "@/components/layout/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Book, BookCopy } from "@/types";

interface BookTableProps {
  books: Book[];
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const getStatusColor = (bookCopies: BookCopy[]) => {
  if (!bookCopies || bookCopies.length === 0)
    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  const statusCount = bookCopies.reduce((acc, copy) => {
    acc[copy.status] = (acc[copy.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  if (statusCount["AVAILABLE"] > 0) {
    return "bg-green-100 text-green-800 hover:bg-green-100";
  } else if (statusCount["BORROWED"] > 0) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  } else if (statusCount["MAINTENANCE"] > 0) {
    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
  } else if (statusCount["RESERVED"] > 0) {
    return "bg-purple-100 text-purple-800 hover:bg-purple-100";
  } else {
    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getDisplayStatus = (bookCopies: BookCopy[]) => {
  if (!bookCopies || bookCopies.length === 0) return "Unknown";

  if (bookCopies.some((copy) => copy.status === "AVAILABLE")) {
    return "Available";
  } else if (bookCopies.some((copy) => copy.status === "BORROWED")) {
    return "Borrowed";
  } else if (bookCopies.some((copy) => copy.status === "MAINTENANCE")) {
    return "Maintenance";
  } else if (bookCopies.some((copy) => copy.status === "RESERVED")) {
    return "Reserved";
  } else {
    return "Unknown";
  }
};
const BookTable = ({ books, onView, onEdit, onDelete }: BookTableProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No books found</div>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search criteria or add a new book.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Book Name</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Available/Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.bookId}>
              <TableCell>
                <div className="w-12 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                  {book.bookCoverUrl ? (
                    <ImageWithFallback
                      src={book.bookCoverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Year: {book.year}
                  </div>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.category.name}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getStatusColor(book.bookCopies)}
                >
                  {getDisplayStatus(book.bookCopies)}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={`flex items-center justify-center font-semibold ${
                    book.bookCopies.filter(
                      (copy) => copy.status === "AVAILABLE"
                    ).length === 0
                      ? "text-destructive"
                      : "text-green-700"
                  }`}
                >
                  {
                    book.bookCopies.filter(
                      (copy) => copy.status === "AVAILABLE"
                    ).length
                  }
                  <span className="text-muted-foreground font-normal ml-1">
                    /{book.bookCopies.length}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(book)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(book)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(book)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default BookTable;
