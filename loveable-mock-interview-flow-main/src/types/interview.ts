
export interface InterviewSession {
  id: string;
  role: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  domain: string;
  interviewType: 'behavioral' | 'technical' | 'mixed';
  mode: 'chat' | 'audio' | 'video';
  status: 'setup' | 'in-progress' | 'completed';
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  startTime?: Date;
  endTime?: Date;
  feedback?: InterviewFeedback;
  jobDescription?: string;
  isCustomRole: boolean;
  config: InterviewConfig;
}

export interface InterviewConfig {
  minQuestions: number;
  timePerQuestion: number; // in seconds
  focusAreas: string[];
}

export interface Question {
  id: string;
  text: string;
  type: 'behavioral' | 'technical';
  timeLimit: number;
  expectedKeywords?: string[];
  focusArea: string;
}

export interface Answer {
  questionId: string;
  text: string;
  audioUrl?: string;
  duration: number;
  timestamp: Date;
  score?: number;
  timeTaken: number;
}

export interface InterviewFeedback {
  totalScore: number;
  breakdown: {
    communication: number;
    problemSolving: number;
    technicalKnowledge: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  overallComment: string;
  timeEfficiency: number;
}

export interface UserProgress {
  totalSessions: number;
  averageScore: number;
  improvementTrend: number;
  badges: string[];
  lastSessionDate: Date;
}

export interface StandardRole {
  id: string;
  title: string;
  category: string;
  focusAreas: string[];
  description: string;
}
