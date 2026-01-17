"use client";

import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaClock,
  FaQuestionCircle,
  FaChartBar,
  FaFileAlt,
  FaList,
  FaSave,
  FaKey,
  FaSignOutAlt,
  FaCog,
  FaBookOpen,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface IQuestion {
  t: string;
  o: string[];
  a: number;
}

interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  time: number;
  questions: IQuestion[];
  created: string;
  grade: string;
  category: string;
}

// Temporary interface for API question format
interface APIQuestion {
  question?: string;
  options?: string[];
  correct?: number;
  t?: string;
  o?: string[];
  a?: number;
}

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeSection, setActiveSection] = useState("quizzes");
  const { theme } = useTheme();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("gaithAdminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      loadQuizzes();
    } else {
      setLoading(false);
    }
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);
      } else {
        Swal.fire("خطأ", "حدث خطأ في تحميل الاختبارات", "error");
      }
    } catch {
      Swal.fire("خطأ", "حدث خطأ في تحميل الاختبارات", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const adminPassword =
      localStorage.getItem("gaithAdminPassword") || "123456789";
    if (password === adminPassword) {
      sessionStorage.setItem("gaithAdminLoggedIn", "true");
      setIsLoggedIn(true);
      Swal.fire("نجاح", "تم تسجيل الدخول بنجاح", "success");
      loadQuizzes();
    } else {
      Swal.fire("خطأ", "كلمة المرور غير صحيحة", "error");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gaithAdminLoggedIn");
    setIsLoggedIn(false);
    setPassword("");
    Swal.fire("تم", "تم تسجيل الخروج", "info");
  };

  const handleChangePassword = () => {
    const adminPassword =
      localStorage.getItem("gaithAdminPassword") || "123456789";
    if (currentPassword !== adminPassword) {
      Swal.fire("خطأ", "كلمة المرور الحالية غير صحيحة", "error");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Swal.fire(
        "خطأ",
        "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        "error"
      );
      return;
    }

    localStorage.setItem("gaithAdminPassword", newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setShowPasswordChange(false);
    Swal.fire("نجاح", "تم تغيير كلمة المرور بنجاح", "success");
  };

  const handleCreateQuiz = async (quizData: Partial<Quiz>) => {
    try {
      const transformedQuestions =
        quizData.questions?.map((q) => ({
          question: q.t,
          options: q.o,
          correct: q.a,
        })) || [];

      const slug =
        quizData.title
          ?.toLowerCase()
          .replace(/[^\w\s\u0600-\u06FF-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
          .replace(/^-|-$/g, "") || `quiz-${Date.now()}`;

      if (!slug || slug.trim() === "") {
        throw new Error("Unable to generate slug from title");
      }

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          time: quizData.time,
          grade: quizData.grade,
          category: quizData.category,
          slug: slug,
          questions: transformedQuestions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("نجاح", "تم حفظ الكويز بنجاح!", "success");
        setShowCreateModal(false);
        loadQuizzes();
      } else {
        Swal.fire("خطأ", data.message || "حدث خطأ في حفظ الكويز", "error");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      Swal.fire("خطأ", "حدث خطأ في حفظ الكويز", "error");
    }
  };

  const handleEditQuiz = async (quizData: Partial<Quiz>) => {
    if (!editingQuiz) return;

    try {
      const transformedQuestions =
        quizData.questions?.map((q) => ({
          question: q.t,
          options: q.o,
          correct: q.a,
        })) || [];

      const response = await fetch(`/api/quizzes/${editingQuiz.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          time: quizData.time,
          grade: quizData.grade,
          category: quizData.category,
          slug: editingQuiz.slug, // Keep the existing slug
          questions: transformedQuestions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("نجاح", "تم تحديث الكويز بنجاح!", "success");
        setEditingQuiz(null);
        loadQuizzes();
      } else {
        Swal.fire("خطأ", data.message || "حدث خطأ في تحديث الكويز", "error");
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      Swal.fire("خطأ", "حدث خطأ في تحديث الكويز", "error");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e71d36",
      cancelButtonColor: "#4361ee",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/quizzes/${quizId}`, {
            method: "DELETE",
          });

          const data = await response.json();

          if (data.success) {
            Swal.fire("تم الحذف!", "تم حذف الكويز بنجاح", "success");
            loadQuizzes();
          } else {
            Swal.fire("خطأ", data.message || "حدث خطأ في حذف الكويز", "error");
          }
        } catch (error) {
          console.error("Error deleting quiz:", error);
          Swal.fire("خطأ", "حدث خطأ في حذف الكويز", "error");
        }
      }
    });
  };

  const copyQuizLink = (quizSlug: string) => {
    const quizUrl = `${window.location.origin}/quiz/${quizSlug}`;
    navigator.clipboard.writeText(quizUrl).then(() => {
      Swal.fire("نجاح", "تم نسخ رابط الكويز!", "success");
    });
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <div
          className={`min-h-screen ${
            theme === "dark"
              ? "bg-linear-to-b from-gray-900/50 to-gray-800/50"
              : "bg-linear-to-br from-blue-50 to-indigo-50"
          } flex items-center justify-center`}
        >
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-indigo-500 mx-auto mb-6"></div>
              <FaBookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500 text-2xl" />
            </div>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } animate-pulse`}
            >
              جاري التحميل ...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-700 rounded-2xl mb-6 shadow-lg">
              <FaKey className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-indigo-800 mb-3">
              تسجيل الدخول للإدارة
            </h1>
            <p className="text-gray-600">
              أدخل كلمة المرور للوصول إلى لوحة التحكم
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaKey className="text-indigo-600" />
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-12 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-gray-200 transition-all duration-300 bg-gray-50"
                  placeholder="أدخل كلمة المرور"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FaKey className="text-white text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-4 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <FaSignOutAlt />
              دخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen `}>
      {/* Simple Top Bar */}

      <div className="container mx-auto px-4 pb-12 pt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-indigo-400 to-indigo-600 text-white rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">
                  إجمالي الكويزات
                </p>
                <p className="text-3xl font-bold mt-2">{quizzes.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <FaFileAlt className="text-2xl " />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  إجمالي الأسئلة
                </p>
                <p className="text-3xl font-bold mt-2">
                  {quizzes.reduce(
                    (sum, quiz) => sum + quiz.questions.length,
                    0
                  )}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <FaQuestionCircle className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-400 to-orange-600 text-white rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  الوقت الإجمالي
                </p>
                <p className="text-3xl font-bold mt-2">
                  {quizzes.reduce((sum, quiz) => sum + quiz.time, 0)} دقيقة
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <FaClock className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">المواد</p>
                <p className="text-3xl font-bold mt-2">
                  {new Set(quizzes.map((q) => q.category)).size}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <FaChartBar className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Create Quiz */}
          <div
            className={`rounded-2xl shadow-xl p-6 mb-6 border transform hover:-translate-y-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 backdrop-blur-lg"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2
                className={`text-2xl font-bold flex items-center gap-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                  <FaPlus className="text-white" />
                </div>
                إنشاء كويز جديد
              </h2>
            </div>

            <QuizForm
              onSubmit={handleCreateQuiz}
              onCancel={() => setShowCreateModal(false)}
              initialData={null}
            />
          </div>

          {/* Quizzes List */}
          <div
            className={`rounded-2xl shadow-xl p-6 mb-6 border transform hover:-translate-y-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 backdrop-blur-lg"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2
                className={`text-2xl font-bold flex items-center gap-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                  <FaList className="text-white" />
                </div>
                الكويزات المحفوظة
              </h2>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-5 py-3 pr-12 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-gray-600 text-white placeholder-gray-200"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="ابحث عن كويز..."
                />
                <FaSearch
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <FaFileAlt
                      className={`text-3xl ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    لا توجد كويزات
                  </h3>
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  >
                    ابدأ بإنشاء أول كويز جديد
                  </p>
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "border-gray-600 hover:border-indigo-400 /50"
                        : "border-gray-100 hover:border-indigo-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`text-xl font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {quiz.title}
                          </h3>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full">
                            {quiz.questions.length} أسئلة
                          </span>
                        </div>
                        {quiz.description && (
                          <p
                            className={`mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <span
                            className={`px-3 py-1 text-sm rounded-lg flex items-center gap-2 ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <FaClock className="text-gray-500" />
                            {quiz.time} دقيقة
                          </span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg">
                            {quiz.category}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                            {quiz.grade}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyQuizLink(quiz.slug)}
                          className="px-4 py-2 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaEye />
                          نسخ الرابط
                        </button>
                        <button
                          onClick={() => setEditingQuiz(quiz)}
                          className="px-4 py-2 bg-linear-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaEdit />
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaTrash />
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Settings */}
          <div
            className={`rounded-2xl shadow-xl p-6 border transform hover:-translate-y-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 backdrop-blur-lg"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-2xl font-bold flex items-center gap-3 mb-8 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                <FaCog className="text-white" />
              </div>
              إعدادات الإدارة
            </h2>

            <div className="space-y-6">
              {showPasswordChange ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaKey className="text-indigo-500" />
                      كلمة المرور الحالية
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaKey className="text-green-500" />
                      كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                      placeholder="أدخل كلمة المرور الجديدة"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 py-3 bg-linear-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      حفظ التغييرات
                    </button>
                    <button
                      onClick={() => setShowPasswordChange(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="w-full py-4 bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <FaKey />
                    تغيير كلمة المرور
                  </button>

                  <div
                    className={`border-t pt-6 ${
                      theme === "dark" ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <h3
                      className={`font-semibold mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      إحصائيات النظام
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          الكويزات المحفوظة
                        </span>
                        <span className="font-bold text-indigo-600">
                          {quizzes.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          إجمالي الأسئلة
                        </span>
                        <span className="font-bold text-green-600">
                          {quizzes.reduce(
                            (sum, quiz) => sum + quiz.questions.length,
                            0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          المواد المختلفة
                        </span>
                        <span className="font-bold text-indigo-600">
                          {new Set(quizzes.map((q) => q.category)).size}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800"
                  }`}
                >
                  <FaBookOpen className="text-sm" />
                  الصفحة الرئيسية
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <FaSignOutAlt className="text-sm" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                  <FaEdit className="text-white" />
                </div>
                تعديل الكويز
              </h2>
            </div>

            <div className="p-6">
              <QuizForm
                onSubmit={handleEditQuiz}
                onCancel={() => setEditingQuiz(null)}
                initialData={editingQuiz}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuizFormProps {
  onSubmit: (data: Partial<Quiz>) => void;
  onCancel: () => void;
  initialData: Quiz | null;
}

function QuizForm({ onSubmit, onCancel, initialData }: QuizFormProps) {
  const { theme } = useTheme();

  const getInitialFormData = () => {
    const allCategories = [
      "التشريح", "وظائف الأعضاء", "كيمياء حيوية", "ميكروبيولوجي",
      "علم السلوك", "علم الاجتماع", "لغة إنجليزية", "حاسب آلي",
      "أساسيات التمريض", "مبادئ الإسعافات الأولية", "صحة عامة",
      "تدريب عملي على أساسيات التمريض", "باثولوجي", "فارماكولوجي",
      "تغذية علاجية", "باراسيتولوجي", "طب المجتمع",
      "تمريض باطني وجراحي 1", "تمريض صحة الأم والطفل 1",
      "تمريض مسنين", "تمريض الصحة النفسية", "تدريب عملي في المستشفيات",
      "أمراض النساء والولادة", "طب الأطفال", "تمريض باطني وجراحي 2",
      "تمريض صحة الأم والطفل 2", "تمريض أطفال",
      "تمريض الطوارئ والعناية الحرجة", "تمريض الصحة المهنية",
      "تدريب سريري", "تمريض العناية الحرجة والحالات الحرجة",
      "تمريض الحالات الحرجة للأطفال", "إدارة التمريض",
      "تمريض الصحة النفسية المتقدم", "تمريض المجتمع",
      "تمريض الأمراض المعدية", "مشروع تخرج", "تدريب امتياز",
      "امتياز باطني", "امتياز جراحة", "امتياز أطفال",
      "امتياز نساء وتوليد", "امتياز عناية مركزة", "امتياز طوارئ",
      "امتياز نفسية", "امتياز مجتمع"
    ];

    let category = initialData?.category || "";
    let customCategoryValue = "";
    let showCustomCategory = false;

    if (
      initialData?.category &&
      !allCategories.includes(initialData.category)
    ) {
      customCategoryValue = initialData.category;
      category = "أخرى";
      showCustomCategory = true;
    }

    // Transform questions from API format to form format
    const questions = initialData?.questions?.map((q: APIQuestion) => ({
      t: q.question || q.t || "",
      o: q.options || q.o || ["", ""],
      a: q.correct !== undefined ? q.correct : q.a !== undefined ? q.a : 0,
    })) || [{ t: "", o: ["", ""], a: 0 }];

    return {
      title: initialData?.title || "",
      description: initialData?.description || "",
      time: initialData?.time || 60,
      grade: initialData?.grade || "",
      category: category,
      questions: questions,
      customCategory: customCategoryValue,
      showCustomCategory: showCustomCategory,
    };
  };

  const [formData, setFormData] =
    useState<Partial<Quiz & { customCategory?: string; showCustomCategory?: boolean }>>(getInitialFormData);
  const [questionCount, setQuestionCount] = useState(
    initialData?.questions?.length || 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      Swal.fire("خطأ", "يرجى إدخال عنوان الكويز", "error");
      return;
    }

    if (!formData.questions || formData.questions.length === 0) {
      Swal.fire("خطأ", "يجب إضافة سؤال واحد على الأقل", "error");
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.t.trim() || q.o.some((opt) => !opt.trim())) {
        Swal.fire("خطأ", `يرجى ملء جميع الحقول في السؤال ${i + 1}`, "error");
        return;
      }
    }

    onSubmit(formData);
  };

  const addQuestion = () => {
    setQuestionCount((prev) => prev + 1);
    setFormData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), { t: "", o: ["", ""], a: 0 }],
    }));
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...(formData.questions || [])];
    newQuestions[questionIndex].o.push("");
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...(formData.questions || [])];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
    setQuestionCount((prev) => prev - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof IQuestion,
    value: string | string[] | number
  ) => {
    const newQuestions = [...(formData.questions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">#</span>
            </div>
            عنوان الكويز
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
              theme === "dark"
                ? "border-gray-600 text-white placeholder-gray-200"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
            placeholder="أدخل عنوان الكويز"
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaClock className="text-white text-sm" />
            </div>
            الوقت المحدد (دقائق)
          </label>
          <input
            type="number"
            value={formData.time}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                time: parseInt(e.target.value),
              }))
            }
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
              theme === "dark"
                ? " border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
            min="1"
            max="300"
            required
            aria-label="الوقت المحدد بالدقائق"
          />
        </div>

        <div className="md:col-span-2">
          <label
            className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✏️</span>
            </div>
            وصف الكويز (اختياري)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none ${
              theme === "dark"
                ? "border-gray-600 text-white placeholder-gray-200"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
            rows={3}
            placeholder="أدخل وصف الكويز"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            المادة
          </label>
          <select
            value={
              formData.category === formData.customCategory
                ? "أخرى"
                : formData.category
            }
            onChange={(e) => {
              if (e.target.value === "أخرى") {
                setFormData((prev) => ({
                  ...prev,
                  category: "أخرى",
                  showCustomCategory: true,
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  showCustomCategory: false,
                }));
              }
            }}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
              theme === "dark"
                ? " border-gray-600 bg-gray-800 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
            required
            aria-label="اختيار المادة"
          >
            <option value="">اختر المادة</option>
            <option value="التشريح">التشريح (Anatomy)</option>
            <option value="وظائف الأعضاء">وظائف الأعضاء (Physiology)</option>
            <option value="كيمياء حيوية">كيمياء حيوية (Biochemistry)</option>
            <option value="ميكروبيولوجي">ميكروبيولوجي (Microbiology)</option>
            <option value="علم السلوك">علم السلوك (Psychology)</option>
            <option value="علم الاجتماع">علم الاجتماع (Sociology)</option>
            <option value="لغة إنجليزية">لغة إنجليزية</option>
            <option value="حاسب آلي">حاسب آلي</option>
            <option value="أساسيات التمريض">أساسيات التمريض (Fundamentals of Nursing)</option>
            <option value="مبادئ الإسعافات الأولية">مبادئ الإسعافات الأولية</option>
            <option value="صحة عامة">صحة عامة (Community Health)</option>
            <option value="تدريب عملي على أساسيات التمريض">تدريب عملي على أساسيات التمريض</option>
            <option value="باثولوجي">باثولوجي (Pathology)</option>
            <option value="فارماكولوجي">فارماكولوجي (Pharmacology)</option>
            <option value="تغذية علاجية">تغذية علاجية (Nutrition)</option>
            <option value="باراسيتولوجي">باراسيتولوجي (Parasitology)</option>
            <option value="طب المجتمع">طب المجتمع (Community Medicine)</option>
            <option value="تمريض باطني وجراحي 1">تمريض باطني وجراحي 1 (Medical & Surgical Nursing I)</option>
            <option value="تمريض صحة الأم والطفل 1">تمريض صحة الأم والطفل 1 (Maternity & Child Health Nursing I)</option>
            <option value="تمريض مسنين">تمريض مسنين (Geriatric Nursing)</option>
            <option value="تمريض الصحة النفسية">تمريض الصحة النفسية (Psychiatric Nursing)</option>
            <option value="تدريب عملي في المستشفيات">تدريب عملي في المستشفيات</option>
            <option value="أمراض النساء والولادة">أمراض النساء والولادة (Obstetrics & Gynecology)</option>
            <option value="طب الأطفال">طب الأطفال (Pediatrics)</option>
            <option value="تمريض باطني وجراحي 2">تمريض باطني وجراحي 2 (Medical & Surgical Nursing II)</option>
            <option value="تمريض صحة الأم والطفل 2">تمريض صحة الأم والطفل 2 (Maternity & Child Health Nursing II)</option>
            <option value="تمريض أطفال">تمريض أطفال (Pediatric Nursing)</option>
            <option value="تمريض الطوارئ والعناية الحرجة">تمريض الطوارئ والعناية الحرجة (Emergency & Critical Care Nursing)</option>
            <option value="تمريض الصحة المهنية">تمريض الصحة المهنية</option>
            <option value="تدريب سريري">تدريب سريري</option>
            <option value="تمريض العناية الحرجة والحالات الحرجة">تمريض العناية الحرجة والحالات الحرجة (ICU & Critical Care)</option>
            <option value="تمريض الحالات الحرجة للأطفال">تمريض الحالات الحرجة للأطفال (Pediatric Critical Care)</option>
            <option value="إدارة التمريض">إدارة التمريض (Nursing Administration)</option>
            <option value="تمريض الصحة النفسية المتقدم">تمريض الصحة النفسية المتقدم</option>
            <option value="تمريض المجتمع">تمريض المجتمع (Community Nursing)</option>
            <option value="تمريض الأمراض المعدية">تمريض الأمراض المعدية</option>
            <option value="مشروع تخرج">مشروع تخرج (Research Project)</option>
            <option value="تدريب امتياز">تدريب امتياز (Internship)</option>
            <option value="امتياز باطني">امتياز باطني</option>
            <option value="امتياز جراحة">امتياز جراحة</option>
            <option value="امتياز أطفال">امتياز أطفال</option>
            <option value="امتياز نساء وتوليد">امتياز نساء وتوليد</option>
            <option value="امتياز عناية مركزة">امتياز عناية مركزة</option>
            <option value="امتياز طوارئ">امتياز طوارئ</option>
            <option value="امتياز نفسية">امتياز نفسية</option>
            <option value="امتياز مجتمع">امتياز مجتمع</option>
            <option value="أخرى">أخرى</option>
          </select>

          {formData.category === "أخرى" && (
            <input
              type="text"
              value={formData.customCategory || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  customCategory: e.target.value,
                  category: e.target.value,
                }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mt-3 ${
                theme === "dark"
                  ? "border-gray-600 text-white placeholder-gray-200"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="أدخل اسم المادة المخصصة"
              required
            />
          )}
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            الفرقة
          </label>
          <select
            value={formData.grade}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, grade: e.target.value }))
            }
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
              theme === "dark"
                ? " border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
            required
            aria-label="اختيار الفرقة"
          >
            <option value="">اختر الفرقة</option>
            <option value="الفرقة الأولى">الفرقة الأولى</option>
            <option value="الفرقة الثانية">الفرقة الثانية</option>
            <option value="الفرقة الثالثة">الفرقة الثالثة</option>
            <option value="الفرقة الرابعة">الفرقة الرابعة</option>
          </select>
        </div>
      </div>

      {/* Questions Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="mb-6">
          <h3
            className={`text-xl font-bold flex items-center gap-3 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
              <FaQuestionCircle className="text-white" />
            </div>
            الأسئلة
          </h3>
        </div>

        <div className="space-y-6">
          {formData.questions?.map((question, qIndex) => (
            <div
              key={qIndex}
              className={`border-2 rounded-xl p-6 hover:border-indigo-200 transition-all duration-300 ${
                theme === "dark"
                  ? "border-gray-600 /50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{qIndex + 1}</span>
                  </div>
                  <h4
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    السؤال {qIndex + 1}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                >
                  <FaTrash />
                  حذف
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    نص السؤال
                  </label>
                  <textarea
                    value={question.t}
                    onChange={(e) =>
                      updateQuestion(qIndex, "t", e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none ${
                      theme === "dark"
                        ? "border-gray-600 text-white placeholder-gray-200"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                    rows={3}
                    placeholder="اكتب السؤال هنا..."
                    required
                  />
                </div>

                <div>
                  <div className="mb-3">
                    <label
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      الخيارات
                    </label>
                  </div>

                  <div className="space-y-3">
                    {question.o.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-white font-bold">
                            {oIndex + 1}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.o];
                            newOptions[oIndex] = e.target.value;
                            updateQuestion(qIndex, "o", newOptions);
                          }}
                          className={`flex-1 px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 ${
                            theme === "dark"
                              ? "border-gray-600 text-white placeholder-gray-200"
                              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder={`الإجابة ${oIndex + 1}`}
                          required
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.a === oIndex}
                            onChange={() => updateQuestion(qIndex, "a", oIndex)}
                            className={`w-5 h-5 ${
                              question.a === oIndex
                                ? "text-green-500 focus:ring-green-300"
                                : "text-gray-400 focus:ring-gray-300"
                            }`}
                            aria-label={`الإجابة الصحيحة ${oIndex + 1}`}
                          />
                          {question.a === oIndex && (
                            <span className="text-sm font-semibold text-green-600">
                              صح
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex  mt-4">
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="px-4 py-2 bg-linear-to-r from-emerald-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
                      >
                        <FaPlus />
                        إضافة خيار
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FaPlus />
              إضافة سؤال
            </button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className={`px-8 py-3 border-2 ${
            theme === "dark" ? "border-gray-300" : "border-gray-600"
          } rounded-xl transition-all duration-300 font-bold`}
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <FaSave />
          {initialData ? "تحديث الكويز" : "حفظ الكويز"}
        </button>
      </div>
    </form>
  );
}
