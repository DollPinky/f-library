import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import BookReturnModal from "@/components/feature/user/borrowBooks/BookReturnModal";
import type { BrorrowHistory } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { returnedBookByBookCopyId } from "@/services/borrowBookService";
import { toast } from "sonner";
import { useState } from "react";

interface BorrowHistoryTableProps {
  history: BrorrowHistory[];
  refreshBookAndHistory: () => void;
}

export default function BorrowHistoryTable({
  history,
  refreshBookAndHistory,
}: BorrowHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  // State cho modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BrorrowHistory | null>(
    null
  );

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
  );

  const totalPages = Math.ceil(sortedHistory.length / rowsPerPage);
  const paginatedHistory = sortedHistory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleReturnBook = (record: BrorrowHistory) => {
    setSelectedRecord(record);
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async ({
    username,
    bookCopyId,
  }: {
    username: string;
    bookCopyId: string;
  }): Promise<boolean> => {
    try {
      await returnedBookByBookCopyId(bookCopyId, username);
      console.log(bookCopyId);
      console.log(username);

      toast.success("Returned successfully!");
      setIsReturnModalOpen(false);
      refreshBookAndHistory();
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Return failed!");
      return false;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Borrow History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Reader Account</TableHead>
                  <TableHead className="text-center">Borrow Time</TableHead>
                  <TableHead className="text-center">Return Time</TableHead>
                  <TableHead className="text-end">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHistory.length > 0 ? (
                  paginatedHistory.map((record, index) => (
                    <TableRow
                      key={record.bookCopyId + "-" + index}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {record.username}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(record.borrowDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.returnedDate
                          ? formatDate(record.returnedDate)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-end">
                        {!record.returnedDate && (
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(record)}
                          >
                            Return Book
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      There is no borrowing history.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationLink
                        isActive={currentPage === page}
                        key={page}
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
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {selectedRecord && (
        <BookReturnModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          onConfirm={handleConfirmReturn}
          bookCopyId={selectedRecord.bookCopyId}
        />
      )}
    </>
  );
}
