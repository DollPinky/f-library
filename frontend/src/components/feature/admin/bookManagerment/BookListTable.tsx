import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecordEntry } from "@/types";
import { Avatar } from "@radix-ui/react-avatar";
import { FileText, Pencil, Trash2 } from "lucide-react";

interface BookListProps {
  isMobile?: boolean;
  records: RecordEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function BookListTable({
  isMobile,
  records,
  onEdit,
  onDelete,
  onView,
}: BookListProps) {
  return (
    <>
      {!isMobile ? (
        <div className="border rounded-md bg-white overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[80px] py-3 text-center">ID</TableHead>
                <TableHead className="py-3 w-[70px]"></TableHead>
                <TableHead className="py-3 text-center">Name</TableHead>
                <TableHead className="py-3 text-center">Author</TableHead>
                <TableHead className="py-3 text-center">Reader</TableHead>
                <TableHead className="py-3 text-center">Availability</TableHead>
                <TableHead className="text-center pl-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((book) => (
                <TableRow
                  key={book.bookId}
                  className="border-b hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium py-4">
                    {book.bookId}
                  </TableCell>
                  <TableCell className="py-4">
                    <Avatar className="h-12 w-9 rounded">
                      <img
                        src={book.bookImg}
                        alt={book.bookName}
                        className="object-cover aspect-[2/3]"
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4">{book.bookName}</TableCell>
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
                        onClick={() => onEdit(book.bookId)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={() => onDelete(book.bookId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => onView(book.bookId)}
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
          {records.map((book) => (
            <Card
              key={book.bookId}
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
                        src={book.bookImg}
                        alt={book.bookName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        ID: {book.bookId}
                      </span>
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

                    <h3 className="font-semibold text-base">{book.bookName}</h3>

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
                      onClick={() => onView(book.bookId)}
                    >
                      <FileText size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={() => onEdit(book.bookId)}
                    >
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onDelete(book.bookId)}
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
    </>
  );
}
