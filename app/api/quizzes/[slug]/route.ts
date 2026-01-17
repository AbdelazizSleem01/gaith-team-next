import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    let quiz = await Quiz.findOne({ slug: slug });

    if (!quiz) {
      quiz = await Quiz.findOne({ id: slug });
    }

    if (!quiz) {
      return NextResponse.json(
        { success: false, message: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quiz
    });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const body = await request.json();
    const { title, description, grade, category, time, questions } = body;

    // Validate required fields
    if (!title || !grade || !category || !time || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { id: slug },
      {
        title,
        description,
        grade,
        category,
        time,
        questions,
        updated: new Date()
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json(
        { success: false, message: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedQuiz,
      message: 'Quiz updated successfully'
    });

  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const deletedQuiz = await Quiz.findOneAndDelete({ id: slug });

    if (!deletedQuiz) {
      return NextResponse.json(
        { success: false, message: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
