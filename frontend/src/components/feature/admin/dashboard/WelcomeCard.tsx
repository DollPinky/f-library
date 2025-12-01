import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Book, BookOpen } from "lucide-react";

export default function WelcomeCard() {
  const isMobile = useIsMobile();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <Card className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg border-none md:m-0 m-3">
      <CardContent className="flex h-full items-center justify-between p-6">
        <div className="z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">
              Library Dashboard
            </p>
          </div>
          <h2 className={isMobile ? "text-xl font-bold" : "text-3xl font-bold"}>
            {getGreeting()}, <span className="text-amber-200">Anthony</span>
          </h2>
          <p
            className={
              isMobile
                ? "text-xs opacity-90 leading-relaxed"
                : "max-w-xs text-sm opacity-90 leading-relaxed"
            }
          >
            Welcome to your library management dashboard. You can add new books,
            manage borrowers, and track all library activities from here.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              className={
                isMobile
                  ? "text-xs py-1 px-2 w-fit bg-white text-primary hover:bg-gray-100 shadow-md"
                  : "w-fit bg-white text-primary hover:bg-gray-100 shadow-md"
              }
            >
              Add New Book
            </Button>
            <Button
              variant="outline"
              className={
                isMobile
                  ? "text-xs py-1 px-2 w-fit bg-transparent border-white text-white hover:bg-white/20"
                  : "w-fit bg-transparent border-white text-white hover:bg-white/20"
              }
            >
              View Statistics
            </Button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-20 md:opacity-50 pointer-events-none">
          <Book size={isMobile ? 140 : 180} />
        </div>

        <div className="absolute top-0 right-0 -mt-4 -mr-8 h-24 w-24 rotate-12 rounded-full bg-white/20 blur-2xl filter"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-4 h-20 w-20 rounded-full bg-white/20 blur-xl filter"></div>
      </CardContent>
    </Card>
  );
}
