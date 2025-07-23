'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ActionButton from '../../components/ui/ActionButton';
import RealTimeSearch from '../../components/ui/RealTimeSearch';
import { useBooksApi } from '../../hooks/useBooksApi';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { searchBooks } = useBooksApi();
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await searchBooks({
        search: searchTerm,
        page: 0,
        size: 5 // Limit to 5 results for dropdown
      });
      
      if (response.success) {
        setSearchResults(response.data.content || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Tìm kiếm thông minh',
      description: 'Tìm kiếm sách nhanh chóng với bộ lọc thông minh và gợi ý tìm kiếm'
    },
    {
      icon: BookOpenIcon,
      title: 'Quản lý sách hiệu quả',
      description: 'Hệ thống quản lý sách hiện đại với QR code và theo dõi trạng thái real-time'
    },
    {
      icon: ChartBarIcon,
      title: 'Thống kê chi tiết',
      description: 'Báo cáo và thống kê chi tiết về hoạt động thư viện và xu hướng mượn sách'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bảo mật cao',
      description: 'Hệ thống bảo mật đa lớp với xác thực JWT và phân quyền chi tiết'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Sách trong kho', icon: BookOpenIcon },
    { number: '10,000+', label: 'Độc giả đăng ký', icon: AcademicCapIcon },
    { number: '3', label: 'Chi nhánh thư viện', icon: MapPinIcon },
    { number: '99.9%', label: 'Thời gian hoạt động', icon: ClockIcon }
  ];

  const benefits = [
    'Giao diện hiện đại và dễ sử dụng',
    'Tìm kiếm sách nhanh chóng',
    'Quản lý mượn trả tự động',
    'Báo cáo thống kê chi tiết',
    'Hỗ trợ đa thiết bị',
    'Bảo mật thông tin cao'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 to-sage-100 dark:from-neutral-950 dark:to-sage-950/30"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6 leading-tight">
              Sage-Librarian
              <span className="block text-sage-600 dark:text-sage-400 text-2xl md:text-3xl lg:text-4xl mt-4 font-normal">
                Hệ thống Quản lý Thư viện Hiện đại
              </span>
            </h1>
            <p className="text-lg md:text-xl text-sage-600 dark:text-sage-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Khám phá kho tàng tri thức với hệ thống quản lý thư viện tiên tiến, 
              được thiết kế để mang lại trải nghiệm tốt nhất cho độc giả và quản lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/books">
                <ActionButton variant="primary" size="lg" className="group">
                  <span>Khám phá sách</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </ActionButton>
              </Link>
              <Link href="/login">
                <ActionButton variant="outline" size="lg">
                  Đăng nhập ngay
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-4">
              Tìm kiếm sách nhanh chóng
            </h2>
            <p className="text-lg text-sage-600 dark:text-sage-400">
              Khám phá kho tàng tri thức với tìm kiếm thông minh real-time
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <RealTimeSearch
              onSearch={handleSearch}
              searchResults={searchResults}
              loading={searchLoading}
              placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
              className="w-full"
            />
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-sage-500 dark:text-sage-400">
              Gõ ít nhất 2 ký tự để bắt đầu tìm kiếm • Sử dụng ↑↓ để di chuyển • Enter để chọn
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sage-600 dark:text-sage-400 group-hover:bg-sage-200 dark:group-hover:bg-sage-700 transition-all duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-2">
                  {stat.number}
                </div>
                <div className="text-sage-600 dark:text-sage-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-sage-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6">
              Tính năng nổi bật
            </h2>
            <p className="text-lg md:text-xl text-sage-600 dark:text-sage-400 max-w-3xl mx-auto leading-relaxed">
              Hệ thống được trang bị những công nghệ tiên tiến nhất để phục vụ nhu cầu đọc sách và quản lý thư viện
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft p-6 text-center hover:shadow-medium hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sage-600 dark:text-sage-400 group-hover:bg-sage-200 dark:group-hover:bg-sage-700 transition-all duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sage-600 dark:text-sage-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6">
              Tại sao chọn Sage-Librarian?
            </h2>
            <p className="text-lg text-sage-600 dark:text-sage-400">
              Những lợi ích vượt trội mà hệ thống mang lại
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-sage-700 dark:text-sage-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-900/50 dark:to-sage-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-lg md:text-xl text-sage-600 dark:text-sage-400 mb-8 max-w-2xl mx-auto">
            Tham gia ngay để trải nghiệm hệ thống thư viện hiện đại và tiện lợi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <ActionButton variant="primary" size="lg" className="group">
                <span>Tạo tài khoản miễn phí</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </ActionButton>
            </Link>
            <Link href="/login">
              <ActionButton variant="outline" size="lg">
                Đăng nhập ngay
              </ActionButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-sage-200 dark:border-sage-700 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center mr-3 shadow-soft">
                  <BookOpenIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-serif font-bold text-sage-900 dark:text-sage-100">
                  Sage-Librarian
                </span>
              </div>
              <p className="text-sage-600 dark:text-sage-400 mb-4 leading-relaxed">
                Hệ thống quản lý thư viện hiện đại, được thiết kế để mang lại trải nghiệm tốt nhất 
                cho độc giả và quản lý thư viện với giao diện Sage-Librarian chuyên nghiệp.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                Liên kết
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/books" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    Khám phá sách
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    Đăng ký
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-semibold text-sage-900 dark:text-sage-100 mb-4">
                Hỗ trợ
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    Hướng dẫn sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    Liên hệ hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sage-600 dark:text-sage-400 hover:text-sage-500 dark:hover:text-sage-300 transition-colors duration-200">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sage-200 dark:border-sage-700 mt-8 pt-8 text-center">
            <p className="text-sage-600 dark:text-sage-400">
              © 2024 Sage-Librarian. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 