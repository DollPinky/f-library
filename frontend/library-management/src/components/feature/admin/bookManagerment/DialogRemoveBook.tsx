import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogRemoveBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  bookTitle?: string;
}

export default function DialogRemoveBook({
  open,
  onConfirm,
  onOpenChange,
  bookTitle,
}: DialogRemoveBookProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${isMobile ? "w-[50vw] h-[30vh] p-6" : "sm:max-w-[400px]"}`}
      >
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogDescription>
            {" "}
            Bạn có muốn xóa <span className="font-semibold">{bookTitle}</span>?
            Hành động này không thể khôi phục được!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
