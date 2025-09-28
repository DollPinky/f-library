import { navItems, settingsNavItem } from "@/data/mockData";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

interface SidebarProps {
  activateItemId?: string;
  onNavigate?: (id: string) => void;
}

function Sidebar(props: SidebarProps) {
  return (
    <div className="flex h-full max-h-screen flex-col border-r bg-white min-w-[240px]">
      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="grid gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal cursor-pointer",
                item.id === props.activateItemId
                  ? "bg-primary/10 text-primary-pink hover:bg-primary/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              )}
              onClick={() => props.onNavigate && props.onNavigate(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-black" />

        {/* Settings */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal",
            settingsNavItem.id === props.activateItemId
              ? "bg-primary/10 text-primary-pink hover:bg-primary/20"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          onClick={() =>
            props.onNavigate && props.onNavigate(settingsNavItem.id)
          }
        >
          <settingsNavItem.icon className="h-5 w-5" />
          {settingsNavItem.label}
        </Button>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
