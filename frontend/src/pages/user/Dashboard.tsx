import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Book, BookOpen, Calendar, Clock, Star, User } from "lucide-react";

export default function UserDashboard() {
  const isMobile = useIsMobile();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col space-y-6 md:p-8">
      {/* Welcome Card */}
      <Card className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg border-none">
        <CardContent className="flex h-full items-center justify-between p-6">
          <div className="z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <User className="h-8 w-8" />
              <p className="text-sm font-medium uppercase tracking-wider opacity-90">
                User Dashboard
              </p>
            </div>
            <h2
              className={isMobile ? "text-xl font-bold" : "text-3xl font-bold"}
            >
              {getGreeting()}, <span className="text-amber-200">Reader</span>
            </h2>
            <p
              className={
                isMobile
                  ? "text-xs opacity-90 leading-relaxed"
                  : "max-w-xs text-sm opacity-90 leading-relaxed"
              }
            >
              Welcome to your personal library dashboard. Discover new books,
              manage your borrowings, and track your reading progress.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                className={
                  isMobile
                    ? "text-xs py-1 px-2 w-fit bg-white text-blue-600 hover:bg-gray-100 shadow-md"
                    : "w-fit bg-white text-blue-600 hover:bg-gray-100 shadow-md"
                }
              >
                Browse Books
              </Button>
              <Button
                variant="outline"
                className={
                  isMobile
                    ? "text-xs py-1 px-2 w-fit bg-transparent border-white text-white hover:bg-white/20"
                    : "w-fit bg-transparent border-white text-white hover:bg-white/20"
                }
              >
                My Library
              </Button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-20 md:opacity-50 pointer-events-none">
            <BookOpen size={isMobile ? 140 : 180} />
          </div>

          <div className="absolute top-0 right-0 -mt-4 -mr-8 h-24 w-24 rotate-12 rounded-full bg-white/20 blur-2xl filter"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-4 h-20 w-20 rounded-full bg-white/20 blur-xl filter"></div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className={isMobile ? "space-y-4" : "grid gap-6 grid-cols-4"}>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Books Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>5</div>
            <p className="text-xs text-muted-foreground">Currently reading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Books Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
              23
            </div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={
                isMobile ? "text-xl" : "text-2xl font-bold text-orange-500"
              }
            >
              2
            </div>
            <p className="text-xs text-muted-foreground">Next 3 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Reading Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={
                isMobile ? "text-xl" : "text-2xl font-bold text-green-500"
              }
            >
              4.8
            </div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Reading */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Currently Reading</CardTitle>
          <Button variant="link" className={isMobile ? "text-xs" : "text-sm"}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className={
              isMobile ? "space-y-4" : "grid gap-4 grid-cols-2 lg:grid-cols-3"
            }
          >
            {[1, 2, 3].map((book) => (
              <div
                key={book}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Book Title {book}</h4>
                  <p className="text-sm text-muted-foreground">Author Name</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-500">
                      Due in 3 days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reading Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded flex items-center justify-center">
                    <Book className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Returned: Book Title {item}
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.5</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={isMobile ? "space-y-4" : "grid gap-6 grid-cols-2"}>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Borrow Books</h3>
                <p className="text-sm text-muted-foreground">
                  Find and borrow new books
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Return Books</h3>
                <p className="text-sm text-muted-foreground">
                  Return borrowed books
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
