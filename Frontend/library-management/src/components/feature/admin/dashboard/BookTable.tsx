import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, User } from "lucide-react";

import { records } from "../../../../data/mockData";

export default function BookTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book ID</TableHead>
          <TableHead>Reader Name</TableHead>
          <TableHead>Reader ID</TableHead>
          <TableHead>Book Name</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.bookId}>
            <TableCell>{record.bookId}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <User />
                  <AvatarFallback>{record.readerName[0]}</AvatarFallback>
                </Avatar>
                {record.readerName}
              </div>
            </TableCell>
            <TableCell>{record.readerId}</TableCell>
            <TableCell>{record.bookName}</TableCell>
            <TableCell>{record.author}</TableCell>
            <TableCell>{record.duration}</TableCell>
            <TableCell>
              <Badge
                variant={
                  record.status === "Subscribed" ? "success" : "destructive"
                }
              >
                {record.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">${record.fee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
