
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InterviewFeedback } from '@/types/interview';
import { Trophy, TrendingUp, Target, RefreshCw, Share2, Download } from 'lucide-react';

interface FeedbackViewProps {
  feedback: InterviewFeedback;
  onStartNew: () => void;
  onBackToDashboard: () => void;
}

export const FeedbackView = ({ feedback, onStartNew, onBackToDashboard }: FeedbackViewProps) => {
  const [animatedScores, setAnimatedScores] = useState({
    total: 0,
    communication: 0,
    problemSolving: 0,
    technicalKnowledge: 0,
    confidence: 0,
  });

  useEffect(() => {
    const animateScores = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        const progress = Math.min(step / steps, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedScores({
          total: Math.round(feedback.totalScore * easeOut),
          communication: Math.round(feedback.breakdown.communication * easeOut),
          problemSolving: Math.round(feedback.breakdown.problemSolving * easeOut),
          technicalKnowledge: Math.round(feedback.breakdown.technicalKnowledge * easeOut),
          confidence: Math.round(feedback.breakdown.confidence * easeOut),
        });
        
        step++;
        if (step > steps) clearInterval(timer);
      }, interval);
    };

    animateScores();
  }, [feedback]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 70) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { text: 'Fair', variant: 'outline' as const };
    return { text: 'Needs Work', variant: 'destructive' as const };
  };

  const badge = getScoreBadge(feedback.totalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
          </div>
          <p className="text-xl text-gray-600">
            Here's how you performed in your mock interview
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(animatedScores.total)}`}>
                {animatedScores.total}%
              </div>
              <Badge variant={badge.variant} className="text-lg px-4 py-1 mb-4">
                {badge.text}
              </Badge>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {feedback.overallComment}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Skill Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'communication', label: 'Communication' },
                { key: 'problemSolving', label: 'Problem Solving' },
                { key: 'technicalKnowledge', label: 'Technical Knowledge' },
                { key: 'confidence', label: 'Confidence' },
              ].map(({ key, label }) => {
                const score = animatedScores[key as keyof typeof animatedScores];
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Strengths & Improvements */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Trophy className="w-5 h-5" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Target className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStartNew}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
          
          <Button variant="outline" className="px-8 py-3">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          
          <Button variant="outline" className="px-8 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          
          <Button variant="ghost" onClick={onBackToDashboard} className="px-8 py-3">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
