"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaGraduationCap,
  FaClock,
  FaQuestionCircle,
  FaPlayCircle,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";

import { useTheme } from "@/components/ThemeProvider";

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
  questions: IQuestion[];
  created: Date;
  updated: Date;
}

const gradeNames: { [key: string]: string } = {
  grade1: "الفرقة الأولى",
  grade2: "الفرقة الثانية",
  grade3: "الفرقة الثالثة",
  grade4: "الفرقة الرابعة",
};

export default function GradePageClient() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const gradeParam = params.grade as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    categories: 0,
  });

  const gradeName = gradeNames[gradeParam] || gradeParam;

  useEffect(() => {
    loadQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeParam]);

  // Filter quizzes based on search term
  useEffect(() => {
    const filtered = quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm]);

  const loadQuizzes = async () => {
    try {
      const response = await fetch(
        `/api/quizzes?grade=${encodeURIComponent(gradeName)}`
      );
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);

        const totalQuestions = data.data.reduce(
          (sum: number, quiz: Quiz) => sum + quiz.questions.length,
          0
        );
        const uniqueCategories = new Set(
          data.data.map((quiz: Quiz) => quiz.category)
        ).size;

        setStats({
          totalQuizzes: data.data.length,
          totalQuestions,
          categories: uniqueCategories,
        });
      }
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p>جاري تحميل الاختبارات...</p>
          </div>
        </div>
        
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-linear-to-b from-gray-900/50 to-gray-800/50"
            : "bg-linear-to-b from-gray-50 to-white"
        } py-8`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div
            className={`rounded-2xl shadow-xl p-6 mb-6 border transform hover:-translate-y-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 backdrop-blur-lg"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push("/")}
                className={`flex items-center gap-2 ${
                  theme === "dark"
                    ? "text-indigo-300 hover:text-indigo-200"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                <FaArrowLeft />
                العودة للرئيسية
              </button>
            </div>

            <div className="flex items-center gap-4">
              <FaGraduationCap
                className={`text-4xl ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                }`}
              />
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {gradeName}
                </h1>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  اختبارات التمريض لهذه الفرقة
                </p>
              </div>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="mb-16">
            {/* Search Bar */}
            <div
              className={`rounded-2xl shadow-xl p-6 mb-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 backdrop-blur-lg"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-5 py-4 pr-12 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-right ${
                    theme === "dark"
                      ? "border-gray-600 text-white placeholder-gray-200"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="ابحث عن اختبار..."
                />
                <FaSearch
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
              </div>
              {searchTerm && (
                <p
                  className={`text-center mt-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  تم العثور على {filteredQuizzes.length} اختبار
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white border-gray-200"
                } text-center`}
              >
                <FaPlayCircle
                  className={`text-3xl mx-auto mb-2 ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  عدد الاختبارات
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`}
                >
                  {stats.totalQuizzes}
                </p>
              </div>
              <div
                className={`rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white border-gray-200"
                } text-center`}
              >
                <FaQuestionCircle
                  className={`text-3xl mx-auto mb-2 ${
                    theme === "dark" ? "text-green-400" : "text-green-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  إجمالي الأسئلة
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-green-400" : "text-green-500"
                  }`}
                >
                  {stats.totalQuestions}
                </p>
              </div>
              <div
                className={`rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white border-gray-200"
                } text-center`}
              >
                <FaGraduationCap
                  className={`text-3xl mx-auto mb-2 ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  عدد المواد
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`}
                >
                  {stats.categories}
                </p>
              </div>
            </div>
          </div>

          {/* Quizzes */}
          {filteredQuizzes.length === 0 ? (
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
                {searchTerm ? "لا توجد نتائج لبحثك" : "لا توجد اختبارات متاحة"}
              </h3>
              <p
                className={`max-w-md mx-auto ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchTerm
                  ? "جرب كلمات بحث مختلفة"
                  : "سيتم إضافة اختبارات جديدة قريباً لهذه الفرقة"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`group relative rounded-2xl shadow-lg p-6 border transition-all duration-300 transform hover:-translate-y-1 ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 backdrop-blur-lg hover:border-indigo-500/30  "
                      : "bg-white border-gray-200 hover:shadow-2xl hover:border-indigo-200"
                  }`}
                >
                  {/* Top badge */}
                  <div className="flex items-center gap-1 justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium  ${
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
                      className={`px-3 mx-1 py-1 rounded-full text-xs font-medium ${
                        quiz.grade === "الفرقة الأولى"
                          ? "bg-blue-100 text-blue-600"
                          : quiz.grade === "الفرقة الثانية"
                          ? "bg-purple-100 text-purple-600"
                          : quiz.grade === "الفرقة الثالثة"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {quiz.category}
                    </span>
                  </div>

                  <div className="pt-8">
                    <h3
                      className={`text-lg font-bold mb-3 line-clamp-2  transition-colors ${
                        theme === "dark" ? "text-white group-hover:text-purple-300" : "text-gray-800 group-hover:text-indigo-600"
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
                          {quiz.questions.length} سؤال
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {quiz.time} دقيقة
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/quiz/${quiz.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                    >
                      <FaSearch />
                      ابدأ الاختبار
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}
