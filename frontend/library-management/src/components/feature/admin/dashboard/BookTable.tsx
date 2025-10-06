import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";

import { books } from "../../../../data/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BookTableProps {
  isMobile?: boolean;
}

export default function BookTable({ isMobile }: BookTableProps) {
  return (
    <>
      {!isMobile ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
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
              {books.slice(0, 5).map((record) => (
                <TableRow key={record.id}>
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
                  <TableCell className="max-w-[200px] truncate">
                    {record.title}
                  </TableCell>
                  <TableCell>{record.author}</TableCell>
                  <TableCell>{record.duration}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "Subscribed"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        record.status === "Subscribed"
                          ? "bg-green-100 text-green-800"
                          : ""
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
        </div>
      ) : (
        <div className="space-y-4">
          {books.slice(0, 5).map((record) => (
            <Card
              key={record.id}
              className="overflow-hidden border-l-4 hover:shadow-md transition-all"
              style={{
                borderLeftColor:
                  record.status === "Subscribed" ? "#059669" : "#ef4444",
              }}
            >
              <CardContent className="p-0">
                <div className="w-full p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarFallback>
                          {record.readerName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {record.readerName || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {record.readerId}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "Subscribed"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        record.status === "Subscribed"
                          ? "bg-green-100 text-green-800 whitespace-nowrap"
                          : "whitespace-nowrap"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-base mb-1 line-clamp-1">
                      {record.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {record.author}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-slate-50 p-3 rounded-md">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        DURATION
                      </p>
                      <p className="font-medium">{record.duration}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold text-slate-500">
                      TOTAL FEE
                    </p>
                    <p className="font-bold text-primary text-lg">
                      ${record.fee.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
