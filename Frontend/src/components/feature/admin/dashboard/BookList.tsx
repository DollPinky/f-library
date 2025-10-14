import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { bookCategories, mockBooks } from "@/data/mockData";
import { ImageWithFallback } from "@/components/layout/ImageWithFallback";

interface BookListProps {
  isMobile?: boolean;
}

export default function BookList({ isMobile }: BookListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");

  const availableCategories = useMemo(() => {
    const categories = new Set(mockBooks.map((book) => book.category));
    return bookCategories.filter(
      (category) => category === "All Categories" || categories.has(category)
    );
  }, [mockBooks]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return mockBooks;
    }
    return mockBooks.filter((book) => book.category === selectedCategory);
  }, [mockBooks, selectedCategory]);

  const hotBooks = useMemo(() => {
    return filteredBooks
      .filter((book) => book.status === "Available")
      .sort((a, b) => b.totalCopies - a.totalCopies)
      .slice(0, 8);
  }, [filteredBooks]);

  const categoryCounts = filteredBooks.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Book List</CardTitle>
            <CardDescription>
              Discover popular books across different categories
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategory}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {availableCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-accent" : ""}
                  >
                    {category}
                    {selectedCategory === category && (
                      <Badge variant="secondary" className="ml-auto">
                        ✓
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View All Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
            >
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hotBooks.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {hotBooks.map((book) => (
                <CarouselItem
                  key={book.id}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                >
                  <div className="flex flex-col space-y-3">
                    {/* Book Cover */}
                    <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
                      {book.coverImage ? (
                        <ImageWithFallback
                          src={book.coverImage}
                          alt={`Cover of ${book.name}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                        {book.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-2">No books found</div>
            <div className="text-sm">Try selecting a different category</div>
          </div>
        )}

        {/* Category Summary - Moved to bottom */}
        {sortedCategories.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span>Category Distribution:</span>
              <Badge variant="outline">
                {filteredBooks.length} total books
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sortedCategories.slice(0, 6).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2"
                >
                  <span className="text-xs font-medium truncate">
                    {category}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
