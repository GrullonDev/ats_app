import { create } from 'zustand';
import type { Job, Applicant, DashboardStats } from '../types';
import { MOCK_JOBS, MOCK_STATS } from '@utils/mockData';

interface ATSState {
  // Dashboard
  stats: DashboardStats;
  activeJobs: Job[];
  recentApplicants: Applicant[];
  isLoadingDashboard: boolean;

  // Acciones
  setStats: (stats: DashboardStats) => void;
  setActiveJobs: (jobs: Job[]) => void;
  setRecentApplicants: (applicants: Applicant[]) => void;
  setLoadingDashboard: (loading: boolean) => void;
}

/**
 * Store principal con datos del ATS (vacantes, aplicantes, estadísticas).
 */
export const useATSStore = create<ATSState>((set) => ({
  stats: MOCK_STATS,
  activeJobs: MOCK_JOBS,
  recentApplicants: [],
  isLoadingDashboard: false,

  setStats: (stats) => set({ stats }),
  setActiveJobs: (jobs) => set({ activeJobs: jobs }),
  setRecentApplicants: (applicants) => set({ recentApplicants: applicants }),
  setLoadingDashboard: (loading) => set({ isLoadingDashboard: loading }),
}));

