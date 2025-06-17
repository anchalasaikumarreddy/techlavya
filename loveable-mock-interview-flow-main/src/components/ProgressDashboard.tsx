
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/types/interview';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3, 
  Clock,
  Star,
  BookOpen
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onStartInterview: () => void;
}

export const ProgressDashboard = ({ progress, onStartInterview }: ProgressDashboardProps) => {
  const recentSessions = [
    { role: 'Software Engineer', score: 85, date: '2 days ago', company: 'Google' },
    { role: 'Product Manager', score: 78, date: '1 week ago', company: 'Meta' },
    { role: 'Data Scientist', score: 82, date: '2 weeks ago', company: 'Netflix' },
  ];

  const skillProgress = [
    { skill: 'Communication', current: 85, target: 90 },
    { skill: 'Problem Solving', current: 78, target: 85 },
    { skill: 'Technical Skills', current: 82, target: 88 },
    { skill: 'Confidence', current: 75, target: 80 },
  ];

  const achievements = [
    { name: 'First Interview', icon: Star, earned: true },
    { name: 'Score Above 80', icon: Award, earned: true },
    { name: 'Consistent Performer', icon: TrendingUp, earned: false },
    { name: 'Technical Expert', icon: BookOpen, earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview Progress Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Track your improvement and ace your next interview
            </p>
          </div>
          
          <Button 
            onClick={onStartInterview}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3"
          >
            Start New Interview
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-900">{progress.totalSessions}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Average Score</p>
                  <p className="text-3xl font-bold text-green-900">{progress.averageScore}%</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Improvement</p>
                  <p className="text-3xl font-bold text-purple-900">+{progress.improvementTrend}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Last Session</p>
                  <p className="text-lg font-bold text-orange-900">2 days ago</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Recent Interview Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{session.role}</h3>
                          <Badge variant="outline">{session.company}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{session.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          session.score >= 80 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {session.score}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Progress */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Skill Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillProgress.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{skill.skill}</span>
                        <span className="text-sm text-gray-500">
                          {skill.current}% / {skill.target}% target
                        </span>
                      </div>
                      <Progress value={(skill.current / skill.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          achievement.earned 
                            ? 'bg-yellow-50 border border-yellow-200' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${
                          achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </span>
                        {achievement.earned && (
                          <Badge variant="default" className="ml-auto bg-yellow-500">
                            Earned
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions Completed</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours Practiced</span>
                    <span className="font-bold">2.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-green-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
