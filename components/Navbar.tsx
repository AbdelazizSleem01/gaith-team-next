"use client";

import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaSearch, FaMoon, FaSun, FaBars, FaTimes, FaPlayCircle, FaClock, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

interface QuizData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  grade: string;
  category: string;
  time: number;
  questions?: unknown[];
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    setIsSearchModalOpen(true);
  };

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGrade && selectedGrade !== 'all') params.append('grade', selectedGrade);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`/api/quizzes?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedGrade, selectedCategory]);

  useEffect(() => {
    if (isSearchModalOpen) {
      performSearch();
    }
  }, [searchTerm, selectedGrade, selectedCategory, isSearchModalOpen, performSearch]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500  ${
          isScrolled
            ? "py-3 backdrop-blur-xl shadow-2xl border-b"
            : "py-4 backdrop-blur-md shadow-lg"
        } ${
          theme === "dark"
            ? "bg-linear-to-r from-indigo-600/95 via-purple-600/95 to-pink-600/95 border-white/20 shadow-indigo-900/30"
            : "bg-linear-to-r from-indigo-500/95 via-purple-500/95 to-pink-500/95 border-white/30 shadow-indigo-500/20"
        }`}
      >
        <div className="mx-auto px-8 ">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-pink-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-1.5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-linear-to-br from-indigo-500/20 to-indigo-500/20">
                    <Image
                      src="/logo.webp"
                      alt="GAITH TEAM Logo"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-r from-green-400 to-cyan-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-white via-indigo-100 to-pink-100 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-pink-300 group-hover:to-yellow-300 transition-all duration-300">
                  GAITH TEAM
                </span>
                <span className="text-xs text-white/70 font-medium tracking-wider">
                  الامتحان في جيبك
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3">
                {/* Quizzes Link */}
                <Link
                  href="/quizzes"
                  className="relative px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white font-medium"
                >
                  جميع الاختبارات
                </Link>

                {/* Search Button */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <button
                    className="relative w-12 h-12 bg-linear-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-110 group-hover:rotate-12"
                    onClick={handleSearch}
                    aria-label="البحث"
                  >
                    <FaSearch className="text-white text-lg" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>
                  </button>
                </div>

                {/* Theme Toggle - Enhanced */}
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300 ${
                    theme === "dark" 
                      ? "bg-linear-to-r from-yellow-400 to-orange-500" 
                      : "bg-linear-to-r from-indigo-500 to-purple-600"
                  }`}></div>
                  <button
                    className="relative w-12 h-12 bg-linear-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:rotate-12 overflow-hidden"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع المظلم"}
                  >
                    <div className="relative z-10">
                      {theme === "dark" ? (
                        <FaSun className="text-yellow-300 text-lg animate-pulse" />
                      ) : (
                        <FaMoon className="text-indigo-200 text-lg" />
                      )}
                    </div>
                    <div className={`absolute inset-0 transition-transform duration-500 ${
                      theme === "dark" ? "translate-y-0" : "translate-y-full"
                    } bg-linear-to-br from-yellow-400/20 to-orange-500/20`}></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-r from-green-400 to-cyan-400 rounded-full border border-white"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-12 h-12 bg-linear-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              {isMenuOpen ? (
                <FaTimes className="text-white text-xl" />
              ) : (
                <FaBars className="text-white text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-t border-white/20 shadow-2xl transition-all duration-500 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"
          } ${
            theme === "dark"
              ? "bg-linear-to-b from-indigo-700/95 to-purple-700/95"
              : "bg-linear-to-b from-indigo-500/95 to-purple-500/95"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  className="w-12 h-12 bg-linear-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-110"
                  onClick={handleSearch}
                  aria-label="البحث"
                >
                  <FaSearch className="text-white text-lg" />
                </button>

                <button
                  className="w-12 h-12 bg-linear-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  onClick={toggleTheme}
                  aria-label="تبديل الثيم"
                >
                  {theme === "dark" ? (
                    <FaSun className="text-yellow-300 text-lg" />
                  ) : (
                    <FaMoon className="text-indigo-200 text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20 md:h-24"></div>

      {/* Floating Elements */}
      <div className="fixed top-24 left-4 z-40 hidden lg:block">
        <div className="relative">
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-cyan-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
          <div className="relative w-4 h-4 bg-linear-to-r from-indigo-400 to-cyan-400 rounded-full animate-bounce"></div>
        </div>
      </div>

      <div className="fixed top-32 right-4 z-40 hidden lg:block">
        <div className="relative">
          <div
            className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-pink-600 rounded-full blur-lg opacity-50 animate-pulse"
            style={{ animationDelay: "0.25s" }}
          ></div>
          <div
            className="relative w-3 h-3 bg-linear-to-r from-indigo-400 to-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
          theme === "dark"
            ? "bg-black/70 backdrop-blur-md"
            : "bg-black/50 backdrop-blur-sm"
        }`}>
          <div className={`rounded-3xl shadow-2xl max-w-4xl w-full h-[80vh] overflow-hidden ${
            theme === "dark"
              ? "bg-gray-900 border border-gray-700"
              : "bg-white"
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b bg-linear-to-r from-indigo-500 to-purple-600 text-white ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <FaSearch className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">البحث في الاختبارات</h2>
                    <p className="text-indigo-100 text-sm">ابحث وفلتر الاختبارات بسهولة</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setSearchTerm('');
                    setSelectedGrade('');
                    setSelectedCategory('');
                    setSearchResults([]);
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300"
                  aria-label="إغلاق نافذة البحث"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`p-6 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث في العناوين أو الوصف أو المواد..."
                    className={`w-full px-12 py-4 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-right ${
                      theme === "dark"
                        ? "border-gray-600 text-white placeholder-gray-200"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Grade Filter */}
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className={`px-4 py-4 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                  aria-label="فلترة حسب الفرقة"
                >
                  <option value="">جميع الفرق</option>
                  <option value="الفرقة الأولى">الفرقة الأولى</option>
                  <option value="الفرقة الثانية">الفرقة الثانية</option>
                  <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                  <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                </select>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-4 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                  aria-label="فلترة حسب المادة"
                >
                  <option value="">جميع المواد</option>
                  <option value="تمريض إدارة">تمريض إدارة</option>
                  <option value="تمريض نفسية">تمريض نفسية</option>
                  <option value="تمريض جراحي">تمريض جراحي</option>
                  <option value="تمريض طوارئ">تمريض طوارئ</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="p-6 space-y-4 text-center mx-auto">
                  <div className="mx-auto animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  <span className={`ml-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>جاري البحث...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <FaSearch className={`text-6xl mx-auto mb-4 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-300"
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {searchTerm || selectedGrade || selectedCategory ? 'لا توجد نتائج' : 'ابدأ البحث'}
                  </h3>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                    {searchTerm || selectedGrade || selectedCategory
                      ? 'جرب كلمات بحث مختلفة أو غير الفلاتر'
                      : 'اكتب كلمة بحث أو اختر فلتر للبدء'
                    }
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className={`text-sm mb-4 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    تم العثور على {searchResults.length} اختبار
                  </div>
                  {searchResults.map((quiz: QuizData) => (
                    <div key={quiz.id} className={`rounded-xl p-4 transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}>{quiz.title}</h3>
                          {quiz.description && (
                            <p className={`text-sm mb-3 ${
                              theme === "dark" ? "text-gray-300" : "text-gray-600"
                            }`}>{quiz.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                              {quiz.grade}
                            </span>
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                              {quiz.category}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              <FaClock className="text-xs" />
                              {quiz.time} دقيقة
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              <FaQuestionCircle className="text-xs" />
                              {quiz.questions?.length || 0} أسئلة
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/quiz/${quiz.slug}`}
                          className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                        >
                          <FaPlayCircle />
                          ابدأ الاختبار
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        body.light nav {
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #8b5cf6 50%,
            #ec4899 100%
          ) !important;
        }

        body.light .bg-linear-to-r.from-indigo-600.via-indigo-600.to-pink-600 {
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #8b5cf6 50%,
            #ec4899 100%
          ) !important;
        }
      `}</style>
    </>
  );
}
