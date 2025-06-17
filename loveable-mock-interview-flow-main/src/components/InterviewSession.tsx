
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InterviewSession as IInterviewSession } from '@/types/interview';
import { Clock, MessageSquare, ArrowRight, Plus, CheckCircle } from 'lucide-react';

interface InterviewSessionProps {
  session: IInterviewSession;
  onSubmitAnswer: (answer: string, timeTaken: number) => void;
  onContinueInterview: (additionalQuestions: number) => void;
  onEndInterview: () => void;
}

export const InterviewSession = ({ 
  session, 
  onSubmitAnswer, 
  onContinueInterview, 
  onEndInterview 
}: InterviewSessionProps) => {
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [showContinueOption, setShowContinueOption] = useState(false);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const isMinimumReached = session.currentQuestionIndex + 1 >= session.config.minQuestions;
  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

  useEffect(() => {
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit);
      setQuestionStartTime(new Date());
    }
  }, [currentQuestion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.currentQuestionIndex]);

  const handleSubmit = useCallback(() => {
    if (answer.trim()) {
      const timeTaken = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
      onSubmitAnswer(answer.trim(), timeTaken);
      setAnswer('');
      
      // Show continue option if minimum questions reached and not last question
      if (isMinimumReached && isLastQuestion) {
        setShowContinueOption(true);
      }
    }
  }, [answer, questionStartTime, onSubmitAnswer, isMinimumReached, isLastQuestion]);

  const handleContinue = (additionalQuestions: number) => {
    onContinueInterview(additionalQuestions);
    setShowContinueOption(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show continue/complete option after minimum questions
  if (showContinueOption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Minimum Questions Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                You've completed {session.config.minQuestions} questions successfully!
              </p>
              <p className="text-sm text-gray-600">
                You can choose to continue with more questions or proceed to get your feedback.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleContinue(3)}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">3 More Questions</span>
              </Button>
              
              <Button
                onClick={() => handleContinue(5)}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">5 More Questions</span>
              </Button>
              
              <Button
                onClick={onEndInterview}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex flex-col items-center gap-2 h-auto py-4"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Get Feedback</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Interview Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Great job! You answered {session.answers.length} questions. Your responses are being analyzed.
            </p>
            <Button 
              onClick={onEndInterview}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              View Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.role} Interview
              </h1>
              <p className="text-gray-600">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
                {isMinimumReached && (
                  <span className="ml-2 text-green-600 font-medium">
                    (Minimum reached ✓)
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Mode
              </Badge>
              
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                timeRemaining <= 30 ? 'bg-red-100 text-red-700' : 
                timeRemaining <= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress: {Math.round(progress)}%</span>
              <span>
                {session.answers.length} answered, {session.questions.length - session.currentQuestionIndex} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {session.currentQuestionIndex + 1}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant={currentQuestion?.type === 'behavioral' ? 'default' : 'secondary'}>
                  {currentQuestion?.type}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion?.focusArea}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-gray-800">
              {currentQuestion?.text}
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) for behavioral questions. 
                Be specific and provide concrete examples.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Your Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific, provide examples, and structure your response clearly."
              className="min-h-[150px] resize-none border-gray-200 focus:border-blue-500"
              autoFocus
            />
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{answer.length} characters</span>
              <span>
                Time taken: {Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)}s
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLastQuestion && isMinimumReached ? 'Complete Question' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button variant="outline" onClick={() => setAnswer('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
