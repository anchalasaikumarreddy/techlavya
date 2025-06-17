
import { StandardRole } from '@/types/interview';

export const STANDARD_ROLES: StandardRole[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    focusAreas: ['Data Structures', 'Algorithms', 'System Design', 'Problem Solving'],
    description: 'Full-stack development, coding, and technical problem solving'
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Technology',
    focusAreas: ['React/Angular/Vue', 'JavaScript/TypeScript', 'CSS/HTML', 'User Experience'],
    description: 'User interface development and frontend technologies'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Technology',
    focusAreas: ['API Design', 'Database Design', 'Server Architecture', 'Security'],
    description: 'Server-side development and backend systems'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product',
    focusAreas: ['Product Strategy', 'User Research', 'Stakeholder Management', 'Analytics'],
    description: 'Product strategy, roadmap planning, and cross-functional leadership'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data',
    focusAreas: ['Machine Learning', 'Statistics', 'Python/R', 'Data Analysis'],
    description: 'Data analysis, machine learning, and statistical modeling'
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    category: 'Design',
    focusAreas: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    description: 'User experience design and research'
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Marketing',
    focusAreas: ['Digital Marketing', 'Campaign Strategy', 'Analytics', 'Brand Management'],
    description: 'Marketing strategy, campaigns, and brand management'
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Business',
    focusAreas: ['Requirements Analysis', 'Process Improvement', 'Stakeholder Management', 'Documentation'],
    description: 'Business process analysis and requirements gathering'
  }
];

export const FOCUS_AREAS = [
  'Communication Skills',
  'Problem Solving',
  'Technical Knowledge',
  'Leadership',
  'Teamwork',
  'Project Management',
  'Customer Focus',
  'Innovation',
  'Analytical Thinking',
  'Adaptability'
];
