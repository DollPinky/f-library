import BookList from "@/components/feature/admin/dashboard/BookList";
import BookTable from "@/components/feature/admin/dashboard/BookTable";
import { VisitChart } from "@/components/feature/admin/dashboard/VisitChart";
import WelcomeCard from "@/components/feature/admin/dashboard/WelcomeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col space-y-6 p-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 h-full">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Readers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,456</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book List</CardTitle>
          <Button variant="link">View All</Button>
        </CardHeader>
        <CardContent>
          <BookList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <BookTable />
        </CardContent>
      </Card>
    </div>
  );
}
