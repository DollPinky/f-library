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
import { useEffect, useMemo, useState, type JSX } from "react";
import { ImageWithFallback } from "@/components/layout/ImageWithFallback";
import type { Book } from "@/types";
import { getAllBooks } from "@/services/bookManagementService";
import { toast } from "react-hot-toast";
import {
  Select, SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookList(): JSX.Element {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBooks = async (): Promise<void> => {
    setLoading(true);
    try {
      const res: any = await getAllBooks();
      const data = res?.data ?? res;

      let list: any[] = [];
      if (Array.isArray(data)) list = data;
      else if (data?.content && Array.isArray(data.content))
        list = data.content;
      else list = Array.isArray(res) ? res : [];

      const normalized: Book[] = list.map((b: any) => ({
        ...b,
        bookId: b.bookId ?? b.id ?? String(b._id ?? b.title ?? b.name ?? ""),
        title: b.title ?? b.name ?? "Untitled",
        author: b.author ?? "Unknown",
        bookCoverUrl: b.bookCoverUrl ?? b.coverImage ?? "",
        // keep rest of fields as-is (bookCopies, category, etc.)
        category: b.category ?? "Uncategorized",
        bookCopies: b.bookCopies ?? undefined,
      }));

      setBooks(normalized);
    } catch (err: any) {
      console.error("Failed to load books", err);
      toast.error(err?.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  console.log(books)
  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        books.map((book) =>
          typeof book.category === "string"
            ? book.category
            : book.category?.name ?? "Uncategorized"
        )
      )
    );
    return [
      { value: "All Categories", label: "All Categories" },
      ...uniqueCategories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "All Categories") return books;
    return books.filter((book) => {
      const categoryName =
        typeof book.category === "string"
          ? book.category
          : book.category?.name ?? "Uncategorized";
      return categoryName === selectedCategory;
    });
  }, [books, selectedCategory]);

  const hotBooks = useMemo(() => {
    const getTotalCopies = (b: Book) => b.bookCopies?.length ?? 0;
    const isAvailable = (b: Book) =>
      b.bookCopies?.some(
        (c: any) => (c?.status ?? "").toString().toUpperCase() === "AVAILABLE"
      ) ?? false;

    return filteredBooks
      .filter((book) => isAvailable(book))
      .sort((a, b) => getTotalCopies(b) - getTotalCopies(a))
      .slice(0, 8);
  }, [filteredBooks]);

  console.log("hotBooks", hotBooks)
  const categoryCounts = useMemo(() => {
    return filteredBooks.reduce((acc, book) => {
      const key = (book.category as any) ?? "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredBooks]);

  const sortedCategories = useMemo(
    () =>
      Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6),
    [categoryCounts]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          {/* Top row: title + filter + refresh in one line */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CardTitle>
                {selectedCategory === "All Categories"
                  ? "Book List"
                  : `${selectedCategory} Books`}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {availableCategories && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger className="w-40 sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                onClick={() => fetchBooks()}
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Description below */}
          <CardDescription>
            Discover popular books across different categories
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {hotBooks.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {books.map((book) => (
                <CarouselItem
                  key={book.bookId}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
                      {book.bookCoverUrl ? (
                        <ImageWithFallback
                          src={book.bookCoverUrl}
                          alt={`Cover of ${book.title}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                        {book.title}
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
            <div className="mb-2">
              {loading ? "Loading books..." : "No books found"}
            </div>
            <div className="text-sm">
              Try refreshing or selecting a different category
            </div>
          </div>
        )}

        {sortedCategories.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span>Category Distribution:</span>
              <Badge variant="outline">{filteredBooks.length} total books</Badge>
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
