import { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Book } from "@/types";

interface CommentBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { stars: number; content: string }) => void;
}

export default function CommentBookModal({
  book,
  isOpen,
  onClose,
  onSubmit,
}: CommentBookModalProps) {
  const [stars, setStars] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = () => {
    if (stars === 0) return;
    onSubmit({ stars, content });
    resetForm();
  };

  const resetForm = () => {
    setStars(0);
    setContent("");
    setHoveredStar(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const displayRating = hoveredStar !== null ? hoveredStar : stars;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate and Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about "{book?.title || "this book"}".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={cn(
                    "h-8 w-8 cursor-pointer",
                    star <= displayRating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  )}
                  onClick={() => setStars(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this book..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={stars === 0}
            className="bg-primary"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
