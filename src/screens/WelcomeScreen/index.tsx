import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
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
import type { Job, JobStatus } from '@/types';

// ─────────────────────────────────────────────
// Sub-componente: Tarjeta de estadística
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
      <Text style={[styles.statCardLabel, highlight && styles.statCardLabelHighlight]}>
        {label}
      </Text>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>
        {value}
      </Text>
      
      {growthPercent !== undefined && (
        <View style={styles.growthRow}>
          <Ionicons
            name="trending-up"
            size={12}
            color={Colors.accent.green}
          />
          <Text style={styles.growthText}>+{growthPercent}%</Text>
        </View>
      )}
      
      {subtitle && (
        <Text style={[styles.statSubtitle, highlight && styles.statSubtitleHighlight]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Tarjeta de vacante activa
// ─────────────────────────────────────────────
interface JobCardProps {
  job: Job;
  onPress?: () => void;
}

const JobCard = ({ job, onPress }: JobCardProps) => {
  const { t } = useTranslation();

  // Mapeo de estado de vacante → variante del badge
  const statusVariantMap: Record<JobStatus, 'active' | 'interviewing' | 'new' | 'closed' | 'paused' | 'draft'> = {
    active: 'active',
    closed: 'closed',
    draft: 'draft',
    paused: 'paused',
  };

  // Detectar si hay entrevistas programadas (muestra como 'interviewing')
  const displayVariant = job.scheduledInterviews
    ? 'interviewing'
    : statusVariantMap[job.status] ?? 'active';

  // Label del badge con traducción
  const badgeLabelKey = job.scheduledInterviews
    ? 'jobStatus.interviewing'
    : `jobStatus.${job.status}`;

  // Descripción secundaria del conteo
  const countSubtitle = job.newApplicantsToday
    ? `${job.newApplicantsToday} ${t('welcome.newApplicants')}`
    : job.scheduledInterviews
    ? `${job.scheduledInterviews} ${t('welcome.scheduled')}`
    : t('welcome.justPosted');

  return (
    <Card style={styles.jobCard} onPress={onPress}>
      {/* Header: Título + Badge */}
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {job.title}
        </Text>
        <StatusBadge
          label={t(badgeLabelKey)}
          variant={displayVariant}
        />
      </View>

      {/* Departamento y ubicación */}
      <View style={styles.jobMeta}>
        <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.jobMetaText}>
          {job.department} • {job.location}
        </Text>
      </View>

      {/* Footer: Avatares/íconos + Conteo */}
      <View style={styles.jobFooter}>
        <ApplicantAvatarStack
          count={job.applicantsCount > 3 ? job.applicantsCount - 3 : undefined}
          filledSpots={Math.min(job.applicantsCount, 3)}
        />
        <View style={styles.jobCountContainer}>
          <Text style={styles.jobApplicantsCount}>
            {job.applicantsCount} {t('welcome.applicants')}
          </Text>
          <Text style={styles.jobCountSubtitle}>{countSubtitle}</Text>
        </View>
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
// Pantalla principal: WelcomeScreen (Dashboard)
// ─────────────────────────────────────────────
export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');

  // Datos reales del store
  const { user } = useAuthStore();
  const { stats, activeJobs } = useATSStore();

  // Filtrado de vacantes
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return activeJobs;
    const query = searchQuery.toLowerCase();
    return activeJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
    );
  }, [activeJobs, searchQuery]);

  // Acciones
  const handleJobPress = (jobId: string) => {
    router.push({
      pathname: '/applicants',
      params: { jobId }
    });
  };

  const handleNotificationPress = () => {
    Alert.alert(
      t('welcome.notifications'),
      t('welcome.notificationAlert'),
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  // Determinar si la pantalla es "ancha" (tablet)
  const isTablet = width > 768;

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
        {/* ── Header: saludo + notificaciones ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Avatar del usuario */}
            <View style={styles.headerAvatarContainer}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/46.jpg' }} 
                style={styles.headerAvatarImage} 
              />
            </View>
            <View>
              <Text style={styles.headerGreeting}>{t('welcome.greeting')}</Text>
              <Text style={styles.headerName}>
                {t('welcome.hello')} {user?.name.split(' ')[0] || 'Alex'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.notificationBtn} 
            activeOpacity={0.8}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.primary[700]} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ── Barra de búsqueda ── */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('welcome.searchPlaceholder')}
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Tarjetas de estadísticas ── */}
        <View style={[styles.statsRow, isTablet && styles.statsRowTablet]}>
          <StatCard
            label={t('jobStatus.active')}
            value={stats.activeJobs}
            subtitle={t('welcome.activeJobs').split(' ')[0]}
            highlight
          />
          <StatCard
            label={t('welcome.applicants').toUpperCase()}
            value={stats.totalApplicants}
            growthPercent={stats.applicantsGrowthPercent}
          />
          <StatCard
            label={t('welcome.hired').toUpperCase()}
            value={stats.hiredThisMonth}
            subtitle={t('welcome.thisMonth')}
          />
        </View>

        {/* ── Sección: Vacantes Activas ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('welcome.activeJobOpenings')}</Text>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => router.push('/applicants')}
          >
            <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de vacantes */}
        <View style={[styles.jobsList, isTablet && styles.jobsListTablet]}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => handleJobPress(job.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.gray[300]} />
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            </View>
          )}
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  scrollContentTablet: {
    paddingHorizontal: Spacing[10],
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[6],
    marginBottom: Spacing[6],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  headerAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadows.sm,
    overflow: 'hidden',
    backgroundColor: Colors.primary[100],
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  headerGreeting: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  headerName: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  notificationBtn: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray[100],
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.red,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  // ── Barra de búsqueda ──
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: Spacing[6],
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray[100],
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

  // ── Estadísticas ──
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[8],
  },
  statsRowTablet: {
    gap: Spacing[6],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.gray[100],
    ...Shadows.sm,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  statCardHighlight: {
    backgroundColor: Colors.navy || '#1A1F36',
    borderColor: Colors.navy || '#1A1F36',
  },
  statValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  statValueHighlight: {
    color: Colors.white,
  },
  statCardLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  statCardLabelHighlight: {
    color: Colors.white,
    opacity: 0.8,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  growthText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.green,
    fontWeight: Typography.fontWeight.bold,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statSubtitleHighlight: {
    color: Colors.white,
    opacity: 0.7,
  },

  // ── Sección header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionViewAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.blue,
    fontWeight: Typography.fontWeight.bold,
  },

  // ── Lista de vacantes ──
  jobsList: {
    gap: Spacing[4],
  },
  jobsListTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
  },
  jobCard: {
    padding: Spacing[5],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    width: '100%',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
    gap: Spacing[2],
  },
  jobTitle: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing[4],
  },
  jobMetaText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Stack de avatares ──
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCount: {
    backgroundColor: Colors.gray[200],
  },
  avatarCountText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[600],
  },

  // ── Conteo de aplicantes ──
  jobCountContainer: {
    alignItems: 'flex-end',
  },
  jobApplicantsCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobCountSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },

  // ── Estado vacío ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
    gap: Spacing[2],
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
  },
});

export default WelcomeScreen;
