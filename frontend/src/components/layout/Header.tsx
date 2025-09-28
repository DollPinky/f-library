import { Bell, BookOpenIcon, ChevronDown, Search } from "lucide-react";
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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <BookOpenIcon color="red" />
          <h2 className="text-2xl font-bold tracking-tight">Book Library</h2>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search your book..."
            className="md:w-[200px] lg:w-[300px]"
          />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@user" />
                  <AvatarFallback size={15}>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Anthony Nguyen
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Admin
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Header;
