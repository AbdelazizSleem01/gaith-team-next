import type { Metadata } from 'next';
import GradePageClient from './GradePageClient';

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
  'grade1': 'الفرقة الأولى',
  'grade2': 'الفرقة الثانية',
  'grade3': 'الفرقة الثالثة',
  'grade4': 'الفرقة الرابعة',
};

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const gradeParam = resolvedParams.grade;
  const gradeName = gradeNames[gradeParam] || gradeParam || 'الفرقة الدراسية';

  return {
    title: `${gradeName} - GAITH TEAM`,
    description: `اختبارات التمريض لـ ${gradeName}. اختبر نفسك في جميع فروع التمريض مع نظام أمان متقدم وتجربة تفاعلية مميزة من GAITH TEAM.`,
    keywords: [`${gradeName}`, 'تمريض', 'اختبارات تمريض', 'كويز تمريض', 'GAITH TEAM', 'الامتحان في جيبك'],
    openGraph: {
      title: `${gradeName} - GAITH TEAM`,
      description: `اختبارات التمريض لـ ${gradeName}. اختبر نفسك في جميع فروع التمريض مع نظام أمان متقدم وتجربة تفاعلية مميزة.`,
      type: 'website',
    },
  };
}

export default function GradePage() {
  return <GradePageClient />;
}
