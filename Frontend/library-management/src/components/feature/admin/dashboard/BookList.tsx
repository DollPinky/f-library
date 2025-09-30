import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/data/mockData";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export default function BookList() {
  return (
    <Carousel opts={{ align: "start" }} className="w-full whitespace-normal">
      <div className="flex w-full space-x-4 pb-4">
        <CarouselContent className="ml-3 mr-3">
          {books.map((book) => (
            <Card key={book.id} className="w-[200px] flex-none mr-3">
              <CardContent className="p-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="aspect-[3/4] w-full rounded-lg object-cover"
                />
                <div className="mt-2">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="mt-1 font-semibold text-primary">
                    ${book.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
