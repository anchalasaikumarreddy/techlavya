
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { InterviewSession } from '@/types/interview';
import { Briefcase, Brain, MessageSquare, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { STANDARD_ROLES, FOCUS_AREAS } from '@/data/standardRoles';

interface RoleSelectionProps {
  onStartInterview: (config: {
    role: string;
    experienceLevel: InterviewSession['experienceLevel'];
    domain: string;
    interviewType: InterviewSession['interviewType'];
    mode: InterviewSession['mode'];
    jobDescription?: string;
    isCustomRole: boolean;
    focusAreas: string[];
    minQuestions: number;
  }) => void;
  onBack?: () => void;
  isLoading: boolean;
}

export const RoleSelection = ({ onStartInterview, onBack, isLoading }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<InterviewSession['experienceLevel']>('mid');
  const [domain, setDomain] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewSession['interviewType']>('mixed');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [minQuestions, setMinQuestions] = useState(5);
  const [roleSelectionType, setRoleSelectionType] = useState<'standard' | 'custom' | 'job-description'>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with:', {
      roleSelectionType,
      selectedRole,
      customRole,
      domain,
      jobDescription,
      selectedFocusAreas
    });
    
    let finalRole = '';
    let finalFocusAreas = selectedFocusAreas;
    
    if (roleSelectionType === 'standard' && selectedRole) {
      const role = STANDARD_ROLES.find(r => r.id === selectedRole);
      finalRole = role?.title || '';
      if (finalFocusAreas.length === 0) {
        finalFocusAreas = role?.focusAreas || [];
      }
    } else if (roleSelectionType === 'custom' && customRole.trim()) {
      finalRole = customRole.trim();
    } else if (roleSelectionType === 'job-description' && jobDescription.trim()) {
      finalRole = 'Custom Role (from Job Description)';
      if (finalFocusAreas.length === 0) {
        finalFocusAreas = ['Communication Skills', 'Problem Solving', 'Technical Knowledge'];
      }
    }

    console.log('Final values:', {
      finalRole,
      domain: domain.trim(),
      finalFocusAreas
    });

    if (!finalRole || !domain.trim() || finalFocusAreas.length === 0) {
      console.log('Validation failed - missing required fields');
      return;
    }

    console.log('Starting interview with config...');
    onStartInterview({
      role: finalRole,
      experienceLevel,
      domain: domain.trim(),
      interviewType,
      mode: 'chat',
      jobDescription: roleSelectionType === 'job-description' ? jobDescription : undefined,
      isCustomRole: roleSelectionType !== 'standard',
      focusAreas: finalFocusAreas,
      minQuestions
    });
  };

  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const getSelectedRoleInfo = () => {
    if (roleSelectionType === 'standard' && selectedRole) {
      return STANDARD_ROLES.find(r => r.id === selectedRole);
    }
    return null;
  };

  const selectedRoleInfo = getSelectedRoleInfo();

  // Check if form is valid
  const isFormValid = () => {
    const hasRole = (roleSelectionType === 'standard' && selectedRole) ||
                   (roleSelectionType === 'custom' && customRole.trim()) ||
                   (roleSelectionType === 'job-description' && jobDescription.trim());
    
    const hasDomain = domain.trim() !== '';
    
    const hasFocusAreas = selectedFocusAreas.length > 0 || 
                         (roleSelectionType === 'standard' && selectedRoleInfo?.focusAreas?.length > 0) ||
                         (roleSelectionType === 'job-description');
    
    return hasRole && hasDomain && hasFocusAreas;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Mock Interview
          </h1>
          <p className="text-xl text-gray-600">
            Practice with AI and get instant feedback to ace your next interview
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Briefcase className="text-blue-600" />
              Setup Your Interview
            </CardTitle>
            <CardDescription className="text-lg">
              Choose a role and customize your practice session
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection Type */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">How would you like to define the role?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { type: 'standard', label: 'Standard Roles', icon: Briefcase },
                    { type: 'custom', label: 'Custom Role', icon: Brain },
                    { type: 'job-description', label: 'Job Description', icon: Upload }
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRoleSelectionType(type as any)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        roleSelectionType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Role Selection */}
              {roleSelectionType === 'standard' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Role *</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Choose a standard role" />
                    </SelectTrigger>
                    <SelectContent>
                      {STANDARD_ROLES.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.title}</span>
                            <span className="text-xs text-gray-500">{role.category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRoleInfo && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{selectedRoleInfo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoleInfo.focusAreas.map(area => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Role Input */}
              {roleSelectionType === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customRole" className="text-sm font-medium">
                    Custom Role *
                  </Label>
                  <Input
                    id="customRole"
                    placeholder="e.g., Senior DevOps Engineer, AI Research Scientist"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Job Description */}
              {roleSelectionType === 'job-description' && (
                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-sm font-medium">
                    Job Description *
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the complete job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[120px] border-gray-200 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Our AI will analyze the job description to create relevant interview questions
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-sm font-medium">
                    Company/Domain *
                  </Label>
                  <Input
                    id="domain"
                    placeholder="e.g., Google, Healthcare, Fintech"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={(value: InterviewSession['experienceLevel']) => setExperienceLevel(value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="executive">Executive (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Interview Type</Label>
                  <Select value={interviewType} onValueChange={(value: InterviewSession['interviewType']) => setInterviewType(value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">Behavioral Only</SelectItem>
                      <SelectItem value="technical">Technical Only</SelectItem>
                      <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Minimum Questions</Label>
                  <Select value={minQuestions.toString()} onValueChange={(value) => setMinQuestions(parseInt(value))}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Questions</SelectItem>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="8">8 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Focus Areas Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Focus Areas {selectedFocusAreas.length > 0 && `(${selectedFocusAreas.length} selected)`}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FOCUS_AREAS.map(area => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleFocusArea(area)}
                      className={`p-2 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                        selectedFocusAreas.includes(area)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {selectedFocusAreas.includes(area) && <CheckCircle className="w-4 h-4" />}
                      {area}
                    </button>
                  ))}
                </div>
                {selectedFocusAreas.length === 0 && roleSelectionType === 'standard' && selectedRoleInfo && (
                  <p className="text-xs text-blue-600">
                    Default focus areas from selected role will be used
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Chat Mode Only</span>
                </div>
                <p className="text-sm text-blue-700">
                  This interview will be conducted in chat mode. Audio and video options are coming soon!
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Preparing Your Interview...
                  </div>
                ) : (
                  <>
                    Start Mock Interview
                    <MessageSquare className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
