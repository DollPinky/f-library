import './globals.css';
import Navigation from '../components/ui/Navigation';

export const metadata = {
  title: 'Sage-Librarian - Hệ thống Quản lý Thư viện',
  description: 'Hệ thống quản lý thư viện hiện đại với giao diện Sage-Librarian chuyên nghiệp',
  keywords: 'thư viện, quản lý sách, mượn trả, hệ thống thư viện',
  authors: [{ name: 'Sage-Librarian Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#6b7280" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sage-Librarian" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-full bg-sage-50 dark:bg-neutral-950 font-sans antialiased safe-area-top safe-area-bottom">
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 