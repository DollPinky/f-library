import type { Book, NavItem } from "@/types";
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
    href: "/book_management",
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
    title: "Into the Horizon",
    author: "Elena Carter",
    price: 18,
    coverUrl:
      "https://m.media-amazon.com/images/I/610ZsxXdcHL._UF1000,1000_QL80_.jpg",
    readerName: "Liam Anderson",
    readerId: "#R-10001",
    status: "Subscribed",
    duration: "2 Weeks",
    fee: 200,
  },
  {
    id: "book2",
    title: "Shadows of Time",
    author: "Daniel Reed",
    price: 22,
    coverUrl:
      "https://m.media-amazon.com/images/I/71POn+3oLNL._UF1000,1000_QL80_.jpg",
    readerName: "Olivia Bennett",
    readerId: "#R-10002",
    status: "Unsubscribed",
    duration: "1 Month",
    fee: 300,
  },
  {
    id: "book3",
    title: "Whispers in the Forest",
    author: "Sofia Martinez",
    price: 19,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1636584566i/59588594.jpg",
    readerName: "Noah Walker",
    readerId: "#R-10003",
    status: "Subscribed",
    duration: "3 Weeks",
    fee: 250,
  },
  {
    id: "book4",
    title: "The Infinite Mind",
    author: "Charles Donovan",
    price: 25,
    coverUrl:
      "https://m.media-amazon.com/images/I/61IRfSrYfdL._UF1000,1000_QL80_.jpg",
    readerName: "Sophia Turner",
    readerId: "#R-10004",
    status: "Subscribed",
    duration: "1 Month",
    fee: 400,
  },
  {
    id: "book5",
    title: "Beyond the Stars",
    author: "Andy Weir",
    price: 24,
    coverUrl:
      "https://m.media-amazon.com/images/I/81APzigRxwL._UF1000,1000_QL80_.jpg",
    readerName: "Ethan Johnson",
    readerId: "#R-10005",
    status: "Unsubscribed",
    duration: "2 Weeks",
    fee: 180,
  },
  {
    id: "book6",
    title: "Designing Tomorrow",
    author: "Jacqueline Singh",
    price: 21,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1693800347i/198498380.jpg",
    readerName: "Mia Clark",
    readerId: "#R-10006",
    status: "Subscribed",
    duration: "1 Month",
    fee: 350,
  },
  {
    id: "book7",
    title: "The Silent Voyage",
    author: "Marcus Hale",
    price: 20,
    coverUrl:
      "https://m.media-amazon.com/images/I/51K4xeDTJaL._UF1000,1000_QL80_.jpg",
    readerName: "Charlotte Green",
    readerId: "#R-10007",
    status: "Subscribed",
    duration: "2 Weeks",
    fee: 220,
  },
  {
    id: "book8",
    title: "Echoes of the Past",
    author: "Linda Hayes",
    price: 23,
    coverUrl:
      "https://m.media-amazon.com/images/I/71NpF8Vw7tL._UF1000,1000_QL80_.jpg",
    readerName: "James Scott",
    readerId: "#R-10008",
    status: "Unsubscribed",
    duration: "1 Month",
    fee: 300,
  },
  {
    id: "book9",
    title: "Winds of Freedom",
    author: "Harper Collins",
    price: 26,
    coverUrl:
      "https://m.media-amazon.com/images/I/51HH6DAGYNL._UF1000,1000_QL80_.jpg",
    readerName: "Amelia Brooks",
    readerId: "#R-10009",
    status: "Subscribed",
    duration: "3 Weeks",
    fee: 270,
  },
  {
    id: "book10",
    title: "Rise of the Dawn",
    author: "Victor Kane",
    price: 28,
    coverUrl:
      "https://m.media-amazon.com/images/I/81s9LSFZ8uL._UF1000,1000_QL80_.jpg",
    readerName: "Henry Adams",
    readerId: "#R-10010",
    status: "Unsubscribed",
    duration: "1 Month",
    fee: 320,
  },
];
// export const records: RecordEntry[] = [
//   {
//     bookId: "122131",
//     readerName: "Grayson Prince",
//     readerId: "#B-12312",
//     bookName: "Green thumb poppy",
//     author: "Etelle Darcy",
//     duration: "1 Month",
//     status: "Subscribed",
//     fee: 400,
//     readerAvatarUrl: "",
//     bookImg:
//       "https://cdn.storymirror.com/cover/original/f146a2af99026c00463922133f1c9afa7fca11d3.png",
//   },
//   {
//     bookId: "122132",
//     readerName: "Jada White",
//     readerId: "#B-12312",
//     bookName: "Green thumb poppy",
//     author: "Etelle Darcy",
//     duration: "1 Month",
//     status: "Unsubscribed",
//     fee: 500,
//     readerAvatarUrl: "",
//     bookImg:
//       "https://cdn.storymirror.com/cover/original/f146a2af99026c00463922133f1c9afa7fca11d3.png",
//   },
// ];

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
