import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { Card } from '@components/ui/Card';
import { StatusBadge } from '@components/ui/StatusBadge';
import { useTranslation } from '@hooks/useTranslation';
import { useAuthStore } from '@store/authStore';
import { useATSStore } from '@store/atsStore';
import type { Job, Applicant, JobStatus } from '@/types';
import { MOCK_JOBS, MOCK_USER, MOCK_APPLICANTS } from '@utils/mockData';
import { verticalScale, moderateScale, scale } from '@utils/responsive';
import { getTimeAgo } from '@utils/dateUtils';

// ─────────────────────────────────────────────
// Sub-componente: Tarjeta KPI Enriquecida
// ─────────────────────────────────────────────
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
// Sub-componente: Tarjeta de estadística (Variante clásica)
// ─────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
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
}

const JobCard = ({ job, onPress }: JobCardProps) => {
  const { t } = useTranslation();

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
  count?: number; 
}

const AVATAR_PLACEHOLDERS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
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
            { marginLeft: index === 0 ? 0 : -10 },
          ]}
        >
          <Image 
            source={{ uri: AVATAR_PLACEHOLDERS[index % AVATAR_PLACEHOLDERS.length] }} 
            style={styles.avatarImage} 
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
          <View style={styles.avatarPlaceholderSmall}>
            <Text style={styles.avatarTextSmall}>{candidate.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.candidateInfoSmall}>
        <View style={styles.candidateRowTop}>
           <Text style={styles.candidateNameSmall}>{candidate.name}</Text>
           <Text style={styles.timeTextSmall}>{getTimeAgo(candidate.appliedDate, t)}</Text>
        </View>
        <Text style={styles.candidateJobSmall} numberOfLines={1}>{candidate.jobTitle}</Text>
        <div style={styles.candidateStageSmall}>
           <View style={styles.stageDotSmall} />
           <Text style={styles.stageTextSmall}>{t(`applicants.stages.${candidate.stage}`)}</Text>
        </div>
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Item de \"Needs Attention\"
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
type DashboardState = 'normal' | 'loading' | 'empty' | 'error' | 'zero';

