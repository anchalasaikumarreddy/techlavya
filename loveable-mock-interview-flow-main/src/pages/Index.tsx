import { useState } from 'react';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { RoleSelection } from '@/components/RoleSelection';
import { InterviewSession } from '@/components/InterviewSession';
import { FeedbackView } from '@/components/FeedbackView';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { InterviewFeedback, UserProgress } from '@/types/interview';

type AppState = 'dashboard' | 'setup' | 'interview' | 'feedback';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('dashboard'); // Start with dashboard
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [hasCompletedInterview, setHasCompletedInterview] = useState(false);
  
  const { session, isLoading, startInterview, submitAnswer, continueInterview, generateFeedback, resetSession } = useInterviewSession();

  // Mock user progress data
  const userProgress: UserProgress = {
    totalSessions: 12,
    averageScore: 82,
    improvementTrend: 15,
    badges: ['First Interview', 'Score Above 80'],
    lastSessionDate: new Date(),
  };

  const handleStartInterview = async (config: Parameters<typeof startInterview>[0]) => {
    await startInterview(config);
    setAppState('interview');
  };

  const handleSubmitAnswer = (answer: string, timeTaken: number) => {
    submitAnswer(answer, timeTaken);
  };

  const handleContinueInterview = (additionalQuestions: number) => {
    continueInterview(additionalQuestions);
  };

  const handleEndInterview = async () => {
    const interviewFeedback = await generateFeedback();
    setFeedback(interviewFeedback);
    setHasCompletedInterview(true);
    setAppState('feedback');
  };

  const handleStartNew = () => {
    resetSession();
    setFeedback(null);
    setAppState('setup');
  };

  const handleBackToDashboard = () => {
    resetSession();
    setFeedback(null);
    setAppState('dashboard');
  };

  const handleStartFromDashboard = () => {
    setAppState('setup');
  };

  console.log('Current app state:', appState);
  console.log('Session status:', session?.status);
  console.log('Loading state:', isLoading);

  if (appState === 'dashboard') {
    return (
      <ProgressDashboard 
        progress={userProgress} 
        onStartInterview={handleStartFromDashboard}
      />
    );
  }

  if (appState === 'setup') {
    return (
      <RoleSelection 
        onStartInterview={handleStartInterview}
        onBack={hasCompletedInterview ? handleBackToDashboard : undefined}
        isLoading={isLoading}
      />
    );
  }

  if (appState === 'interview' && session) {
    return (
      <InterviewSession
        session={session}
        onSubmitAnswer={handleSubmitAnswer}
        onContinueInterview={handleContinueInterview}
        onEndInterview={handleEndInterview}
      />
    );
  }

  if (appState === 'feedback' && feedback) {
    return (
      <FeedbackView
        feedback={feedback}
        onStartNew={handleStartNew}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Fallback - should not happen in normal flow
  return (
    <ProgressDashboard 
      progress={userProgress} 
      onStartInterview={handleStartFromDashboard}
    />
  );
};

export default Index;
