import { FaGraduationCap, FaArrowLeft } from 'react-icons/fa';
import styles from './GradeContainer.module.css';

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

interface GradeContainerProps {
  grades: string[];
  quizzes: Quiz[];
}

export default function GradeContainer({ grades, quizzes }: GradeContainerProps) {
  if (grades.length === 0) {
    return (
      <div className="empty-state text-center p-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 mb-8">
        <FaGraduationCap className="text-5xl text-indigo-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">لا توجد مواد متاحة</h3>
        <p className="text-white/70">سيتم إضافة مواد دراسية قريباً</p>
      </div>
    );
  }

  return (
    <div className="grade-container mb-8">
      {grades.map((grade, index) => {
        const gradeQuizzes = quizzes.filter(quiz => quiz.grade === grade);
        const quizCount = gradeQuizzes.length;
        const questionCount = gradeQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        return (
          <div
            key={grade}
            className={`grade-card bg-linear-to-r from-indigo-600 to-indigo-600 rounded-3xl p-6 mb-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 fade-in ${styles.gradeCard}`}
            data-delay={index}
          >
            <a href={`/grade/${grade.toLowerCase().replace(' ', '')}`} className="grade-link block text-white">
              <div className="card-content flex items-center gap-6">
                <div className="icon-wrapper w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FaGraduationCap className="text-3xl" />
                </div>
                <div className="card-text flex-1 text-right">
                  <h3 className="text-2xl font-bold mb-2">{grade}</h3>
                  <p className="text-white/80">{quizCount} كويز • {questionCount} سؤال</p>
                </div>
                <div className="arrow-icon text-2xl">
                  <FaArrowLeft />
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
