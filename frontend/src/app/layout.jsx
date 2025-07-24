'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import Navigation from '../components/ui/Navigation';
import { AccountAuthProvider } from '../contexts/AccountAuthContext';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
        <title>Sage-Librarian - Hệ thống Quản lý Thư viện</title>
        <meta name="description" content="Hệ thống quản lý thư viện hiện đại với giao diện Sage-Librarian chuyên nghiệp" />
        <meta name="keywords" content="thư viện, quản lý sách, mượn trả, hệ thống thư viện" />
        <meta name="author" content="Sage-Librarian Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="h-full bg-sage-50 dark:bg-neutral-950 font-sans antialiased safe-area-top safe-area-bottom">
        <AccountAuthProvider>
          <Navigation 
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
          <main className="flex-1 w-full lg:pl-72">
            {children}
          </main>
        </AccountAuthProvider>
      </body>
    </html>
  );
} 