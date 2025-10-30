import BookList from "@/components/feature/admin/dashboard/BookList";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { VisitChart } from "@/components/feature/admin/dashboard/VisitChart";
import WelcomeCard from "@/components/feature/admin/dashboard/WelcomeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { getDashboardStats } from "@/services/dashboardService";
import { getAllBooks } from "@/services/bookManagementService";
import { toast } from "react-hot-toast";
import type { Book } from "@/types";


export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({ totalBook: 0, totalUsers: 0, totalBorrow: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        } else {
          toast.error("Failed to load dashboard stats");
        }

        // Fetch books to calculate total books
        const booksRes = await getAllBooks();
        if (booksRes.success && booksRes.data) {
          const data = booksRes.data;
          let list: any[] = [];
          if (Array.isArray(data)) list = data;
          else if ((data as any)?.content && Array.isArray((data as any).content)) list = (data as any).content;
          else list = Array.isArray(booksRes) ? booksRes : [];
          setStats(prev => ({ ...prev, totalBook: list.length }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="flex flex-col space-y-6 md:p-8">
      <div className={isMobile ? "space-y-6" : "grid gap-6 grid-cols-3"}>
        <div className={isMobile ? "" : "col-span-2 h-full"}>
          <WelcomeCard />
        </div>

        <div className="h-full">
          <Card className="h-full flex flex-col md:m-0 m-3">
            <CardHeader className="pb-2">
              <CardTitle>Visit & Read</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="h-[200px]">
                <VisitChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={isMobile ? "space-y-4" : "grid gap-6 grid-cols-3"}>
        <Card className="md:m-0 m-3">
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              {loading ? "..." : stats.totalBook.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="md:m-0 m-3">
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Active Readers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              {loading ? "..." : stats.totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="md:m-0 m-3">
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Total Book Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              {loading ? "..." : stats.totalBorrow.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing 3 of 3 statistics
      </div>

      <BookList />

      <Card className="md:m-0 m-3 mt-7">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book Records</CardTitle>
          <Button variant="link" className={isMobile ? "text-xs" : "text-sm"}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <BookTable
            books={[]}
            onView={() => { }}
            onEdit={() => { }}
            onDelete={() => { }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
