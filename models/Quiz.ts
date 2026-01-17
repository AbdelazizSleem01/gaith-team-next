import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface IQuiz extends Document {
  id: string;
  slug: string;
  title: string;
  description?: string;
  grade: string;
  category: string;
  time: number; // in minutes
  questions: IQuestion[];
  created: Date;
  updated: Date;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .trim()
    .replace(/^-|-$/g, ''); 
}

const QuestionSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correct: {
    type: Number,
    required: true,
    min: 0,
  },
});

const QuizSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  grade: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
    min: 1,
  },
  questions: [QuestionSchema],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});



export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
