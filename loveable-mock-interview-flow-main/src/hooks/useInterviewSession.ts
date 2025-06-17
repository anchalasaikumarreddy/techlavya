
import { useState, useCallback } from 'react';
import { InterviewSession, Question, Answer, InterviewFeedback, InterviewConfig } from '@/types/interview';
import { toast } from '@/hooks/use-toast';

// Mock questions organized by focus areas
const MOCK_QUESTIONS: Record<string, Question[]> = {
  'Communication Skills': [
    {
      id: '1',
      text: 'Tell me about a time when you had to explain a complex technical concept to a non-technical stakeholder.',
      type: 'behavioral',
      timeLimit: 180,
      focusArea: 'Communication Skills'
    },
    {
      id: '2',
      text: 'Describe a situation where you had to present your ideas to a team that initially disagreed with your approach.',
      type: 'behavioral',
      timeLimit: 180,
      focusArea: 'Communication Skills'
    }
  ],
  'Problem Solving': [
    {
      id: '3',
      text: 'Walk me through your approach to solving a problem you\'ve never encountered before.',
      type: 'behavioral',
      timeLimit: 240,
      focusArea: 'Problem Solving'
    },
    {
      id: '4',
      text: 'How would you optimize a slow-performing application without knowing the root cause?',
      type: 'technical',
      timeLimit: 300,
      focusArea: 'Problem Solving'
    }
  ],
  'Technical Knowledge': [
    {
      id: '5',
      text: 'Explain the difference between synchronous and asynchronous programming with examples.',
      type: 'technical',
      timeLimit: 300,
      focusArea: 'Technical Knowledge'
    },
    {
      id: '6',
      text: 'How would you design a scalable system for handling millions of user requests?',
      type: 'technical',
      timeLimit: 420,
      focusArea: 'Technical Knowledge'
    }
  ],
  'Leadership': [
    {
      id: '7',
      text: 'Tell me about a time when you had to lead a team through a challenging project.',
      type: 'behavioral',
      timeLimit: 180,
      focusArea: 'Leadership'
    }
  ]
};

export const useInterviewSession = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = useCallback(async (config: {
    role: string;
    experienceLevel: InterviewSession['experienceLevel'];
    domain: string;
    interviewType: InterviewSession['interviewType'];
    mode: InterviewSession['mode'];
    jobDescription?: string;
    isCustomRole: boolean;
    focusAreas: string[];
    minQuestions: number;
  }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to generate questions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate questions based on focus areas
      const questions: Question[] = [];
      config.focusAreas.forEach(area => {
        const areaQuestions = MOCK_QUESTIONS[area] || [];
        questions.push(...areaQuestions.slice(0, Math.ceil(config.minQuestions / config.focusAreas.length)));
      });

      // Ensure we have at least minQuestions
      while (questions.length < config.minQuestions) {
        const allQuestions = Object.values(MOCK_QUESTIONS).flat();
        const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        if (!questions.find(q => q.id === randomQuestion.id)) {
          questions.push(randomQuestion);
        }
      }

      const interviewConfig: InterviewConfig = {
        minQuestions: config.minQuestions,
        timePerQuestion: 180, // 3 minutes default
        focusAreas: config.focusAreas
      };

      const newSession: InterviewSession = {
        id: crypto.randomUUID(),
        role: config.role,
        experienceLevel: config.experienceLevel,
        domain: config.domain,
        interviewType: config.interviewType,
        mode: config.mode,
        status: 'in-progress',
        questions: questions.slice(0, config.minQuestions),
        currentQuestionIndex: 0,
        answers: [],
        startTime: new Date(),
        jobDescription: config.jobDescription,
        isCustomRole: config.isCustomRole,
        config: interviewConfig
      };

      setSession(newSession);
      toast({
        title: "Interview Started",
        description: `Your mock interview session has begun with ${config.minQuestions} questions. Good luck!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start interview session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback((answerText: string, timeTaken: number) => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const answer: Answer = {
      questionId: currentQuestion.id,
      text: answerText,
      duration: answerText.length * 0.5, // Mock duration based on text length
      timestamp: new Date(),
      score: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
      timeTaken: timeTaken
    };

    setSession(prev => {
      if (!prev) return null;
      
      const updatedAnswers = [...prev.answers, answer];
      const nextIndex = prev.currentQuestionIndex + 1;
      
      return {
        ...prev,
        answers: updatedAnswers,
        currentQuestionIndex: nextIndex,
        status: nextIndex >= prev.questions.length ? 'completed' : 'in-progress',
        endTime: nextIndex >= prev.questions.length ? new Date() : undefined,
      };
    });

    toast({
      title: "Answer Submitted",
      description: session.currentQuestionIndex + 1 < session.questions.length ? "Moving to the next question..." : "Interview completed!",
    });
  }, [session]);

  const continueInterview = useCallback((additionalQuestions: number) => {
    if (!session) return;

    // Add more questions from focus areas
    const allQuestions = Object.values(MOCK_QUESTIONS).flat();
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < additionalQuestions; i++) {
      const availableQuestions = allQuestions.filter(q => 
        !session.questions.find(sq => sq.id === q.id) && 
        !newQuestions.find(nq => nq.id === q.id)
      );
      
      if (availableQuestions.length > 0) {
        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        newQuestions.push(randomQuestion);
      }
    }

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        questions: [...prev.questions, ...newQuestions],
        status: 'in-progress'
      };
    });

    toast({
      title: "Questions Added",
      description: `${newQuestions.length} additional questions added to your interview.`,
    });
  }, [session]);

  const generateFeedback = useCallback(async (): Promise<InterviewFeedback> => {
    // Simulate AI feedback generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const averageScore = session?.answers.reduce((sum, answer) => sum + (answer.score || 0), 0) / (session?.answers.length || 1);
    const averageTime = session?.answers.reduce((sum, answer) => sum + answer.timeTaken, 0) / (session?.answers.length || 1);
    const timeEfficiency = averageTime < 120 ? 90 : averageTime < 180 ? 75 : 60;
    
    return {
      totalScore: Math.round(averageScore),
      breakdown: {
        communication: Math.floor(Math.random() * 30) + 70,
        problemSolving: Math.floor(Math.random() * 30) + 70,
        technicalKnowledge: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 30) + 70,
      },
      strengths: [
        "Clear communication style",
        "Good problem-solving approach",
        "Confident delivery",
      ],
      improvements: [
        "Provide more specific examples",
        "Structure answers using STAR method",
        "Practice technical terminology",
      ],
      overallComment: "Great job! You showed strong potential. Focus on the suggested improvements for even better performance.",
      timeEfficiency: timeEfficiency
    };
  }, [session]);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    isLoading,
    startInterview,
    submitAnswer,
    continueInterview,
    generateFeedback,
    resetSession,
  };
};
