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
import type { BrorrowHistory } from "@/types";
import { formatDate } from "@/utils/formatDate";

import { useEffect, useState } from "react";

interface BorrowHistoryTableProps {
  history: BrorrowHistory[];
}
export default function BorrowHistoryTable({
  history,
}: BorrowHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [history]);

  const totalPages = Math.ceil(history.length / rowsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const historyData = [...paginatedHistory].sort(
    (a, b) =>
      new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
  );
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  return (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.length > 0 ? (
                historyData.map((record, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
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
      </CardContent>
    </Card>
  );
}
