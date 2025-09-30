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
    href: "/",
    current: true,
  },
  {
    id: "reader-management",
    label: "Reader Management",
    icon: User,
    href: "/",
    current: true,
  },
  {
    id: "book-management",
    label: "Book Management",
    icon: BookIcon,
    href: "/book-management",
    current: true,
  },
  { id: "reports", label: "Reports", icon: BarChart, href: "/", current: true },
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
    coverUrl:
      "https://m.media-amazon.com/images/I/7131kTsiapL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "book2",
    title: "City on the edge",
    author: "Mark Goldman",
    price: 20,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388684409i/75355.jpg",
  },
  {
    id: "book3",
    title: "Be a kind mosquito",
    author: "Sofia Pavon",
    price: 20,
    coverUrl:
      "https://m.media-amazon.com/images/I/61FlLZnUPaL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "book4",
    title: "The formation of ...",
    author: "Charles Darwin",
    price: 20,
    coverUrl:
      "https://m.media-amazon.com/images/I/41LF3LCYqqL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "book5",
    title: "The martian",
    author: "Andy Weir",
    price: 20,
    coverUrl:
      "https://img1.od-cdn.com/ImageType-400/0111-1/82E/F8E/C3/%7B82EF8EC3-386B-4561-8F65-2D59433B9358%7DImg400.jpg",
  },
  {
    id: "book6",
    title: "The design hustle",
    author: "Jaqueline Sing",
    price: 20,
    coverUrl:
      "https://m.media-amazon.com/images/I/71WyOmr92pL._UF1000,1000_QL80_.jpg",
  },
];

export const records: RecordEntry[] = [
  {
    bookId: "122131",
    readerName: "Grayson Prince",
    readerId: "#B-12312",
    bookName: "Green thumb poppy",
    author: "Etelle Darcy",
    duration: "1 Month",
    status: "Subscribed",
    fee: 400,
    readerAvatarUrl: "",
    bookImg:
      "https://cdn.storymirror.com/cover/original/f146a2af99026c00463922133f1c9afa7fca11d3.png",
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
    bookImg:
      "https://cdn.storymirror.com/cover/original/f146a2af99026c00463922133f1c9afa7fca11d3.png",
  },
];

export const visitChartLabels = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];
export const visitChartData = {
  labels: visitChartLabels,
  datasets: [
    {
      label: "Visit",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Read",
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};
