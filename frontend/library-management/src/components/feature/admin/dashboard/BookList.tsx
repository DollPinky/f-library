import { books } from "../../../../data/mockData";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface BookListProps {
  isMobile?: boolean;
}

export default function BookList({ isMobile }: BookListProps) {
  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem
              key={book.id}
              className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent
                  className={`p-0 overflow-hidden ${
                    isMobile ? "pt-2" : "pt-4"
                  }`}
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div
                    className={`px-3 py-3 ${
                      isMobile ? "space-y-1" : "space-y-2"
                    }`}
                  >
                    <h3
                      className={`font-semibold line-clamp-1 ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      {book.title}
                    </h3>
                    <p
                      className={`text-muted-foreground line-clamp-1 ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {book.author}
                    </p>
                    <p
                      className={`font-semibold text-primary ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      ${book.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
