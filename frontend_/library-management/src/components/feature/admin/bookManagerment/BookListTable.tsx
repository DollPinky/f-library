import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Book } from "@/types";
import { Avatar } from "@radix-ui/react-avatar";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

interface BookListProps {
  isMobile?: boolean;
  books: Book[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  isEdit?: boolean;
}

export default function BookListTable({
  isMobile,
  books,
  onEdit,
  onDelete,
  onView,
}: // isEdit,
BookListProps) {
  const LIMIT_PAGE = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(books.length / LIMIT_PAGE);

  const paginatedBook = useMemo(() => {
    const startIndex = (currentPage - 1) * LIMIT_PAGE;
    return books.slice(startIndex, startIndex + LIMIT_PAGE);
  }, [books, currentPage]);
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      {!isMobile ? (
        <div className="border rounded-md bg-white overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="py-3 w-[70px]"></TableHead>
                <TableHead className="py-4">Name</TableHead>
                <TableHead className="py-4">Author</TableHead>
                <TableHead className="py-4">Reader</TableHead>
                <TableHead className="py-4 ">Availability</TableHead>
                <TableHead className="text-center pl-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBook.map((book) => (
                <TableRow
                  key={book.id}
                  className="border-b hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4">
                    <Avatar className="h-12 w-9 rounded">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="object-cover aspect-[2/3]"
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4">{book.title}</TableCell>
                  <TableCell className="py-4">{book.author}</TableCell>
                  <TableCell className="py-4">
                    {book.readerName || "-"}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={
                        book.status === "Subscribed" ? "outline" : "secondary"
                      }
                      className={
                        book.status === "Subscribed"
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                      }
                    >
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 pr-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => onEdit(book.id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={() => onDelete(book.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => onView(book.id)}
                      >
                        <FileText size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBook.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden border-l-4 hover:shadow-md transition-all"
              style={{
                borderLeftColor:
                  book.status === "Subscribed" ? "#f59e0b" : "#10b981",
              }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-14 rounded overflow-hidden shadow-sm border">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          book.status === "Subscribed" ? "outline" : "secondary"
                        }
                        className={
                          book.status === "Subscribed"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {book.status}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-base">{book.title}</h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Author</p>
                        <p className="font-medium">{book.author}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reader</p>
                        <p className="font-medium">{book.readerName || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 border-t pt-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => onView(book.id)}
                    >
                      <FileText size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={() => onEdit(book.id)}
                    >
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onDelete(book.id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() =>
                  currentPage > 1 && setCurrentPage(Math.max(currentPage - 1))
                }
              />
            </PaginationItem>
            <PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationLink
                    isActive={currentPage === page}
                    key={page}
                    href="#"
                    onClick={() => handleChangePage(page)}
                  >
                    {page}
                  </PaginationLink>
                )
              )}
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() =>
                  currentPage < totalPages &&
                  setCurrentPage(Math.min(currentPage + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
