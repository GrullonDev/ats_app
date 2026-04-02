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
import type { Job, JobStatus } from '@/types';
import { MOCK_JOBS, MOCK_USER, MOCK_STATS } from '@utils/mockData';

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
      {highlight && (
        <Text style={styles.statCardLabel}>{label}</Text>
      )}
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>
        {value}
      </Text>
      {!highlight && (
        <Text style={styles.statCardLabel}>{label}</Text>
      )}
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
      {subtitle && !growthPercent && (
        <Text style={styles.statSubtitle}>{subtitle}</Text>
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
  key?: string | number;
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
        <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.jobMetaText}>
          {job.department} • {job.location}
        </Text>
      </View>

      {/* Footer: Avatares/íconos + Conteo */}
      <View style={styles.jobFooter}>
        <ApplicantAvatarStack
          count={job.applicantsCount > 4 ? job.applicantsCount - 4 : undefined}
          filledSpots={Math.min(job.applicantsCount, 4)}
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

const AVATAR_COLORS = [
  Colors.accent.blue,
  Colors.accent.orange,
  Colors.accent.purple,
  Colors.accent.green,
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
            { marginLeft: index === 0 ? 0 : -8 },
          ]}
        >
          <Ionicons name="person" size={10} color={Colors.white} />
        </View>
      ))}
      {count !== undefined && (
        <View style={[styles.avatarCircle, styles.avatarCount, { marginLeft: -8 }]}>
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

  // En producción esto vendría del AuthStore
  const { user: authUser } = useAuthStore();
  const user = authUser || MOCK_USER;
  const stats = MOCK_STATS;
  const jobs = MOCK_JOBS;

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
            {/* Avatar del usuario */}
            <View style={styles.headerAvatar}>
              <Ionicons name="person" size={22} color={Colors.primary[700]} />
            </View>
            {/* Saludo */}
            <View>
              <Text style={styles.headerGreeting}>{t('welcome.greeting')}</Text>
              <Text style={styles.headerName}>
                {t('welcome.hello')}, {user.name.split(' ')[0]}
              </Text>
            </View>
          </View>

          {/* Botón de notificaciones */}
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.primary[700]}
            />
            {/* Badge de notificación */}
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ── Barra de búsqueda ── */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('welcome.searchPlaceholder')}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* ── Tarjetas de estadísticas ── */}
        <View style={styles.statsRow}>
          {/* Empleos activos (destaca) */}
          <StatCard
            label={t('welcome.activeJobs')}
            value={stats.activeJobs}
            highlight
          />

          {/* Columna derecha: Aplicantes + Contratados */}
          <View style={styles.statsColumn}>
            <StatCard
              label={t('welcome.applicants')}
              value={stats.totalApplicants}
              growthPercent={stats.applicantsGrowthPercent}
            />
            <StatCard
              label={t('welcome.hired')}
              value={stats.hiredThisMonth}
              subtitle={t('welcome.thisMonth')}
            />
          </View>
        </View>

        {/* ── Sección: Vacantes Activas ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('welcome.activeJobOpenings')}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionViewAll}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de vacantes */}
        <View style={styles.jobsList}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => {
                // Navegar al detalle de la vacante
                console.log('Navigate to job:', job.id);
              }}
            />
          ))}
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

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGreeting: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.regular,
  },
  headerName: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    paddingVertical: Platform.OS === 'ios' ? Spacing[3] : Spacing[2],
    marginBottom: Spacing[5],
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

  // ── Estadísticas ──
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    justifyContent: 'center',
    ...Shadows.sm,
  },
  statCardHighlight: {
    backgroundColor: Colors.primary[700],
    flex: 1.1,
  },
  statsColumn: {
    flex: 1,
    gap: Spacing[3],
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statValueHighlight: {
    fontSize: Typography.fontSize['3xl'],
    color: Colors.white,
  },
  statCardLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  growthText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.green,
    fontWeight: Typography.fontWeight.semiBold,
  },
  statSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Sección header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionViewAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semiBold,
  },

  // ── Lista de vacantes ──
  jobsList: {
    gap: Spacing[3],
  },
  jobCard: {
    padding: Spacing[4],
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[1],
    gap: Spacing[2],
  },
  jobTitle: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing[3],
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarCount: {
    backgroundColor: Colors.gray[200],
  },
  avatarCountText: {
    fontSize: 9,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[600],
  },

  // ── Conteo de aplicantes ──
  jobCountContainer: {
    alignItems: 'flex-end',
  },
  jobApplicantsCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  jobCountSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});

export default WelcomeScreen;
