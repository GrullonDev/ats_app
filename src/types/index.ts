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
  avatar?: string;
  jobId: string;
  jobTitle?: string; // Título opcional del puesto para visualización
  status: ApplicantStatus;
  stage: HiringStage;
  appliedDate: string; // ISO 8601
  resumeUrl?: string;
  score?: number; // 0-100 (interno)
  rating?: number; // 0-5.0 (estrellas)
  notes?: string;
  isOnline?: boolean;
}

export type ApplicantStatus =
  | 'new'
  | 'applied'
  | 'screening'
  | 'interviewing'
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
  | 'onboarding'
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
