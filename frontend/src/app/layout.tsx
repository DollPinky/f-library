import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý Thư Viện Đại Học",
  description: "Giải pháp quản lý thư viện hiện đại cho trường đại học đa phân hiệu",
  keywords: "thư viện, quản lý, đại học, sách, mượn trả",
  authors: [{ name: "Library Management Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="no-scroll">
      <body className={`${inter.className} no-scroll`}>
        <div className="h-screen flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 main-content overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
