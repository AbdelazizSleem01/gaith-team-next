"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaClock,
  FaQuestionCircle,
  FaPlayCircle,
  FaBookOpen,
  FaFilter,
  FaGraduationCap,
  FaCalendarAlt,
  FaTimes,
  FaFireAlt,
} from "react-icons/fa";
import { MdOutlineCategory, MdQuiz } from "react-icons/md";
import { TbSortDescending } from "react-icons/tb";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  id: string;
  slug: string;
  title: string;
  description?: string;
  grade: string;
  category: string;
  time: number;
  questions: Question[];
  created: string;
  difficulty?: "سهل" | "متوسط" | "صعب";
  popularity?: number;
}

export default function QuizzesPage() {
  const { theme } = useTheme();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterAndSortQuizzes();
  }, [quizzes, searchTerm, selectedGrade, selectedCategory, sortOrder]);

  const loadQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);
      }
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuizzes = () => {
    let filtered = [...quizzes];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by grade
    if (selectedGrade && selectedGrade !== "all") {
      filtered = filtered.filter((quiz) => quiz.grade === selectedGrade);
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((quiz) => quiz.category === selectedCategory);
    }

    // Sort quizzes by date
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      } else {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      }
    });

    setFilteredQuizzes(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGrade("");
    setSelectedCategory("");
    setSortOrder("newest");
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "سهل":
        return theme === "dark"
          ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          : "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "متوسط":
        return theme === "dark"
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "صعب":
        return theme === "dark"
          ? "bg-red-900/30 text-red-300 border-red-700"
          : "bg-red-100 text-red-700 border-red-300";
      default:
        return theme === "dark"
          ? "bg-gray-800 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <>
        <div
          className={`min-h-screen flex flex-col items-center justify-center ${
            theme === "dark"
              ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
              : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"
          }`}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-indigo-500 border-r-indigo-300 mx-auto mb-6"></div>
            <MdQuiz className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500 text-3xl animate-pulse" />
          </div>
          <h2
            className={`text-2xl font-bold mt-6 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            جاري تحميل الاختبارات
          </h2>
          <p
            className={`mt-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            يرجى الانتظار قليلاً...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-linear-to-b from-gray-900 via-gray-800 to-gray-900"
            : "bg-linear-to-b from-blue-50 via-white to-indigo-50"
        } py-8`}
      >
        <div className=" mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div
                className={`p-3 rounded-full ${
                  theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-100"
                }`}
              >
                <MdQuiz className="text-3xl text-indigo-500" />
              </div>
            </div>
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 mt-18 *:${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                بنك الاختبارات التمريضية
              </span>
            </h1>
            <p
              className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              طور مهاراتك واختبر معرفتك في مختلف تخصصات التمريض
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaQuestionCircle />{" "}
                {quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}{" "}
                سؤال
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaBookOpen /> {quizzes.length} اختبار
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaGraduationCap /> 4 فرق
              </span>
            </div>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-10">
            <div
              className={`rounded-3xl shadow-2xl p-6 border-2 backdrop-blur-sm transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/80 border-gray-200/80"
              }`}
            >
              {/* Search Bar */}
              <div className="relative mb-8 group">
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <FaSearch
                    className={`text-xl transition-colors ${
                      theme === "dark"
                        ? "text-gray-400 group-focus-within:text-indigo-400"
                        : "text-gray-500 group-focus-within:text-indigo-500"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-right text-lg ${
                    theme === "dark"
                      ? "bg-gray-900/70 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  }`}
                  placeholder="ابحث عن اختبارات، مواد، أو مواضيع..."
                />
                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm("")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  >
                    <FaTimes
                      className={`text-gray-500 hover:text-gray-700 ${
                        theme === "dark" ? "hover:text-gray-300" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Filters Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Mobile Filters Toggle - Top */}
                <div className="block sm:hidden w-full">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-full px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg font-medium ${
                      theme === "dark"
                        ? "bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50"
                        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300"
                    }`}
                  >
                    <FaFilter
                      className={
                        showFilters
                          ? "rotate-180 transition-transform duration-300"
                          : ""
                      }
                    />
                    {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                  </button>
                </div>

                {/* Desktop Filters Toggle - Inline */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <FaFilter
                      className={
                        showFilters
                          ? "rotate-180 transition-transform duration-300"
                          : ""
                      }
                    />
                    {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                  </button>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <TbSortDescending />
                    ترتيب حسب:
                  </span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    title="ترتيب الاختبارات"
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                  </select>
                </div>
              </div>

              {/* Filters Grid */}
              {showFilters && (
                <>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl mb-4"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)"
                          : "linear-gradient(135deg, rgba(239, 246, 255, 0.8) 0%, rgba(224, 231, 255, 0.8) 100%)",
                    }}
                  >
                    {/* Grade Filter */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <FaGraduationCap />
                        الفرقة الدراسية
                      </label>
                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        title="فلترة حسب الفرقة"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 text-right ${
                          theme === "dark"
                            ? "bg-gray-900 border-gray-600 text-white focus:border-indigo-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-indigo-400"
                        }`}
                      >
                        <option value="">جميع الفرق</option>
                        <option value="الفرقة الأولى">الفرقة الأولى</option>
                        <option value="الفرقة الثانية">الفرقة الثانية</option>
                        <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                        <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <label
                        className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <MdOutlineCategory />
                        التخصص / المادة
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          title="فلترة حسب المادة"
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 text-right appearance-none cursor-pointer ${
                            theme === "dark"
                              ? "bg-gray-900 border-gray-600 text-white focus:border-indigo-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-indigo-400"
                          }`}
                        >
                          <option value="">🔍 جميع المواد</option>

                          {/* Basic Sciences */}
                          <optgroup
                            label="📚 مواد أساسية"
                            className={
                              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                            }
                          >
                            <option value="التشريح">التشريح (Anatomy)</option>
                            <option value="وظائف الأعضاء">
                              وظائف الأعضاء (Physiology)
                            </option>
                            <option value="كيمياء حيوية">
                              كيمياء حيوية (Biochemistry)
                            </option>
                            <option value="ميكروبيولوجي">
                              ميكروبيولوجي (Microbiology)
                            </option>
                            <option value="علم السلوك">
                              علم السلوك (Psychology)
                            </option>
                            <option value="علم الاجتماع">
                              علم الاجتماع (Sociology)
                            </option>
                            <option value="لغة إنجليزية">لغة إنجليزية</option>
                            <option value="حاسب آلي">حاسب آلي</option>
                          </optgroup>

                          {/* First Year */}
                          <optgroup
                            label="👩‍⚕️ تمريض - الفرقة الأولى"
                            className={
                              theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                            }
                          >
                            <option value="أساسيات التمريض">
                              أساسيات التمريض (Fundamentals of Nursing)
                            </option>
                            <option value="مبادئ الإسعافات الأولية">
                              مبادئ الإسعافات الأولية
                            </option>
                            <option value="صحة عامة">
                              صحة عامة (Community Health)
                            </option>
                            <option value="تدريب عملي على أساسيات التمريض">
                              تدريب عملي على أساسيات التمريض
                            </option>
                          </optgroup>

                          {/* Second Year - Medical */}
                          <optgroup
                            label="⚕️ طبية - الفرقة الثانية"
                            className={
                              theme === "dark"
                                ? "bg-purple-900/20"
                                : "bg-purple-50"
                            }
                          >
                            <option value="باثولوجي">
                              باثولوجي (Pathology)
                            </option>
                            <option value="فارماكولوجي">
                              فارماكولوجي (Pharmacology)
                            </option>
                            <option value="تغذية علاجية">
                              تغذية علاجية (Nutrition)
                            </option>
                            <option value="باراسيتولوجي">
                              باراسيتولوجي (Parasitology)
                            </option>
                            <option value="طب المجتمع">
                              طب المجتمع (Community Medicine)
                            </option>
                          </optgroup>

                          {/* Second Year - Nursing */}
                          <optgroup
                            label="👨‍⚕️ تمريض - الفرقة الثانية"
                            className={
                              theme === "dark"
                                ? "bg-green-900/20"
                                : "bg-green-50"
                            }
                          >
                            <option value="تمريض باطني وجراحي 1">
                              تمريض باطني وجراحي 1 (Medical & Surgical Nursing
                              I)
                            </option>
                            <option value="تمريض صحة الأم والطفل 1">
                              تمريض صحة الأم والطفل 1 (Maternity & Child Health
                              Nursing I)
                            </option>
                            <option value="تمريض مسنين">
                              تمريض مسنين (Geriatric Nursing)
                            </option>
                            <option value="تمريض الصحة النفسية">
                              تمريض الصحة النفسية (Psychiatric Nursing)
                            </option>
                            <option value="تدريب عملي في المستشفيات">
                              تدريب عملي في المستشفيات
                            </option>
                          </optgroup>

                          {/* Third Year - Medical */}
                          <optgroup
                            label="👶 طبية - الفرقة الثالثة"
                            className={
                              theme === "dark"
                                ? "bg-yellow-900/20"
                                : "bg-yellow-50"
                            }
                          >
                            <option value="أمراض النساء والولادة">
                              أمراض النساء والولادة (Obstetrics & Gynecology)
                            </option>
                            <option value="طب الأطفال">
                              طب الأطفال (Pediatrics)
                            </option>
                          </optgroup>

                          {/* Third Year - Nursing */}
                          <optgroup
                            label="🏥 تمريض - الفرقة الثالثة"
                            className={
                              theme === "dark"
                                ? "bg-orange-900/20"
                                : "bg-orange-50"
                            }
                          >
                            <option value="تمريض باطني وجراحي 2">
                              تمريض باطني وجراحي 2 (Medical & Surgical Nursing
                              II)
                            </option>
                            <option value="تمريض صحة الأم والطفل 2">
                              تمريض صحة الأم والطفل 2 (Maternity & Child Health
                              Nursing II)
                            </option>
                            <option value="تمريض أطفال">
                              تمريض أطفال (Pediatric Nursing)
                            </option>
                            <option value="تمريض الطوارئ والعناية الحرجة">
                              تمريض الطوارئ والعناية الحرجة (Emergency &
                              Critical Care Nursing)
                            </option>
                            <option value="تمريض الصحة المهنية">
                              تمريض الصحة المهنية
                            </option>
                            <option value="تدريب سريري">تدريب سريري</option>
                          </optgroup>

                          {/* Fourth Year */}
                          <optgroup
                            label="🎓 تخصصية - الفرقة الرابعة"
                            className={
                              theme === "dark" ? "bg-red-900/20" : "bg-red-50"
                            }
                          >
                            <option value="تمريض العناية الحرجة والحالات الحرجة">
                              تمريض العناية الحرجة والحالات الحرجة (ICU &
                              Critical Care)
                            </option>
                            <option value="تمريض الحالات الحرجة للأطفال">
                              تمريض الحالات الحرجة للأطفال (Pediatric Critical
                              Care)
                            </option>
                            <option value="إدارة التمريض">
                              إدارة التمريض (Nursing Administration)
                            </option>
                            <option value="تمريض الصحة النفسية المتقدم">
                              تمريض الصحة النفسية المتقدم
                            </option>
                            <option value="تمريض المجتمع">
                              تمريض المجتمع (Community Nursing)
                            </option>
                            <option value="تمريض الأمراض المعدية">
                              تمريض الأمراض المعدية
                            </option>
                            <option value="مشروع تخرج">
                              مشروع تخرج (Research Project)
                            </option>
                            <option value="تدريب امتياز">
                              تدريب امتياز (Internship)
                            </option>
                          </optgroup>

                          {/* Internship Year */}
                          <optgroup
                            label="🌟 سنة الامتياز"
                            className={
                              theme === "dark"
                                ? "bg-indigo-900/20"
                                : "bg-indigo-50"
                            }
                          >
                            <option value="امتياز باطني">امتياز باطني</option>
                            <option value="امتياز جراحة">امتياز جراحة</option>
                            <option value="امتياز أطفال">امتياز أطفال</option>
                            <option value="امتياز نساء وتوليد">
                              امتياز نساء وتوليد
                            </option>
                            <option value="امتياز عناية مركزة">
                              امتياز عناية مركزة
                            </option>
                            <option value="امتياز طوارئ">امتياز طوارئ</option>
                            <option value="امتياز نفسية">امتياز نفسية</option>
                            <option value="امتياز مجتمع">امتياز مجتمع</option>
                          </optgroup>
                        </select>
                        <div
                          className={`absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-between items-center mt-6 pt-6 border-t border-gray-700/50">
                    <div
                      className={`text-sm px-4 py-2 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-900/50 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {filteredQuizzes.length} اختبار متاح
                      {searchTerm && ` للبحث: "${searchTerm}"`}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={clearFilters}
                        className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        <FaTimes />
                        مسح الكل
                      </button>
                      <button
                        onClick={filterAndSortQuizzes}
                        className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <FaFilter />
                        تطبيق الفلاتر
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quizzes Grid */}
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-20">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl mb-8 ${
                  theme === "dark"
                    ? "bg-linear-to-br from-gray-800 to-gray-900"
                    : "bg-linear-to-br from-gray-100 to-gray-200"
                }`}
              >
                <FaBookOpen
                  className={`text-5xl ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                لا توجد اختبارات
              </h3>
              <p
                className={`max-w-md mx-auto mb-8 text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchTerm ||
                selectedGrade ||
                selectedCategory
                  ? "لم نجد اختبارات تطابق معايير البحث المحددة"
                  : "سيتم إضافة المزيد من الاختبارات قريباً"}
              </p>
              {(searchTerm ||
                selectedGrade ||
                selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  عرض جميع الاختبارات
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid Header */}
              <div className="flex justify-between items-center mb-8">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  الاختبارات المتاحة
                </h2>
                <div
                  className={`text-sm px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {filteredQuizzes.length} اختبار
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`group relative rounded-3xl overflow-hidden transition-all duration-500 transform hover:-translate-y-3 ${
                      theme === "dark"
                        ? "bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 hover:border-indigo-500/50"
                        : "bg-white border border-gray-200/80 hover:border-indigo-300 shadow-lg hover:shadow-2xl"
                    }`}
                  >
                    {/* Popularity Badge */}
                    {quiz.popularity && quiz.popularity > 100 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                            theme === "dark"
                              ? "bg-linear-to-r from-amber-900 to-orange-900 text-amber-300"
                              : "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                          }`}
                        >
                          <FaFireAlt />
                          شعبي
                        </span>
                      </div>
                    )}

                    {/* Grade Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                          quiz.grade === "الفرقة الأولى"
                            ? theme === "dark"
                              ? "bg-blue-900/40 text-blue-300"
                              : "bg-blue-100 text-blue-700"
                            : quiz.grade === "الفرقة الثانية"
                            ? theme === "dark"
                              ? "bg-purple-900/40 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                            : quiz.grade === "الفرقة الثالثة"
                            ? theme === "dark"
                              ? "bg-emerald-900/40 text-emerald-300"
                              : "bg-emerald-100 text-emerald-700"
                            : theme === "dark"
                            ? "bg-orange-900/40 text-orange-300"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <FaGraduationCap />
                        {quiz.grade}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Difficulty Badge */}
                      {quiz.difficulty && (
                        <div className="flex justify-end mb-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                              quiz.difficulty
                            )}`}
                          >
                            {quiz.difficulty}
                          </span>
                        </div>
                      )}

                      <h3
                        className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {quiz.title}
                      </h3>

                      {quiz.description && (
                        <p
                          className={`text-sm mb-6 line-clamp-3 leading-relaxed ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {quiz.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div
                        className="flex items-center justify-between mb-6 py-4 border-y"
                        style={{
                          borderColor:
                            theme === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                        }}
                      >
                        <div
                          className={`flex items-center gap-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <FaCalendarAlt />
                          <span className="text-xs">
                            {new Date(quiz.created).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-4 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 text-sm">
                            <FaQuestionCircle className="text-indigo-500" />
                            <span className="font-semibold">
                              {quiz.questions.length}
                            </span>
                            <span className="text-xs">سؤال</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-sm">
                            <FaClock className="text-indigo-500" />
                            <span className="font-semibold">{quiz.time}</span>
                            <span className="text-xs">دقيقة</span>
                          </span>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mb-6">
                        <div
                          className={`flex items-center gap-2 text-sm mb-2 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <MdOutlineCategory />
                          <span>التخصص</span>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-xl text-center font-medium ${
                            theme === "dark"
                              ? "bg-gray-800 text-indigo-300"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {quiz.category}
                        </div>
                      </div>

                      {/* Start Button */}
                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="block w-full text-center py-3.5 px-6 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group/btn flex items-center justify-center gap-3"
                      >
                        <FaPlayCircle className="group-hover/btn:scale-110 transition-transform duration-300" />
                        <span>ابدأ الاختبار الآن</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Quick Stats */}
          <div
            className="mt-16 pt-8 border-t"
            style={{
              borderColor:
                theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <h3
              className={`text-2xl font-bold mb-8 text-center ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              إحصائيات سريعة
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "إجمالي الاختبارات",
                  value: quizzes.length,
                  icon: MdQuiz,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  label: "إجمالي الأسئلة",
                  value: quizzes.reduce(
                    (acc, quiz) => acc + quiz.questions.length,
                    0
                  ),
                  icon: FaQuestionCircle,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  label: "متوسط وقت الاختبار",
                  value:
                    Math.round(
                      quizzes.reduce((acc, quiz) => acc + quiz.time, 0) /
                        quizzes.length
                    ) + " د",
                  icon: FaClock,
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  label: "المواد المتاحة",
                  value: new Set(quizzes.map((q) => q.category)).size,
                  icon: FaBookOpen,
                  color: "from-orange-500 to-red-500",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gray-800/50 border border-gray-700/50"
                      : "bg-white border border-gray-200/80"
                  }`}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 bg-linear-to-r ${stat.color}`}
                  >
                    <stat.icon className="text-2xl text-white" />
                  </div>
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
