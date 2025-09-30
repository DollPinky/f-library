import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, Search } from "lucide-react";
import BookListTable from "@/components/feature/admin/bookManagerment/BookListTable";
import { records } from "@/data/mockData";

export default function BookManagement() {
  const isMobile = useIsMobile();

  const handleDelete = (id: string) => {
    console.log("Đã xóa thành công", id);
  };
  const handleEdit = (id: string) => {
    console.log("Đã sửa thành công", id);
  };
  const handleView = (id: string) => {
    console.log("Đã xem chi tiết thành công", id);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm: justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Book Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-800 cursor-pointer">
            {isMobile ? <PlusCircle size={16} /> : <PlusCircle size={18} />}
            <span>{isMobile ? "Add Book" : "Add New Book"}</span>
          </Button>
          <div className="relative">
            <Input
              type="search"
              placeholder={isMobile ? "Search..." : "Search by ID or name..."}
              className="pl-10 pr-4 py-2 w-full sm:w-[250px]"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
      {/* table */}
      <BookListTable
        isMobile={isMobile}
        records={records}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
      />
    </div>
  );
}
