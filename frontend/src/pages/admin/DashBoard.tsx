import BookList from "@/components/feature/admin/dashboard/BookList";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { VisitChart } from "@/components/feature/admin/dashboard/VisitChart";
import WelcomeCard from "@/components/feature/admin/dashboard/WelcomeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col space-y-6 md:p-8">
      <div className={isMobile ? "space-y-6" : "grid gap-6 grid-cols-3"}>
        <div className={isMobile ? "" : "col-span-2 h-full"}>
          <WelcomeCard />
        </div>

        <div className="h-full">
          <Card className="h-full flex flex-col">
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
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              1,234
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Active Readers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              892
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              $3,456
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book List</CardTitle>
          <Button variant="link" className={isMobile ? "text-xs" : "text-sm"}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <BookList isMobile={isMobile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <BookTable isMobile={isMobile} />
        </CardContent>
      </Card>
    </div>
  );
}
