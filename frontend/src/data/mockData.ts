import type { Book, NavItem, RecordEntry } from "@/types";
import {
  BarChart,
  BookIcon,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
    current: true,
  },
  {
    id: "reader-management",
    label: "Reader Management",
    icon: User,
    href: "#",
    current: true,
  },
  {
    id: "book-management",
    label: "Book Management",
    icon: BookIcon,
    href: "#",
    current: true,
  },
  { id: "reports", label: "Reports", icon: BarChart, href: "#", current: true },
];

export const settingsNavItem: NavItem = {
  id: "settings",
  label: "Settings",
  icon: Settings,
  href: "#",
  current: false,
};

export const books: Book[] = [
  {
    id: "book1",
    title: "The old you",
    author: "Luise Voss",
    price: 20,
    coverUrl: "",
  },
  {
    id: "book2",
    title: "City on the edge",
    author: "Mark Goldman",
    price: 20,
    coverUrl: "",
  },
  {
    id: "book3",
    title: "Be a kind mosquito",
    author: "Sofia Pavon",
    price: 20,
    coverUrl: "",
  },
  {
    id: "book4",
    title: "The formation of ...",
    author: "Charles Darwin",
    price: 20,
    coverUrl: "",
  },
  {
    id: "book5",
    title: "The martian",
    author: "Andy Weir",
    price: 20,
    coverUrl: "",
  },
  {
    id: "book6",
    title: "The design hustle",
    author: "Jaqueline Sing",
    price: 20,
    coverUrl: "",
  },
];

export const records: RecordEntry[] = [
  {
    bookId: "122132",
    readerName: "Grayson Prince",
    readerId: "#B-12312",
    bookName: "Green thumb poppy",
    author: "Etelle Darcy",
    duration: "1 Month",
    status: "Subscribed",
    fee: 400,
    readerAvatarUrl: "",
  },
  {
    bookId: "122132",
    readerName: "Jada White",
    readerId: "#B-12312",
    bookName: "Green thumb poppy",
    author: "Etelle Darcy",
    duration: "1 Month",
    status: "Unsubscribed",
    fee: 500,
    readerAvatarUrl: "",
  },
];
