import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { Card } from '@components/ui/Card';
import { StatusBadge } from '@components/ui/StatusBadge';
import { useTranslation } from '@hooks/useTranslation';
import { useAuthStore } from '@store/authStore';
import { useATSStore } from '@store/atsStore';
import type { Job, Applicant } from '@/types';
import { MOCK_JOBS, MOCK_USER, MOCK_STATS, MOCK_APPLICANTS } from '@utils/mockData';
import { verticalScale, moderateScale, scale } from '@utils/responsive';
import { getTimeAgo } from '@utils/dateUtils';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: string;
  onPress?: () => void;
  variant?: 'blue' | 'green' | 'red' | 'purple';
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtitle,
  icon,
  onPress,
  variant = 'blue',
}) => {
  const variantStyles = {
    blue: { bg: Colors.primary[50], icon: Colors.primary[700] },
    green: { bg: Colors.accent.greenLight, icon: Colors.accent.green },
    red: { bg: Colors.accent.redLight, icon: Colors.accent.red },
    purple: { bg: Colors.accent.purpleLight, icon: Colors.accent.purple },
  };
  
  const colors = variantStyles[variant];

  return (
    <TouchableOpacity
      style={styles.kpiCard}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <View style={[styles.kpiIconWrapper, { backgroundColor: colors.bg }]}>
        <Ionicons name={icon as any} size={18} color={colors.icon} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiSubtitle}>{subtitle}</Text>
      {onPress && (
        <View style={styles.kpiActionHint}>
          <Ionicons name="arrow-forward" size={12} color={Colors.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Tarjeta de estadística
// ─────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  highlight?: boolean;
  growthPercent?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  highlight = false,
  growthPercent,
}) => {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <View style={styles.statHeader}>
        <Text style={[styles.statCardLabel, highlight && styles.statLabelHighlight]}>{label}</Text>
        {growthPercent !== undefined && (
          <View style={styles.growthRow}>
            <Ionicons
              name="trending-up"
              size={12}
              color={highlight ? Colors.white : Colors.accent.green}
            />
            <Text style={[styles.growthText, highlight && styles.growthTextHighlight]}>+{growthPercent}%</Text>
          </View>
        )}
      </View>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, highlight && styles.statSubtitleHighlight]}>{subtitle}</Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Filtro rápido (Chip)
// ─────────────────────────────────────────────
interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Tarjeta de vacante activa mejorada
// ─────────────────────────────────────────────
interface JobCardProps {
  job: Job;
  onPress?: () => void;
  key?: string | number;
}

const JobCard = ({ job, onPress }: JobCardProps) => {
  const { t } = useTranslation();

  // Mapeo de estado de vacante → variante del badge
  const statusVariantMap: Record<string, 'active' | 'interviewing' | 'urgent' | 'closed' | 'draft'> = {
    active: 'active',
    interviewing: 'interviewing',
    urgent: 'urgent',
    closed: 'closed',
    draft: 'draft',
  };

  // Label del badge con traducción
  const badgeLabelKey = job.scheduledInterviews ? 'interviewing' : job.status;

  // Calcular días activa para el demo
  const daysActive = Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <Card style={styles.jobCard} onPress={onPress}>
      <View style={styles.jobCardHeader}>
         <View style={styles.jobCardTitleMain}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
            <View style={styles.jobMetaSecondary}>
               <Text style={styles.jobDaysActive}>{t('welcome.daysActive', { count: daysActive })}</Text>
               <Text style={styles.jobMetaDot}>•</Text>
               <Text style={styles.jobTotalApplicants}>{job.applicantsCount} {t('welcome.jobMetrics.applicants')}</Text>
            </View>
         </View>
         <StatusBadge
          label={t(`welcome.filters.${badgeLabelKey}`)}
          variant={job.status as any}
        />
      </View>

      <View style={styles.jobCardFooter}>
         <ApplicantAvatarStack
            count={job.applicantsCount > 3 ? job.applicantsCount - 3 : undefined}
            filledSpots={Math.min(job.applicantsCount, 3)}
          />
          <TouchableOpacity style={styles.jobDetailBtn} activeOpacity={0.7} onPress={onPress}>
             <Text style={styles.jobDetailBtnText}>{t('welcome.viewDetails')}</Text>
             <Ionicons name="chevron-forward" size={14} color={Colors.primary[700]} />
          </TouchableOpacity>
      </View>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Stack de avatares de aplicantes
// ─────────────────────────────────────────────
interface ApplicantAvatarStackProps {
  filledSpots: number;
  count?: number; // Número adicional (+23, etc.)
}

const AVATAR_COLORS = [
  '#E0E7FF', // Indigo claro
  '#FEE2E2', // Rojo claro
  '#FEF3C7', // Ambar claro
  '#D1FAE5', // Esmeralda caro
];

const ICON_COLORS = [
  '#4338CA',
  '#EF4444',
  '#D97706',
  '#059669',
];

const ApplicantAvatarStack: React.FC<ApplicantAvatarStackProps> = ({
  filledSpots,
  count,
}) => {
  const spots = Array.from({ length: filledSpots }, (_, i) => i);

  return (
    <View style={styles.avatarStack}>
      {spots.map((_, index) => (
        <View
          key={index}
          style={[
            styles.avatarCircle,
            { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] },
            { marginLeft: index === 0 ? 0 : -10 },
          ]}
        >
          <Ionicons
            name="person"
            size={10}
            color={ICON_COLORS[index % ICON_COLORS.length]}
          />
        </View>
      ))}
      {count !== undefined && (
        <View style={[styles.avatarCircle, styles.avatarCount, { marginLeft: -10 }]}>
          <Text style={styles.avatarCountText}>+{count}</Text>
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Quick Action Button
// ─────────────────────────────────────────────
interface QuickActionProps {
  label: string;
  icon: string;
  onPress: () => void;
  primary?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({ label, icon, onPress, primary = false }) => {
  return (
    <TouchableOpacity
      style={[styles.quickAction, primary && styles.quickActionPrimary]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, primary && styles.quickActionIconPrimary]}>
        <Ionicons name={icon as any} size={18} color={primary ? Colors.white : Colors.primary[700]} />
      </View>
      <Text style={[styles.quickActionLabel, primary && styles.quickActionLabelPrimary]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Fila de Candidato Reciente
// ─────────────────────────────────────────────
const LatestCandidateRow = ({ candidate, onPress }: { candidate: Applicant, onPress: () => void }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.candidateRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.candidateAvatarSmall}>
        {candidate.avatar ? (
          <Image source={{ uri: candidate.avatar }} style={styles.avatarImageSmall} />
        ) : (
          <Text style={styles.avatarTextSmall}>{candidate.name.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.candidateInfoSmall}>
        <View style={styles.candidateRowTop}>
           <Text style={styles.candidateNameSmall}>{candidate.name}</Text>
           <Text style={styles.timeTextSmall}>{getTimeAgo(candidate.appliedDate, t)}</Text>
        </View>
        <Text style={styles.candidateJobSmall} numberOfLines={1}>{candidate.jobTitle}</Text>
        <View style={styles.candidateStageSmall}>
           <View style={styles.stageDotSmall} />
           <Text style={styles.stageTextSmall}>{t(`applicants.stages.${candidate.stage}`)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Item de "Needs Attention"
// ─────────────────────────────────────────────
const NeedsAttentionItem = ({ job, onPress }: { job: Job, onPress: () => void }) => {
  const { t } = useTranslation();
  const isHighPriority = job.applicantsCount > 25;
  
  return (
    <TouchableOpacity style={styles.attentionItem} activeOpacity={0.7} onPress={onPress}>
       <View style={[styles.priorityIndicator, { backgroundColor: isHighPriority ? Colors.accent.red : Colors.accent.orange }]} />
       <View style={styles.attentionContent}>
          <Text style={styles.attentionJobTitle} numberOfLines={1}>{job.title}</Text>
          <View style={styles.attentionMeta}>
             <Ionicons name="people-outline" size={12} color={Colors.textSecondary} />
             <Text style={styles.attentionCount}>{job.applicantsCount} {t('welcome.jobMetrics.applicants')}</Text>
          </View>
       </View>
       <View style={styles.attentionActions}>
          <View style={[styles.priorityBadge, { backgroundColor: isHighPriority ? Colors.accent.redLight : Colors.accent.orangeLight }]}>
             {isHighPriority && <Ionicons name="alert-circle" size={10} color={Colors.accent.red} style={{marginRight: 4}} />}
             <Text style={[styles.priorityBadgeText, { color: isHighPriority ? Colors.accent.red : Colors.accent.orange }]}>
                {isHighPriority ? t('welcome.highPriority') : t('welcome.mediumPriority')}
             </Text>
          </View>
          <TouchableOpacity style={styles.attentionCTA} onPress={onPress}>
             <Text style={styles.attentionCTAText}>{t('welcome.reviewNow')}</Text>
          </TouchableOpacity>
       </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Skeleton de carga
// ─────────────────────────────────────────────
const SkeletonItem = ({ style }: { style: any }) => (
  <View style={[styles.skeletonBase, style]} />
);

const DashboardSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.headerSkeleton}>
      <SkeletonItem style={{ width: 40, height: 40, borderRadius: 20 }} />
      <View style={{ gap: 8 }}>
        <SkeletonItem style={{ width: 100, height: 12 }} />
        <SkeletonItem style={{ width: 150, height: 16 }} />
      </View>
    </View>
    <SkeletonItem style={{ width: '100%', height: 48, borderRadius: 12, marginVertical: 20 }} />
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <SkeletonItem style={{ flex: 1, height: 110, borderRadius: 16 }} />
      <SkeletonItem style={{ flex: 1, height: 110, borderRadius: 16 }} />
    </View>
    <View style={{ marginTop: 20, gap: 12 }}>
      <SkeletonItem style={{ width: '100%', height: 120, borderRadius: 16 }} />
      <SkeletonItem style={{ width: '100%', height: 120, borderRadius: 16 }} />
    </View>
  </View>
);

// ─────────────────────────────────────────────
// Sub-componente: Estado Vacío / Error
// ─────────────────────────────────────────────
interface StateViewProps {
  title: string;
  message: string;
  icon: string;
  onRetry?: () => void;
}

const StateView: React.FC<StateViewProps> = ({ title, message, icon, onRetry }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.stateView}>
      <View style={styles.stateIconWrapper}>
        <Ionicons name={icon as any} size={48} color={Colors.gray[300]} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Pantalla principal: WelcomeScreen (Dashboard)
// ─────────────────────────────────────────────
import { useRouter } from 'expo-router';

type DashboardState = 'normal' | 'loading' | 'empty' | 'error' | 'zero';

export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [screenState, setScreenState] = React.useState<DashboardState>('normal');

  // En producción esto vendría del AuthStore
  const user = MOCK_USER;
  
  // Datos basados en el estado para simulación
  const activeJobs = MOCK_JOBS.filter(j => j.status === 'active');
  const sortedPriorityJobs = [...activeJobs].sort((a, b) => {
    return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime(); // Más antiguo primero = más días activa
  });

  const allCandidates = [...MOCK_APPLICANTS].sort((a, b) => 
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime() // Más reciente primero
  );
  
  const newsTodayCount = allCandidates.filter(c => {
    const diff = Date.now() - new Date(c.appliedDate).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }).length;

  const attentionJobs = [...activeJobs]
    .filter(j => j.applicantsCount > 15)
    .sort((a, b) => b.applicantsCount - a.applicantsCount); // Mayor cantidad de candidatos primero

  // Determinar datos según estado del demo
  const stats = screenState === 'zero' ? { activeJobs: 0, totalApplicants: 0 } : { 
    activeJobs: activeJobs.length, 
    totalApplicants: newsTodayCount 
  };

  const displayJobs = screenState === 'normal' ? sortedPriorityJobs : [];
  const displayCandidates = screenState === 'normal' ? allCandidates.slice(0, 5) : [];
  const displayAttention = screenState === 'normal' ? attentionJobs : [];

  // Modificar una vacante para que sea urgente en el mock
  const jobs = screenState === 'empty' || screenState === 'zero' ? [] : MOCK_JOBS; // Keep original `jobs` for other uses if needed
  const displayJobsWithUrgent = React.useMemo(() => {
    if (displayJobs.length > 0) {
      const newJobs = [...displayJobs];
      newJobs[0] = { ...newJobs[0], status: 'urgent' as any };
      return newJobs;
    }
    return jobs;
  }, [jobs]);

  if (screenState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />



      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header: saludo + notificaciones ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Avatar del usuario (más pequeño) */}
            <View style={styles.headerAvatar}>
              <Ionicons name="person" size={18} color={Colors.primary[700]} />
            </View>
            {/* Saludo estructurado basado en la propuesta final */}
            <View>
              <Text style={styles.headerGreetingLine1}>
                {t('common.greeting')}, {user.name.split(' ')[0]}
              </Text>
              <Text style={styles.headerGreetingLine2}>
                {t('welcome.dailySummaryAttention', { count: displayAttention.length })}
              </Text>
            </View>
          </View>

          {/* Botón de notificaciones mejorado */}
          <TouchableOpacity 
            style={styles.notificationBtn} 
            activeOpacity={0.8}
            onPress={() => console.log('Navigate to Notifications')}
          >
            <View style={styles.notificationIconWrapper}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.primary[700]}
              />
              {/* Badge de notificación más claro */}
              {displayAttention.length > 0 && <View style={styles.notificationDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Barra de búsqueda (Bloque 2) ── */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color={Colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('applicants.searchPlaceholder')}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color={Colors.primary[700]} />
          </TouchableOpacity>
        </View>

        {/* ── Chips de filtros rápidos ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip label={t('welcome.filters.all')} active />
          <FilterChip label={t('welcome.filters.active')} />
          <FilterChip label={t('welcome.filters.interviewing')} />
          <FilterChip label={t('welcome.filters.urgent')} />
        </ScrollView>

        {screenState === 'error' ? (
          <StateView 
            title="Unable to load data" 
            message="There was an issue connecting to the server." 
            icon="alert-circle-outline"
            onRetry={() => setScreenState('normal')}
          />
        ) : (
          <>
            {/* ── Bloque 3: Métricas KPI (4 Bloques Clave) ── */}
            <View style={styles.kpiGrid}>
              <KPICard 
                label={t('welcome.activeJobs')}
                value={stats.activeJobs}
                subtitle=""
                icon="briefcase"
                variant="blue"
              />
              
              <KPICard 
                label={t('welcome.latestToday')}
                value={stats.totalApplicants}
                subtitle=""
                icon="people"
                variant="green"
              />
              
              <KPICard 
                label={t('welcome.needsAttentionAlt')}
                value={displayAttention.length}
                subtitle=""
                icon="warning"
                variant="red"
              />
              
              <KPICard 
                label={t('welcome.reviewPipeline')}
                value={t('applicants.stats.active')}
                subtitle=""
                icon="git-network"
                variant="purple"
                onPress={() => router.push('/applicants')}
              />
            </View>

            {/* ── Bloque 4: Priority Active Jobs ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('welcome.priorityVacancies')}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/applicants')}>
                <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
            </View>

            {displayJobs.length === 0 ? (
              <StateView 
                title={t('welcome.emptyStates.noActiveJobs')} 
                message="" 
                icon="briefcase-outline"
              />
            ) : (
              <View style={styles.jobsList}>
                {displayJobs.slice(0, 4).map((job, idx) => (
                  <JobCard
                    key={`${job.id}-${idx}`}
                    job={job}
                    onPress={() => {
                      // Prototipo: navega a candidatos filtrados por este puesto si fuera real
                      router.push('/applicants');
                    }}
                  />
                ))}
              </View>
            )}

            {/* ── Bloque 5: Latest Candidates ── */}
            <View style={[styles.customSection, { marginTop: Spacing[8] }]}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('welcome.latestCandidates')}</Text>
                  <TouchableOpacity onPress={() => router.push('/applicants')}>
                     <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.candidatesSmallList}>
                  {displayCandidates.length === 0 ? (
                    <Text style={styles.emptyInternalText}>{t('welcome.emptyStates.noNewCandidates')}</Text>
                  ) : (
                    displayCandidates.map((candidate) => (
                      <LatestCandidateRow 
                        key={candidate.id} 
                        candidate={candidate} 
                        onPress={() => router.push(`/applicants/${candidate.id}`)}
                      />
                    ))
                  )}
               </View>
            </View>

            {/* ── Bloque 6: Needs Attention Today ── */}
            <View style={styles.customSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('welcome.needsAttention')}</Text>
                </View>
                <View style={styles.attentionList}>
                   {displayAttention.length === 0 ? (
                      <View style={styles.attentionEmptyCard}>
                        <Text style={styles.attentionEmptyText}>{t('welcome.emptyStates.noJobsAttention')}</Text>
                      </View>
                   ) : (
                     displayAttention.map(job => (
                       <NeedsAttentionItem 
                          key={job.id} 
                          job={job} 
                          onPress={() => router.push('/applicants')} 
                       />
                     ))
                   )}
                </View>
            </View>

            {/* ── Bloque 7: Quick Action Principal ── */}
            <TouchableOpacity 
              style={styles.mainQuickActionCard} 
              activeOpacity={0.9}
              onPress={() => router.push('/applicants')}
            >
               <View style={styles.mainQuickActionIcon}>
                  <Ionicons name="rocket" size={24} color={Colors.white} />
               </View>
               <View style={styles.mainQuickActionContent}>
                  <Text style={styles.mainQuickActionTitle}>{t('welcome.reviewPipelineFull')}</Text>
                  <Text style={styles.mainQuickActionSub}>{t('welcome.seeByStage')}</Text>
               </View>
               <Ionicons name="chevron-forward" size={20} color={Colors.white} opacity={0.7} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // ── Bloque KPI Principal (Grid 2x2) ──
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginVertical: Spacing[2],
  },
  kpiCard: {
    width: '47.8%', // Ajuste para 2 columnas con gap
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Shadows.sm,
  },
  kpiIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  kpiValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  kpiActionHint: {
    position: 'absolute',
    top: Spacing[4],
    right: Spacing[4],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: 110, // Account for floating tab bar
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
    marginBottom: Spacing[3],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGreetingLine1: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerGreetingLine2: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerNameBold: {
    fontWeight: Typography.fontWeight.bold,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  notificationIconWrapper: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: Colors.accent.red,
    borderWidth: 2,
    borderColor: Colors.surface,
  },

  // ── Barra de búsqueda y filtros ──
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Platform.OS === 'ios' ? Spacing[3] : Spacing[2],
    ...Shadows.sm,
  },
  filterBtn: {
    width: moderateScale(44),
    height: moderateScale(44),
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    padding: 0,
  },

  // ── Chips de filtros ──
  filtersScroll: {
    marginBottom: Spacing[6],
    marginHorizontal: -Spacing[4],
  },
  filtersContent: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  filterChip: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray[50],
    ...Shadows.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
  },
  filterChipText: {
    fontSize: moderateScale(12),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[600],
  },
  filterChipTextActive: {
    color: Colors.white,
  },

  // ── Estadísticas ──
  statsSection: {
    marginBottom: Spacing[6],
    gap: Spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  statsRowSub: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    minHeight: verticalScale(100),
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  statCardHighlight: {
    backgroundColor: Colors.primary[700],
  },
  statCardEmpty: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    minHeight: verticalScale(100),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.gray[200],
  },
  statCardEmptyText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  statValueHighlight: {
    color: Colors.white,
  },
  statCardLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statLabelHighlight: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  growthText: {
    fontSize: 10,
    color: Colors.accent.green,
    fontWeight: Typography.fontWeight.bold,
  },
  growthTextHighlight: {
    color: Colors.white,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statSubtitleHighlight: {
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // ── Sección header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionViewAll: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semiBold,
  },
  compactBlockTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },

  // ── Acciones Rápidas ──
  quickSection: {
    marginTop: Spacing[4],
  },
  quickScroll: {
    marginHorizontal: -Spacing[4],
  },
  quickContent: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Shadows.sm,
  },
  quickActionPrimary: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
  },
  quickActionIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  quickActionLabel: {
    fontSize: moderateScale(12),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  quickActionLabelPrimary: {
    color: Colors.white,
  },

  // ── Custom Blocks (Candidates & Attention) ──
  customSection: {
     marginBottom: Spacing[6],
  },
  candidatesSmallList: {
     backgroundColor: Colors.white,
     borderRadius: BorderRadius.xl,
     padding: Spacing[2],
     ...Shadows.sm,
  },
  candidateRow: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: Spacing[3],
     gap: Spacing[3],
     borderBottomWidth: 1,
     borderBottomColor: Colors.gray[50],
  },
  candidateAvatarSmall: {
     width: moderateScale(36),
     height: moderateScale(36),
     borderRadius: moderateScale(18),
     backgroundColor: Colors.primary[50],
     alignItems: 'center',
     justifyContent: 'center',
     overflow: 'hidden',
  },
  avatarImageSmall: {
     width: '100%',
     height: '100%',
  },
  avatarTextSmall: {
     fontSize: 14,
     fontWeight: Typography.fontWeight.bold,
     color: Colors.primary[700],
  },
  candidateInfoSmall: {
     flex: 1,
  },
  candidateRowTop: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 2,
  },
  candidateNameSmall: {
     fontSize: 13,
     fontWeight: Typography.fontWeight.bold,
     color: Colors.textPrimary,
  },
  candidateJobSmall: {
     fontSize: 11,
     color: Colors.textSecondary,
     marginBottom: 4,
  },
  candidateStageSmall: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
  },
  stageDotSmall: {
     width: 6,
     height: 6,
     borderRadius: 3,
     backgroundColor: Colors.accent.green,
  },
  stageTextSmall: {
     fontSize: moderateScale(10),
     color: Colors.textSecondary,
     fontWeight: Typography.fontWeight.medium,
  },
  timeTextSmall: {
     fontSize: moderateScale(10),
     color: Colors.textDisabled,
  },

  attentionList: {
     gap: Spacing[3],
  },
  attentionItem: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: Colors.white,
     borderRadius: BorderRadius.xl,
     padding: Spacing[4],
     gap: Spacing[4],
     ...Shadows.sm,
  },
  priorityIndicator: {
     width: 3,
     height: 32,
     borderRadius: 2,
  },
  attentionContent: {
     flex: 1,
  },
  attentionJobTitle: {
    fontSize: moderateScale(14),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  attentionMeta: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: moderateScale(4),
     marginTop: moderateScale(2),
  },
  attentionCount: {
     fontSize: moderateScale(11),
     color: Colors.textSecondary,
  },
  attentionActions: {
     alignItems: 'flex-end',
     gap: Spacing[2],
  },
  priorityBadge: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 8,
     paddingVertical: 4,
     borderRadius: 6,
  },
  priorityBadgeText: {
     fontSize: 9,
     fontWeight: Typography.fontWeight.bold,
     textTransform: 'uppercase',
  },
  attentionCTA: {
     backgroundColor: Colors.primary[700],
     paddingHorizontal: 10,
     paddingVertical: 5,
     borderRadius: 6,
  },
  attentionCTAText: {
     fontSize: 10,
     color: Colors.white,
     fontWeight: Typography.fontWeight.bold,
  },

  // ── Insights ──
  insightContainer: {
    marginBottom: Spacing[5],
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50], // Tono suave de la marca
    borderRadius: BorderRadius.xl,
    padding: Spacing[3],
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.1)', // Sutil borde azul
  },
  insightIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
    textTransform: 'uppercase',
  },
  insightMessage: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  // ── Lista de vacantes y tarjetas mejoradas ──
  jobsList: {
    gap: Spacing[4],
  },
  jobCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Shadows.md,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  jobCardTitleMain: {
    flex: 1,
  },
  jobTitle: {
    fontSize: moderateScale(15),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: moderateScale(4),
  },
  jobMetaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDaysActive: {
    fontSize: moderateScale(10),
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  jobMetaDot: {
    fontSize: moderateScale(8),
    color: Colors.textDisabled,
  },
  jobTotalApplicants: {
    fontSize: moderateScale(10),
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[50],
    paddingTop: Spacing[4],
  },
  jobDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  jobDetailBtnText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },

  // ── Stack de avatares ──
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarCount: {
    backgroundColor: Colors.gray[100],
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  // ── Estados Alternos ──
  skeletonContainer: {
    padding: Spacing[4],
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing[2],
  },
  skeletonBase: {
    backgroundColor: Colors.gray[100],
  },
  stateView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing[2],
    ...Shadows.sm,
  },
  stateIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  stateTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  stateMessage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: Spacing[5],
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.primary[700],
    borderRadius: BorderRadius.lg,
  },
  retryText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
  
  avatarCountText: {
    fontSize: 8,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[500],
  },
  
  // ── Bloque 7: Quick Action Card ──
  mainQuickActionCard: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: Colors.primary[700],
     borderRadius: BorderRadius.xl,
     padding: Spacing[5],
     marginTop: Spacing[8],
     marginBottom: Spacing[4],
     ...Shadows.md,
  },
  mainQuickActionIcon: {
     width: 48,
     height: 48,
     borderRadius: BorderRadius.lg,
     backgroundColor: 'rgba(255,255,255,0.2)',
     alignItems: 'center',
     justifyContent: 'center',
  },
  mainQuickActionContent: {
     flex: 1,
     marginLeft: Spacing[4],
  },
  mainQuickActionTitle: {
     fontSize: 16,
     fontWeight: Typography.fontWeight.bold,
     color: Colors.white,
  },
  mainQuickActionSub: {
     fontSize: 12,
     color: 'rgba(255,255,255,0.8)',
     marginTop: 2,
  },
  emptyInternalText: {
     fontSize: 12,
     color: Colors.textDisabled,
     textAlign: 'center',
     paddingVertical: Spacing[6],
  },
  attentionEmptyCard: {
     backgroundColor: Colors.white,
     borderRadius: BorderRadius.xl,
     padding: Spacing[6],
     alignItems: 'center',
     borderWidth: 1,
     borderColor: Colors.gray[100],
     borderStyle: 'dashed',
  },
  attentionEmptyText: {
     fontSize: 12,
     color: Colors.textDisabled,
  },
});

export default WelcomeScreen;
