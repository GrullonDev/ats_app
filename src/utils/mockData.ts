import type { Job, Applicant, DashboardStats, User } from '@/types/index';

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
    name: 'Maria García',
    email: 'maria@email.com',
    jobId: '1',
    status: 'interviewing',
    stage: 'final_interview',
    appliedDate: '2026-04-01T22:00:00Z',
    score: 88,
  },
  {
    id: 'a2',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    jobId: '2',
    status: 'screening',
    stage: 'phone_screen',
    appliedDate: '2026-04-01T20:00:00Z',
    score: 92,
  },
  {
    id: 'a3',
    name: 'Elena Beltrán',
    email: 'elena@email.com',
    jobId: '1',
    status: 'new',
    stage: 'application',
    appliedDate: '2026-04-01T15:00:00Z',
    score: 0,
  },
  {
    id: 'a4',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    jobId: '3',
    status: 'offered',
    stage: 'offer',
    appliedDate: '2026-03-25T10:00:00Z',
    score: 95,
  },
  {
    id: 'a5',
    name: 'Sofía Martínez',
    email: 'sofia@email.com',
    jobId: '2',
    status: 'interviewing',
    stage: 'technical',
    appliedDate: '2026-04-01T18:00:00Z',
    score: 85,
  },
  {
    id: 'a6',
    name: 'Ricardo Lima',
    email: 'ricardo@email.com',
    jobId: '1',
    status: 'rejected',
    stage: 'culture_fit',
    appliedDate: '2026-03-28T09:00:00Z',
    score: 65,
  },
  {
    id: 'a7',
    name: 'Lucía Fernández',
    email: 'lucia@email.com',
    jobId: '2',
    status: 'hired',
    stage: 'onboarding',
    appliedDate: '2026-03-20T14:00:00Z',
    score: 98,
  },
];