export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const { user } = useAuthStore();
  const { activeJobs, stats: atsStats } = useATSStore();
  const [screenState, setScreenState] = useState<DashboardState>('normal');
  const [searchQuery, setSearchQuery] = useState('');

  // Lógica de filtrado y ordenamiento de candidatos (basado en HEAD)
  const allCandidates = useMemo(() => 
    [...MOCK_APPLICANTS].sort((a, b) => 
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    ), []
  );
  
  const newsTodayCount = useMemo(() => allCandidates.filter(c => {
    const diff = Date.now() - new Date(c.appliedDate).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }).length, [allCandidates]);

  const attentionJobs = useMemo(() => [...activeJobs]
    .filter(j => j.applicantsCount > 15)
    .sort((a, b) => b.applicantsCount - a.applicantsCount), [activeJobs]);

  const displayJobs = useMemo(() => {
    let filtered = activeJobs;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(j => j.title.toLowerCase().includes(query));
    }
    return filtered.slice(0, 4);
  }, [activeJobs, searchQuery]);

  const handleNotificationPress = () => {
    Alert.alert(
      t('welcome.notifications'),
      t('welcome.notificationAlert'),
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet
        ]}
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatarContainer}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/46.jpg' }} 
                style={styles.headerAvatarImage} 
              />
            </View>
            <View>
              <Text style={styles.headerGreetingLine1}>
                {t('common.greeting')}, {user?.name.split(' ')[0] || 'User'}
              </Text>
              <Text style={styles.headerGreetingLine2}>
                {t('welcome.dailySummaryAttention', { count: attentionJobs.length })}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.notificationBtn} 
            activeOpacity={0.8}
            onPress={handleNotificationPress}
          >
            <View style={styles.notificationIconWrapper}>
              <Ionicons
                name=\"notifications-outline\"
                size={22}
                color={Colors.primary[700]}
              />
              {attentionJobs.length > 0 && <View style={styles.notificationDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name=\"search-outline\"
              size={18}
              color={Colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('applicants.searchPlaceholder')}
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Ionicons name=\"options-outline\" size={20} color={Colors.primary[700]} />
          </TouchableOpacity>
        </View>

        {/* Filters Scroll */}
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

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <KPICard 
            label={t('welcome.activeJobs')}
            value={activeJobs.length}
            subtitle=\"\"
            icon=\"briefcase\"
            variant=\"blue\"
          />
          
          <KPICard 
            label={t('welcome.latestToday')}
            value={newsTodayCount}
            subtitle=\"\"
            icon=\"people\"
            variant=\"green\"
          />
          
          <KPICard 
            label={t('welcome.needsAttentionAlt')}
            value={attentionJobs.length}
            subtitle=\"\"
            icon=\"warning\"
            variant=\"red\"
          />
          
          <KPICard 
            label={t('welcome.reviewPipeline')}
            value={atsStats.totalApplicants}
            subtitle=\"\"
            icon=\"git-network\"
            variant=\"purple\"
            onPress={() => router.push('/applicants')}
          />
        </View>

        {/* Priority Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('welcome.priorityVacancies')}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/applicants')}>
            <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {displayJobs.length === 0 ? (
          <StateView 
            title={t('welcome.emptyStates.noActiveJobs')} 
            message=\"\" 
            icon=\"briefcase-outline\"
          />
        ) : (
          <View style={styles.jobsList}>
            {displayJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => router.push({ pathname: '/applicants', params: { jobId: job.id } })}
              />
            ))}
          </View>
        )}

        {/* Latest Candidates */}
        <View style={[styles.customSection, { marginTop: Spacing[8] }]}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('welcome.latestCandidates')}</Text>
              <TouchableOpacity onPress={() => router.push('/applicants')}>
                 <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
           </View>
           <View style={styles.candidatesSmallList}>
              {allCandidates.slice(0, 5).map((candidate) => (
                <LatestCandidateRow 
                  key={candidate.id} 
                  candidate={candidate} 
                  onPress={() => router.push(`/applicants/${candidate.id}`)}
                />
              ))}
           </View>
        </View>

        {/* Needs Attention Today */}
        <View style={styles.customSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('welcome.needsAttention')}</Text>
            </View>
            <View style={styles.attentionList}>
               {attentionJobs.length === 0 ? (
                  <View style={styles.attentionEmptyCard}>
                    <Text style={styles.attentionEmptyText}>{t('welcome.emptyStates.noJobsAttention')}</Text>
                  </View>
               ) : (
                 attentionJobs.slice(0, 3).map(job => (
                   <NeedsAttentionItem 
                      key={job.id} 
                      job={job} 
                      onPress={() => router.push({ pathname: '/applicants', params: { jobId: job.id } })} 
                   />
                 ))
               )}
            </View>
        </View>

        {/* Main Quick Action */}
        <TouchableOpacity 
          style={styles.mainQuickActionCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/applicants')}
        >
           <View style={styles.mainQuickActionIcon}>
              <Ionicons name=\"rocket\" size={24} color={Colors.white} />
           </View>
           <View style={styles.mainQuickActionContent}>
              <Text style={styles.mainQuickActionTitle}>{t('welcome.reviewPipelineFull')}</Text>
              <Text style={styles.mainQuickActionSub}>{t('welcome.seeByStage')}</Text>
           </View>
           <Ionicons name=\"chevron-forward\" size={20} color={Colors.white} opacity={0.7} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[10],
  },
  scrollContentTablet: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadows.sm,
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  headerGreetingLine1: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerGreetingLine2: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  notificationIconWrapper: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent.red,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing[6],
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    height: 48,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  filtersScroll: {
    marginBottom: Spacing[6],
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
  },
  filterChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing[8],
  },
  kpiCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    ...Shadows.sm,
    position: 'relative',
  },
  kpiIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginTop: 2,
  },
  kpiSubtitle: {
    fontSize: 10,
    color: Colors.textDisabled,
    marginTop: 1,
  },
  kpiActionHint: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionViewAll: {
    fontSize: 14,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.bold,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[50],
    ...Shadows.sm,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobCardTitleMain: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  jobMetaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDaysActive: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  jobMetaDot: {
    fontSize: 10,
    color: Colors.textDisabled,
  },
  jobTotalApplicants: {
    fontSize: 11,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[50],
  },
  jobDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  jobDetailBtnText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.white,
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCountText: {
    fontSize: 8,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[600],
  },
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
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  candidateAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatarPlaceholderSmall: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 2,
  },
  candidateNameSmall: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  timeTextSmall: {
    fontSize: 10,
    color: Colors.textDisabled,
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
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  attentionList: {
    gap: 12,
  },
  attentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  attentionContent: {
    flex: 1,
  },
  attentionJobTitle: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  attentionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  attentionCount: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  attentionActions: {
    alignItems: 'flex-end',
    gap: 6,
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
    paddingVertical: 4,
    borderRadius: 6,
  },
  attentionCTAText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
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
  mainQuickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    marginTop: Spacing[4],
    marginBottom: Spacing[10],
    ...Shadows.md,
  },
  mainQuickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
  stateView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
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
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  stateMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: Spacing[6],
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary[700],
    borderRadius: BorderRadius.xl,
  },
  retryText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    ...Shadows.sm,
  },
  statCardHighlight: {
    backgroundColor: Colors.primary[700],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statLabelHighlight: {
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  statValueHighlight: {
    color: Colors.white,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textDisabled,
    marginTop: 4,
  },
  statSubtitleHighlight: {
    color: 'rgba(255,255,255,0.6)',
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    color: Colors.accent.green,
    fontWeight: Typography.fontWeight.bold,
  },
  growthTextHighlight: {
    color: Colors.white,
  },
});

export default WelcomeScreen;
