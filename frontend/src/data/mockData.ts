import type { NavItem } from "@/types";
import type { BorrowedBook, DonatedBook } from "@/types/Book";
import type { UserProfile } from "@/types/User";
import {
  BarChart,
  BookIcon,
  BookOpen,
  Heart,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from "lucide-react";

// Admin navigation items
export const adminNavItems: NavItem[] = [
  {
    id: "admin-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    current: true,
  },
  {
    id: "book-management",
    label: "Book Management",
    icon: BookIcon,
    href: "/admin/book-management",
    current: true,
  },
  {
    id: "user-management",
    label: "User Management",
    icon: User,
    href: "/admin/user-management",
    current: true,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart,
    href: "/admin/reports",
    current: true,
  },
  {
    id: "my-profile",
    label: "My Profile",
    icon: User,
    href: "/admin/profile",
    current: true,
  },
];

// User navigation items
export const userNavItems: NavItem[] = [
  {
    id: "user-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/user",
    current: true,
  },
  {
    id: "borrow-books",
    label: "Borrow Books",
    icon: BookIcon,
    href: "/user/borrow-books",
    current: true,
  },
  {
    id: "return-books",
    label: "Return Books",
    icon: BarChart,
    href: "/user/return-books",
    current: true,
  },
  {
    id: "donate-book",
    label: "Book Donation",
    icon: User,
    href: "/user/donate-book",
    current: true,
  },
  {
    id: "my-profile",
    label: "My Profile",
    icon: User,
    href: "/user/profile",
    current: true,
  },
];

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    current: true,
  },
  {
    id: "user-management",
    label: "User Management",
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

// export const mockBooks: Book[] = [
//   {
//     id: "1",
//     name: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     category as string: "Classic Literature",
//     isbn: "978-0-7432-7356-5",
//     status: "Available",
//     totalCopies: 5,
//     availableCopies: 3,
//     publishedDate: "1925-04-10",
//     description: "A classic American novel set in the Jazz Age.",
//     coverImage:
//       "https://images.unsplash.com/photo-1615416300468-51050fcb7a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVhdCUyMGdhdHNieSUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTk0NzY4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "2",
//     name: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     category: "Classic Literature",
//     isbn: "978-0-06-112008-4",
//     status: "Borrowed",
//     totalCopies: 4,
//     availableCopies: 0,
//     publishedDate: "1960-07-11",
//     description: "A gripping tale of racial injustice and childhood innocence.",
//     coverImage:
//       "https://images.unsplash.com/photo-1579965342575-16428a7c8881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NraW5nYmlyZCUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTk0NzY4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "3",
//     name: "1984",
//     author: "George Orwell",
//     category: "Science Fiction",
//     isbn: "978-0-452-28423-4",
//     status: "Available",
//     totalCopies: 6,
//     availableCopies: 4,
//     publishedDate: "1949-06-08",
//     description: "A dystopian social science fiction novel.",
//     coverImage:
//       "https://images.unsplash.com/photo-1752848725112-dd887873700c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwxOTg0JTIwb3J3ZWxsJTIwYm9va3xlbnwxfHx8fDE3NTk0NzY4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "4",
//     name: "Pride and Prejudice",
//     author: "Jane Austen",
//     category: "Romance",
//     isbn: "978-0-14-143951-8",
//     status: "Maintenance",
//     totalCopies: 3,
//     availableCopies: 0,
//     publishedDate: "1813-01-28",
//     description: "A romantic novel of manners.",
//     coverImage:
//       "https://images.unsplash.com/photo-1603162610423-af7febeca563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlkZSUyMHByZWp1ZGljZSUyMGJvb2t8ZW58MXx8fHwxNzU5NDc2ODM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "5",
//     name: "The Catcher in the Rye",
//     author: "J.D. Salinger",
//     category: "Classic Literature",
//     isbn: "978-0-316-76948-0",
//     status: "Available",
//     totalCopies: 4,
//     availableCopies: 2,
//     publishedDate: "1951-07-16",
//     description: "A story about teenage rebellion and angst.",
//     coverImage:
//       "https://images.unsplash.com/photo-1565951556573-1beb896beb26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRjaGVyJTIwcnllJTIwYm9va3xlbnwxfHx8fDE3NTk0NzY4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "6",
//     name: "The Design Hustle",
//     author: "Jaqueline Sing",
//     category: "Business",
//     isbn: "978-0-123-45678-9",
//     status: "Available",
//     totalCopies: 8,
//     availableCopies: 6,
//     publishedDate: "2023-03-15",
//     description: "A comprehensive guide to modern design entrepreneurship.",
//     coverImage:
//       "https://images.unsplash.com/photo-1711185892188-13f35959d3ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc1OTM4NTI4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "7",
//     name: "The Martian",
//     author: "Andy Weir",
//     category: "Science Fiction",
//     isbn: "978-0-345-50877-3",
//     status: "Available",
//     totalCopies: 7,
//     availableCopies: 5,
//     publishedDate: "2014-02-11",
//     description: "A gripping tale of survival on Mars.",
//     coverImage:
//       "https://images.unsplash.com/photo-1604435062356-a880b007922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc1OTQxMzA2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "8",
//     name: "Be a Kind Mosquito",
//     author: "Sofia Pavon",
//     category: "Children",
//     isbn: "978-0-987-65432-1",
//     status: "Available",
//     totalCopies: 5,
//     availableCopies: 4,
//     publishedDate: "2022-09-20",
//     description: "A charming children's story about kindness and friendship.",
//     coverImage:
//       "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9ncmFwaHklMjBib29rJTIwY292ZXJ8ZW58MXx8fHwxNzU5NDc3NTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "9",
//     name: "City on the Edge",
//     author: "Mark Goldman",
//     category: "Thriller",
//     isbn: "978-0-456-78901-2",
//     status: "Available",
//     totalCopies: 6,
//     availableCopies: 3,
//     publishedDate: "2023-01-10",
//     description: "A thrilling urban adventure set in a dystopian future.",
//     coverImage:
//       "https://images.unsplash.com/photo-1615416300468-51050fcb7a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVhdCUyMGdhdHNieSUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTk0NzY4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
//   },
//   {
//     id: "10",
//     name: "The Formation of Everything",
//     author: "Charles Darwin",
//     category: "Science",
//     isbn: "978-0-789-01234-5",
//     status: "Available",
//     totalCopies: 4,
//     availableCopies: 2,
//     publishedDate: "2020-06-05",
//     description: "An exploration of the natural world and evolution.",
//     coverImage:
//       "https://images.unsplash.com/photo-1565951556573-1beb896beb26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRjaGVyJTIwcnllJTIwYm9va3xlbnwxfHx8fDE3NTk0NzY4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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

export const bookCategories = [
  "All Categories",
  "Classic Literature",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Biography",
  "History",
  "Technology",
  "Business",
  "Health",
  "Children",
  "Thriller",
  "Science",
];
export const borrowedBooks: BorrowedBook[] = [
  {
    id: "1",
    bookName: "Clean Code: A Handbook of Agile Software Craftsmanship",
    borrowDate: "15/03/2024",
    returnDate: "15/04/2024",
  },
  {
    id: "2",
    bookName: "The Pragmatic Programmer",
    borrowDate: "01/03/2024",
    returnDate: "01/04/2024",
  },
  {
    id: "3",
    bookName: "Design Patterns: Elements of Reusable Object-Oriented Software",
    borrowDate: "20/02/2024",
    returnDate: "20/03/2024",
  },
];

export const donatedBooks: DonatedBook[] = [
  {
    id: "1",
    bookName: "Introduction to Algorithms",
    donationDate: "10/01/2024",
    campus: "Hà Nội",
    points: 50,
  },
  {
    id: "2",
    bookName: "Head First Design Patterns",
    donationDate: "05/01/2024",
    campus: "Đà Nẵng",
    points: 30,
  },
  {
    id: "3",
    bookName: "You Don't Know JS",
    donationDate: "28/12/2023",
    campus: "Hồ Chí Minh",
    points: 40,
  },
];

export const profileData: UserProfile = {
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  fullName: "Nguyễn Văn An",
  email: "nguyen.van.an@company.com",
  phone: "+84 912 345 678",
  department: "Technology",
  position: "Senior Software Engineer",
};

export const donationStats = [
  {
    icon: BookOpen,
    label: "Books Donated",
    value: "2,847",
    description: "Total books received",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Users,
    label: "Active Donors",
    value: "456",
    description: "Community contributors",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Heart,
    label: "Impact Score",
    value: "9.2/10",
    description: "Community satisfaction",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
];

export const donationGuidelines = [
  "Books should be in readable condition",
  "Academic and educational books are highly appreciated",
  "Fiction and non-fiction books are both welcome",
  "Books should be complete (no missing pages)",
  "Multiple copies of popular books are accepted",
  "Books in multiple languages are welcome",
];

export const campusCodes = [
  { code: "HN001", name: "Hanoi Main Campus" },
  { code: "HCM001", name: "Ho Chi Minh Campus" },
  { code: "DN001", name: "Da Nang Campus" },
  { code: "CT001", name: "Can Tho Campus" },
];
