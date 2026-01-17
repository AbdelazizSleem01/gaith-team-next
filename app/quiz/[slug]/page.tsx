'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaClock, FaFlagCheckered, FaQuestionCircle, FaChartBar, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useTheme } from '@/components/ThemeProvider';

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

export default function QuizPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const quizSlug = params.slug as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${quizSlug}`);
        const data = await response.json();

        if (data.success) {
          setQuiz(data.data);
          setTimeLeft(data.data.time * 60);
          setUserAnswers(new Array(data.data.questions.length).fill(-1));
        } else {
          Swal.fire({
            title: 'خطأ',
            text: 'لم يتم العثور على الاختبار',
            icon: 'error',
            confirmButtonText: 'العودة للرئيسية',
          }).then(() => router.push('/'));
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ في تحميل الاختبار',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizSlug, router]);

  const finishQuiz = useCallback(() => {
    if (!quiz) return;

    setIsFinished(true);

    const correctAnswers = userAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correct ? count + 1 : count;
    }, 0);

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    Swal.fire({
      title: score >= 70 ? 'ممتاز!' : score >= 50 ? 'جيد' : 'يحتاج تحسين',
      html: `
        <div class="text-center">
          <div class="text-4xl font-bold mb-4">${score}%</div>
          <div class="text-lg mb-2">الإجابات الصحيحة: ${correctAnswers} من ${quiz.questions.length}</div>
          <div class="text-sm text-gray-600">
            الوقت المستغرق: ${Math.floor((quiz.time * 60 - timeLeft) / 60)}:${String((quiz.time * 60 - timeLeft) % 60).padStart(2, '0')}
          </div>
        </div>
      `,
      icon: score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error',
      confirmButtonText: 'العودة للرئيسية',
      showCancelButton: true,
      cancelButtonText: 'إعادة المحاولة',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/');
      } else {
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(quiz.questions.length).fill(-1));
        setTimeLeft(quiz.time * 60);
        setIsFinished(false);
      }
    });
  }, [quiz, userAnswers, timeLeft, router]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !isFinished) {
      finishQuiz();
    }
  }, [timeLeft, isFinished, finishQuiz]);

  const selectAnswer = (optionIndex: number) => {
    if (isFinished || showFeedback || !quiz) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    const isAnswerCorrect = optionIndex === quiz.questions[currentQuestionIndex].correct;
    setIsCorrect(isAnswerCorrect);
    setFeedbackMessage(isAnswerCorrect ? 'إجابة صحيحة! أحسنت!' : 'إجابة خاطئة. حاول مرة أخرى!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 2000);
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

 

  const calculateTimePercentage = () => {
    if (!quiz) return 100;
    const totalTime = quiz.time * 60;
    return (timeLeft / totalTime) * 100;
  };

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
            <p className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } animate-pulse`}>جاري تحميل الاختبار...</p>
          </div>
        </div>
        
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <div
          className={`min-h-screen ${
            theme === "dark"
              ? "bg-linear-to-b from-gray-900/50 to-gray-800/50"
              : "bg-linear-to-br from-blue-50 to-indigo-50"
          } flex items-center justify-center`}
        >
          <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFlagCheckered className="text-4xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">لم يتم العثور على الاختبار</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
        
      </>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredQuestions = userAnswers.filter(answer => answer !== -1).length;

  return (
    <>
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-linear-to-b from-gray-900/50 to-gray-800/50"
            : "bg-linear-to-br from-blue-50 to-indigo-50"
        } py-8`}
      >
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Header with stats */}
          <div
            className={`rounded-2xl shadow-xl p-6 mb-8 border transform hover:-translate-y-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 backdrop-blur-lg"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-100"
                  }`}>
                    <FaBookOpen className={`text-xl ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`} />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}>{quiz.title}</h1>
                    <div className={`flex items-center gap-4 mt-2 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                      <span className="flex items-center gap-1">
                        <FaQuestionCircle className={`${
                          theme === "dark" ? "text-blue-400" : "text-blue-500"
                        }`} />
                        {quiz.questions.length} أسئلة
                      </span>
                      <span className="flex items-center gap-1">
                        <FaChartBar className={`${
                          theme === "dark" ? "text-green-400" : "text-green-500"
                        }`} />
                        {quiz.grade} - {quiz.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timer Circle */}
              <div className="relative">
                <div className="w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke={timeLeft < 300 ? "#ef4444" : "#4f46e5"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (calculateTimePercentage() * 314 / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-800'} ${
                      theme === "dark" ? (timeLeft < 300 ? 'text-red-400' : 'text-white') : ''
                    }`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FaClock className="text-sm" />
                      متبقي
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar with details */}
            <div className="space-y-4">
              <div className={`flex justify-between items-center text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
                    }`}></div>
                    التقدم: {currentQuestionIndex + 1} / {quiz.questions.length}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      theme === "dark" ? "bg-green-400" : "bg-green-500"
                    }`}></div>
                    تمت الإجابة: {answeredQuestions}
                  </span>
                </div>
                <span className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>{Math.round(progress)}%</span>
              </div>

              <div className={`w-full rounded-full h-3 overflow-hidden ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div
                  className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questions Navigation */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div
                className={`rounded-2xl shadow-xl p-6 h-fit sticky top-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>
                  <FaQuestionCircle className={`${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`} />
                  قائمة الأسئلة
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {quiz.questions.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !isFinished && setCurrentQuestionIndex(index)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 ${
                        currentQuestionIndex === index
                          ? 'bg-indigo-500 text-white shadow-lg scale-105'
                          : userAnswers[index] !== -1
                            ? theme === "dark"
                              ? 'bg-green-900/50 text-green-400 border-2 border-green-700'
                              : 'bg-green-100 text-green-600 border-2 border-green-300'
                            : theme === "dark"
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                      {userAnswers[index] !== -1 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-xs" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Quiz Stats */}
                <div className={`mt-6 pt-6 border-t space-y-4 ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        theme === "dark" ? "bg-green-900/50" : "bg-green-100"
                      }`}>
                        <FaCheckCircle className={`${
                          theme === "dark" ? "text-green-400" : "text-green-500"
                        }`} />
                      </div>
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        تمت الإجابة
                      </span>
                    </div>
                    <span className={`font-bold ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}>{answeredQuestions}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        theme === "dark" ? "bg-red-900/50" : "bg-red-100"
                      }`}>
                        <FaTimesCircle className={`${
                          theme === "dark" ? "text-red-400" : "text-red-500"
                        }`} />
                      </div>
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        متبقية
                      </span>
                    </div>
                    <span className={`font-bold ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}>{quiz.questions.length - answeredQuestions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question & Options */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div
                className={`rounded-2xl shadow-xl p-8 mb-6 border transform hover:-translate-y-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      theme === "dark"
                        ? "bg-linear-to-r from-indigo-900/50 to-purple-900/50"
                        : "bg-linear-to-r from-blue-100 to-indigo-100"
                    }`}>
                      <FaQuestionCircle className={`text-2xl ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                      }`} />
                    </div>
                    <div>
                      <div className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}>السؤال الحالي</div>
                      <div className={`text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>#{currentQuestionIndex + 1}</div>
                    </div>
                  </div>

                  <div className={`text-sm px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "text-gray-300 bg-gray-800/50"
                      : "text-gray-500 bg-gray-50"
                  }`}>
                    اختر الإجابة الصحيحة
                  </div>
                </div>

                <div className={`p-6 rounded-xl mb-8 ${
                  theme === "dark"
                    ? "bg-linear-to-r from-indigo-900/30 to-purple-900/30"
                    : "bg-linear-to-r from-blue-50 to-indigo-50"
                }`}>
                  <h2 className={`text-xl font-semibold mb-4 text-right leading-relaxed ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}>
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={isFinished || showFeedback}
                      className={`
                        w-full text-right p-5 rounded-xl border-2 transition-all duration-300
                        transform hover:-translate-y-1 hover:shadow-lg
                        ${userAnswers[currentQuestionIndex] === index
                          ? userAnswers[currentQuestionIndex] === quiz.questions[currentQuestionIndex].correct
                            ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-500 text-green-800 shadow-md'
                            : 'bg-linear-to-r from-red-50 to-rose-50 border-red-500 text-red-800 shadow-md'
                          : theme === "dark"
                            ? 'bg-gray-800/50 border-gray-600 text-white hover:border-indigo-400 hover:bg-indigo-900/30'
                            : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                        }
                        ${isFinished ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-center leading-10 ml-3
                          ${userAnswers[currentQuestionIndex] === index
                            ? userAnswers[currentQuestionIndex] === quiz.questions[currentQuestionIndex].correct
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : theme === "dark"
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }
                        `}>
                          {String.fromCharCode(1633 + index)}
                        </span>
                        <span className={`flex-1 text-right text-lg pr-4 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{option}</span>
                        {userAnswers[currentQuestionIndex] === index && (
                          <div className="text-xl">
                            {userAnswers[currentQuestionIndex] === quiz.questions[currentQuestionIndex].correct
                              ? <FaCheckCircle className="text-green-500" />
                              : <FaTimesCircle className="text-red-500" />
                            }
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className={`p-6 rounded-2xl mb-6 font-semibold text-lg shadow-lg transition-all duration-500 transform translate-y-0 ${isCorrect ? 'bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' : 'bg-linear-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'}`}>
                  <div className="flex items-center justify-center gap-3">
                    {isCorrect ? (
                      <>
                        <FaCheckCircle className="text-2xl text-green-500" />
                        <span>{feedbackMessage}</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-2xl text-red-500" />
                        <span>{feedbackMessage}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0 || isFinished}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed w-full sm:w-auto ${
                    theme === "dark"
                      ? "bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:from-gray-600 disabled:to-gray-700 text-white"
                      : "bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white"
                  }`}
                >
                  <MdNavigateBefore className="text-xl" />
                  السابق
                </button>

                <div className="flex-1 flex justify-center">
                  <div className={`text-center px-6 py-3 rounded-xl ${
                    theme === "dark"
                      ? "text-gray-300 bg-gray-800/50"
                      : "text-gray-600 bg-gray-100"
                  }`}>
                    <div className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}>{currentQuestionIndex + 1} / {quiz.questions.length}</div>
                    <div className="text-sm">الأسئلة</div>
                  </div>
                </div>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={finishQuiz}
                    disabled={isFinished}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    <FaFlagCheckered />
                    إنهاء الاختبار
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    disabled={isFinished}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    التالي
                    <MdNavigateNext className="text-xl" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
}
