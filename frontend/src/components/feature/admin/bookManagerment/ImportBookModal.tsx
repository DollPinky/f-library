import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { importBookFromExcel } from "@/services/bookManagementService";
import type { ImportBookFromExcelResponse } from "@/types/Book";

interface ImportBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported?: (res: ImportBookFromExcelResponse) => void;
}

export default function ImportBookModal({
  isOpen,
  onClose,
  onImported,
}: ImportBookModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!file) {
      toast.error("Please select an Excel or CSV file.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await importBookFromExcel(file);
      if (res?.success) {
        toast.success("Books imported successfully.");
        onImported?.(res.data as any);
        setFile(null);
        onClose();
      } else {
        toast.error(res?.message || "Import failed.");
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error(
        "An error occurred during import. Check console for details."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!isUploading) {
            setFile(null);
            onClose();
          }
        }}
      />
      <form
        className="relative z-10 w-full max-w-lg rounded bg-white p-6 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Import Books (Excel / CSV)</h3>
          <button
            type="button"
            className="rounded p-1 hover:bg-gray-100"
            onClick={() => {
              if (!isUploading) {
                setFile(null);
                onClose();
              }
            }}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="text-sm text-muted-foreground block">
            Select file
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="block w-full rounded border p-2 text-sm"
            disabled={isUploading}
          />
          {file && (
            <div className="text-sm text-muted-foreground">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (!isUploading) {
                  setFile(null);
                  onClose();
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Import"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
