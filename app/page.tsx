"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FaGraduationCap,
  FaArrowRight,
  FaSearch,
  FaClock,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSchool, MdTrendingUp } from "react-icons/md";
import Header from "@/components/Header";
import { useTheme } from "@/components/ThemeProvider";
import TelegramSection from "@/components/TelegramSection";

interface IQuestion {
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
  questions?: IQuestion[];
  questionCount: number;
  created: Date;
  updated: Date;
}

export default function Home() {
  const { theme } = useTheme();
  const [grades, setGrades] = useState<string[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState({
    quizCount: 0,
    questionCount: 0,
    userCount: 0,
  });

  const trackVisitor = (): number => {
    if (typeof window === "undefined") return 1;

    let sessionId = sessionStorage.getItem("gaithSessionId");
    if (!sessionId) {
      sessionId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("gaithSessionId", sessionId);
    }

    const isNewVisitor = !localStorage.getItem("gaithVisitorTracked");
    if (isNewVisitor) {
      let totalVisitors = parseInt(
        localStorage.getItem("gaithTotalVisitors") || "0",
      );
      totalVisitors++;
      localStorage.setItem("gaithTotalVisitors", totalVisitors.toString());
      localStorage.setItem("gaithVisitorTracked", "true");
      return totalVisitors;
    } else {
      return parseInt(localStorage.getItem("gaithTotalVisitors") || "1");
    }
  };

  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);
        setGrades(data.grades);
        const userCount = trackVisitor();
        setStats({
          ...data.stats,
          userCount: userCount,
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradeCards = useMemo(() => [
    {
      grade: "الفرقة الأولى",
      slug: "grade1",
      description: "أساسيات التمريض",
      color: "from-blue-500 to-cyan-400",
      icon: <FaGraduationCap className="text-3xl" />,
    },
    {
      grade: "الفرقة الثانية",
      slug: "grade2",
      description: "تخصصات متقدمة",
      color: "from-purple-500 to-pink-400",
      icon: <MdOutlineSchool className="text-3xl" />,
    },
    {
      grade: "الفرقة الثالثة",
      slug: "grade3",
      description: "ممارسة سريرية",
      color: "from-emerald-500 to-teal-400",
      icon: <FaGraduationCap className="text-3xl" />,
    },
    {
      grade: "الفرقة الرابعة",
      slug: "grade4",
      description: "إعداد التخرج",
      color: "from-orange-500 to-amber-400",
      icon: <MdTrendingUp className="text-3xl" />,
    },
  ], []);

  // Memoize quiz counts per grade
  const gradeQuizCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    gradeCards.forEach(card => {
      counts[card.grade] = quizzes.filter(quiz => quiz.grade === card.grade).length;
    });
    return counts;
  }, [quizzes, gradeCards]);

  // Stats cards data
  const statCards = useMemo(() => [
    {
      title: "إجمالي الاختبارات",
      value: stats.quizCount,
      icon: <FaGraduationCap className="text-2xl" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "إجمالي الأسئلة",
      value: stats.questionCount,
      icon: <FaQuestionCircle className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "عدد المستخدمين",
      value: stats.userCount,
      icon: <FaUsers className="text-2xl" />,
      color: "from-emerald-500 to-teal-500",
    },
  ], [stats]);

  return (
    <>
      <Header />
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-linear-to-b from-gray-900/50 to-gray-800/50"
            : "bg-linear-to-b from-gray-50 to-white"
        }`}
      >
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Stats Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 backdrop-blur-lg"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 bg-linear-to-r ${stat.color} rounded-xl text-white`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {stat.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Cards Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  الموادالدراسية
                </span>
              </h2>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                اختر فرقتك الدراسية وابدأ رحلتك في التحضير للاختبارات
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gradeCards.map((gradeCard, index) => {
                const quizCount = gradeQuizCounts[gradeCard.grade] || 0;

                return (
                  <Link
                    key={gradeCard.slug}
                    href={`/grade/${gradeCard.slug}`}
                    className="group relative block"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500 ${
                        theme === "dark"
                          ? "bg-linear-to-r from-gray-700 to-gray-600"
                          : "bg-linear-to-r from-gray-300 to-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`relative rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 h-full ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 backdrop-blur-lg"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="mb-6 flex justify-center">
                        <div
                          className={`p-4 bg-linear-to-br ${gradeCard.color} rounded-2xl text-white`}
                        >
                          {gradeCard.icon}
                        </div>
                      </div>

                      <div className="text-center">
                        <h3
                          className={`text-xl font-bold mb-2  transition-colors ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {gradeCard.grade}
                        </h3>
                        <p
                          className={`text-sm mb-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {gradeCard.description}
                        </p>

                        <div
                          className={`flex items-center justify-center gap-4 text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <FaGraduationCap className="text-xs" />
                            {quizCount} اختبار
                          </span>
                        </div>

                        <div
                          className={`mt-6 flex items-center justify-center gap-2 ${
                            theme === "dark"
                              ? "text-indigo-300"
                              : "text-indigo-600"
                          }`}
                        >
                          <span>عرض الكويزات</span>
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Quizzes Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  أحدث الاختبارات
                </h2>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  استكشف وابدأ الاختبارات الحديثة
                </p>
              </div>
              {quizzes.length > 6 && (
                <Link
                  href="/quizzes"
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                >
                  عرض الكل
                  <FaArrowRight />
                </Link>
              )}
            </div>

            {quizzes.length === 0 ? (
              <div
                className={`text-center py-16 rounded-2xl shadow-lg ${
                  theme === "dark"
                    ? "bg-white/5 backdrop-blur-lg"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    theme === "dark"
                      ? "bg-linear-to-r from-gray-700 to-gray-600"
                      : "bg-linear-to-r from-gray-200 to-gray-300"
                  }`}
                >
                  <FaGraduationCap
                    className={`text-3xl ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  لا توجد اختبارات متاحة حالياً
                </h3>
                <p
                  className={`max-w-md mx-auto ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  جاري إضافة اختبارات جديدة قريباً
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.slice(0, 6).map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`group relative rounded-2xl shadow-lg p-6 border transition-all duration-300 transform hover:-translate-y-1 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 backdrop-blur-lg hover:border-indigo-500/30"
                        : "bg-white border-gray-200 hover:shadow-2xl hover:border-indigo-200"
                    }`}
                  >
                    {/* Top badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quiz.grade === "الفرقة الأولى"
                            ? "bg-blue-100 text-blue-600"
                            : quiz.grade === "الفرقة الثانية"
                              ? "bg-purple-100 text-purple-600"
                              : quiz.grade === "الفرقة الثالثة"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {quiz.grade}
                      </span>
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          theme === "dark"
                            ? "bg-indigo-900/30 text-indigo-300 border border-indigo-700/50"
                            : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        <FaGraduationCap className="text-xs" />
                        {quiz.category}
                      </span>
                    </div>

                    <div className="pt-8">
                      <h3
                        className={`text-lg font-bold mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {quiz.title}
                      </h3>

                      {quiz.description && (
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {quiz.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`flex items-center gap-4 text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <FaQuestionCircle />
                            {quiz.questionCount} سؤال
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock />
                            {quiz.time} دقيقة
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                      >
                        <FaSearch />
                        ابدأ الاختبار
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="relative rounded-3xl overflow-hidden mb-16">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="relative z-10 py-12 px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                مستعد لاختبار مهاراتك؟
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                انضم إلى آلاف الطلاب الذين يحسنون مستواهم من خلال منصتنا
              </p>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaGraduationCap />
                تصفح جميع الاختبارات
              </Link>
            </div>
          </div>
      <TelegramSection/>
        </div>
      </div>


      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </>
  );
}
