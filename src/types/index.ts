/**
 * Tipos principales del dominio ATS
 */

// ─────────────────────────────────────────────
// Autenticación
// ─────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer';

// ─────────────────────────────────────────────
// Empleos / Vacantes
// ─────────────────────────────────────────────
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  applicantsCount: number;
  newApplicantsToday?: number;
  scheduledInterviews?: number;
  postedDate: string; // ISO 8601
  closingDate?: string;
}

export type JobStatus = 'active' | 'closed' | 'draft' | 'paused';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';

// ─────────────────────────────────────────────
// Candidatos / Aplicantes
// ─────────────────────────────────────────────
export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  department?: string;
  isRemote?: boolean;
  jobId: string;
  jobTitle?: string;
  status: ApplicantStatus;
  stage: HiringStage;
  appliedDate: string;
  resumeUrl?: string;
  score?: number;
  rating?: number;
  matchScore?: number; // 0-5.0 score
  notes?: string;
  isOnline?: boolean;
  lastActivityDate?: string;
  urgency?: 'new_today' | 'interview_today' | 'awaiting_review' | 'offer_pending' | 'stalled';
}

export type ApplicantStatus =
  | 'new'
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'psychometric_test'
  | 'selection'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type HiringStage =
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'psychometric_test'
  | 'selection'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

// ─────────────────────────────────────────────
// Estadísticas del Dashboard
// ─────────────────────────────────────────────
export interface DashboardStats {
  activeJobs: number;
  totalApplicants: number;
  hiredThisMonth: number;
  applicantsGrowthPercent: number;
  newApplicants?: number;
  inInterview?: number;
}

// ─────────────────────────────────────────────
// Internacionalización
// ─────────────────────────────────────────────
export type SupportedLanguage = 'es' | 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}
