import BookList from "@/components/feature/admin/dashboard/BookList";
import StatsList from "@/components/feature/admin/dashboard/StatsList";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { VisitChart } from "@/components/feature/admin/dashboard/VisitChart";
import WelcomeCard from "@/components/feature/admin/dashboard/WelcomeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  console.log('Dashboard rendered');
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
      <StatsList />
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
