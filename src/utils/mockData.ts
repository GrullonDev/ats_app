import type { Job, Applicant, DashboardStats, User } from '@/types';

/**
 * Datos de prueba para desarrollo y prototipado.
 * Reemplazar con llamadas reales a la API en producción.
 */

export const MOCK_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  role: 'admin',
  department: 'Human Resources',
  avatar: undefined,
};

export const MOCK_STATS: DashboardStats = {
  activeJobs: 12,
  totalApplicants: 245,
  hiredThisMonth: 8,
  applicantsGrowthPercent: 12,
  newApplicants: 42,
  inInterview: 18,
};

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    department: 'Design',
    location: 'San Francisco',
    type: 'full-time',
    status: 'active',
    applicantsCount: 42,
    newApplicantsToday: 2,
    postedDate: '2026-03-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'remote',
    status: 'active',
    applicantsCount: 118,
    scheduledInterviews: 8,
    postedDate: '2026-03-05T00:00:00Z',
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York',
    type: 'full-time',
    status: 'active',
    applicantsCount: 15,
    postedDate: '2026-03-20T00:00:00Z',
  },
];

export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'a1',
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    jobId: '1',
    jobTitle: 'Senior UI/UX Designer',
    status: 'interviewing',
    stage: 'interviewing',
    appliedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    rating: 4.8,
    isOnline: true,
  },
  {
    id: 'a2',
    name: 'Jordan Smith',
    email: 'jordan.smith@email.com',
    jobId: '2',
    jobTitle: 'Backend Developer',
    status: 'applied',
    stage: 'applied',
    appliedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  },
  {
    id: 'a3',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    jobId: '1',
    jobTitle: 'Senior UI/UX Designer',
    status: 'screening',
    stage: 'screening',
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    rating: 4.2,
  },
  {
    id: 'a4',
    name: 'Elena Rojas',
    email: 'elena.rojas@email.com',
    jobId: '1',
    jobTitle: 'Senior UI/UX Designer',
    status: 'interviewing',
    stage: 'psychometric_test',
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4.5,
  },
  {
    id: 'a5',
    name: 'Julian Casablancas',
    email: 'julian.c@email.com',
    jobId: '2',
    jobTitle: 'Backend Developer',
    status: 'hired',
    stage: 'hired',
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a6',
    name: 'Sarah Connor',
    email: 's.connor@email.com',
    jobId: '3',
    jobTitle: 'Product Manager',
    status: 'offered',
    stage: 'offered',
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4.9,
  },
];

export const MOCK_INTERVIEWS = [
  {
    id: 'i1',
    applicantId: 'a1',
    applicantName: 'Alex Rivera',
    jobTitle: 'Senior UI/UX Designer',
    time: '10:00 AM',
    duration: '60 min',
    type: 'Technical Interview',
    modality: 'Video Call',
    interviewers: ['Sarah Johnson', 'Mike Chen'],
    status: 'scheduled',
  },
  {
    id: 'i2',
    applicantId: 'a3',
    applicantName: 'Marcus Chen',
    jobTitle: 'Senior UI/UX Designer',
    time: '2:00 PM',
    duration: '30 min',
    type: 'Phone Screening',
    modality: 'Voice Call',
    interviewers: ['John Doe'],
    status: 'scheduled',
  },
];
