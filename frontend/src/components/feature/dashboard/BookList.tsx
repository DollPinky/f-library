import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { books } from "../../../data/mockData";
import { Card, CardContent } from "@/components/ui/card";
export default function BookList() {
  return (
    <ScrollArea className="w-full whitespace-normal">
      <div className="flex w-full space-x-4 pb-4">
        {books.map((book) => (
          <Card key={book.id} className="w-[200px] flex-none">
            <CardContent className="p-4">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="aspect-[3/4] w-full rounded-lg object-cover"
              />
              <div className="mt-2">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="mt-1 font-semibold text-primary">${book.price}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
