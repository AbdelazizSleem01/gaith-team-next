import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';

    // If no filters, return optimized home data
    if (!grade && !category && !search) {
      const aggregationPipeline = [
        {
          $group: {
            _id: null,
            totalQuizzes: { $sum: 1 },
            totalQuestions: { $sum: { $size: '$questions' } },
            grades: { $addToSet: '$grade' },
            recentQuizzes: {
              $push: {
                id: '$id',
                slug: '$slug',
                title: '$title',
                description: '$description',
                grade: '$grade',
                category: '$category',
                time: '$time',
                questionCount: { $size: '$questions' },
                created: '$created',
                updated: '$updated'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalQuizzes: 1,
            totalQuestions: 1,
            grades: 1,
            recentQuizzes: { $slice: ['$recentQuizzes', 6] }
          }
        }
      ];

      const result = await Quiz.aggregate(aggregationPipeline);
      const data = result[0] || { totalQuizzes: 0, totalQuestions: 0, grades: [], recentQuizzes: [] };

      // Sort grades
      const gradeOrder = {
        "الفرقة الأولى": 1,
        "الفرقة الثانية": 2,
        "الفرقة الثالثة": 3,
        "الفرقة الرابعة": 4,
        خريجين: 5,
      };
      data.grades.sort((a: string, b: string) => {
        const orderA = gradeOrder[a as keyof typeof gradeOrder] || 999;
        const orderB = gradeOrder[b as keyof typeof gradeOrder] || 999;
        return orderA - orderB;
      });

      return NextResponse.json({
        success: true,
        data: data.recentQuizzes,
        grades: data.grades,
        stats: {
          quizCount: data.totalQuizzes,
          questionCount: data.totalQuestions
        }
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }

    // For filtered requests
    const query: Record<string, unknown> = {};

    if (grade && grade !== 'all') {
      query.grade = grade;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = limit ? parseInt(limit) : 10;
    const skip = (pageNum - 1) * limitNum;

    const quizzes = await Quiz.find(query)
      .select('-questions') // Exclude questions for performance
      .sort({ created: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Quiz.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: quizzes,
      count: total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, description, grade, category, time, questions, slug } = body;

    if (!title || !grade || !category || !time || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newQuiz = new Quiz({
      id,
      slug,
      title,
      description,
      grade,
      category,
      time,
      questions,
      updated: new Date(),
    });

    const savedQuiz = await newQuiz.save();

    return NextResponse.json({
      success: true,
      data: savedQuiz,
      message: 'Quiz created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating quiz:', error);

    const err = error as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Quiz ID already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
