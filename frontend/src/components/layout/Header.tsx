import { Bell, ChevronDown, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b bg-white p-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search your book"
          className="w-full rounded-lg bg-gray-50 pl-10 pr-4 py-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Right Icons & User */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-auto rounded-full p-2 flex items-center gap-2 hover:bg-gray-100 focus:ring-2 focus:ring-primary"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Anthony" />
                <AvatarFallback>HB</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-semibold text-gray-800">Anthony</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Anthony</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Anthony@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
