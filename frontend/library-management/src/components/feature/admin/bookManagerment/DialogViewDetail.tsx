import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Book } from "@/types";

interface ViewBookDetailProps {
  openView?: boolean;
  openViewChange: (viewOpen: boolean) => void;
  book: Book | null;
}

export default function DialogViewDetail({
  openView,
  openViewChange,
  book,
}: ViewBookDetailProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={openView} onOpenChange={openViewChange}>
      <DialogContent
        className={`${
          isMobile
            ? "w-[95vw] max-w-[95vw] h-[60vh] max-h-[90vh] p-4 overflow-y-auto"
            : "sm:max-w-[600px] max-h-[80vh]"
        }`}
      >
        <DialogHeader className="text-center mb-4">
          <h1 className="text-xl font-bold">Book Detail</h1>
        </DialogHeader>

        {book && (
          <div
            className={`${
              isMobile
                ? "flex flex-col space-y-4"
                : "grid grid-cols-1 md:grid-cols-2 gap-6"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src={book.coverUrl}
                alt={book.title}
                className={`${
                  isMobile ? "w-40 h-56" : "w-40 h-56"
                } object-cover rounded-lg shadow-md`}
              />
              <div className="text-center space-y-1">
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-semibold`}
                >
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Author:</span> {book.author}
                </p>
                <p className="text-sm text-gray-900 font-bold">
                  <span className="font-bold">Price:</span> ${book.price}
                </p>
                <p
                  className={`text-sm font-medium ${
                    book.status === "Subscribed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {book.status}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <h3
                className={`${
                  isMobile ? "text-base" : "text-md"
                } font-semibold mb-3 text-center md:text-left`}
              >
                Borrow History
              </h3>
              <div
                className={`${
                  isMobile
                    ? "max-h-48 border rounded-lg p-3"
                    : "max-h-64 border rounded-lg p-4"
                } overflow-y-auto bg-gray-50`}
              >
                {book.history.length > 0 ? (
                  <div className="space-y-2">
                    {book.history.map((h) => (
                      <div
                        key={h.id}
                        className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                      >
                        <p className="text-sm">
                          <span className="font-medium text-gray-800">
                            {h.borrower}
                          </span>{" "}
                          borrowed on{" "}
                          <span className="italic text-gray-600">
                            {h.borrowDate}
                          </span>
                        </p>
                        {h.returnDate ? (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            ✓ Returned: {h.returnDate}
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            ⏳ Not returned yet
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      No borrow history available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
