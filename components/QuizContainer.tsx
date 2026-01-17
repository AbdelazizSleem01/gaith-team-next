import { useMemo } from 'react';
import { FaFileAlt, FaClock, FaQuestionCircle, FaCalendar, FaPlayCircle } from 'react-icons/fa';
import styles from './QuizContainer.module.css';

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

interface QuizContainerProps {
  quizzes: Quiz[];
}

export default function QuizContainer({ quizzes }: QuizContainerProps) {
  
  // eslint-disable-next-line react-hooks/purity
  const oneDayAgo = useMemo(() => Date.now() - 24 * 60 * 60 * 1000, []);

  if (quizzes.length === 0) {
    return (
      <div className="quiz-container">
        <div className="empty-state text-center p-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
          <FaFileAlt className="text-5xl text-indigo-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">لا توجد امتحانات متاحة</h3>
          <p className="text-white/70">سيتم إضافة امتحانات جديدة قريباً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {quizzes.map((quiz, index) => {
        const isNew = new Date(quiz.created).getTime() > oneDayAgo;

        return (
          <div
            key={quiz.id}
            className={`quiz-card bg-white/5 rounded-2xl p-6 mb-6 border border-white/10 hover:bg-white/10 transition-all duration-300 fade-in ${styles.quizCard}`}
            data-delay={index}
          >
            {isNew && <div className="new-badge">جديد</div>}

            <div className="quiz-header flex justify-between items-center mb-4">
              <div className="quiz-title flex items-center gap-3">
                <FaFileAlt className="text-indigo-400" />
                <span className="text-xl font-bold">{quiz.title}</span>
              </div>
              <div className="quiz-time-container flex items-center gap-2 text-white/70">
                <FaClock />
                <span>{quiz.time} دقيقة</span>
              </div>
            </div>

            <div className="quiz-badges mb-4">
              <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                {quiz.category}
              </span>
              <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                {quiz.grade}
              </span>
            </div>

            <div className="quiz-meta flex gap-4 mb-4 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <FaQuestionCircle />
                {quiz.questions.length} أسئلة
              </span>
              <span className="flex items-center gap-2">
                <FaCalendar />
                {new Date(quiz.created).toLocaleDateString('ar-SA')}
              </span>
            </div>

            {quiz.description && (
              <div className="quiz-description text-white/80 mb-6 leading-relaxed">
                {quiz.description}
              </div>
            )}

            <div className="quiz-start-container">
              <a
                href={`/quiz/${quiz.slug}`}
                className="telegram-link inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaPlayCircle />
                بدء الاختبار
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}