import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { Avatar, StatusBadge, SearchInput, Card } from '@components/ui';
import { MOCK_APPLICANTS, MOCK_STATS } from '@utils/mockData';
import { Applicant } from '@types/index';
import { useRouter } from 'expo-router';

type FilterType = 'ALL' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER';

export default function ApplicantsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'ALL', label: `${t('applicants.filterAll')} (7)` },
    { id: 'APPLIED', label: t('applicants.filterApplied') },
    { id: 'SCREENING', label: t('applicants.filterScreening') },
    { id: 'INTERVIEW', label: t('applicants.filterInterview') },
    { id: 'OFFER', label: t('applicants.filterOffer') },
  ];

  const stats = [
    { label: t('applicants.statsTotal'), value: MOCK_STATS.totalApplicants, color: Colors.textPrimary },
    { label: t('applicants.statsNew'), value: MOCK_STATS.newApplicants, color: Colors.accent.blue },
    { label: t('applicants.statsInterview'), value: MOCK_STATS.inInterview, color: Colors.textPrimary },
    { label: t('applicants.statsHired'), value: MOCK_STATS.hiredThisMonth, color: Colors.accent.green },
  ];

  const filteredApplicants = useMemo(() => {
    return MOCK_APPLICANTS.filter((applicant) => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'APPLIED') return applicant.status === 'applied' || applicant.status === 'new';
      if (activeFilter === 'SCREENING') return applicant.status === 'screening';
      if (activeFilter === 'INTERVIEW') return applicant.status === 'interviewing';
      if (activeFilter === 'OFFER') return applicant.status === 'offered';
      
      return true;
    });
  }, [searchQuery, activeFilter]);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>{t('applicants.title')}</Text>
          <Text style={styles.subtitle}>
            {t('applicants.subtitle', { count: 7 })}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.primary[700]} />
        </TouchableOpacity>
      </View>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('applicants.searchPlaceholder')}
        style={styles.searchInput}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderApplicant = ({ item }: { item: Applicant }) => (
    <Card 
      style={styles.applicantCard}
      onPress={() => router.push(`/applicants/${item.id}`)}
    >
      <View style={styles.applicantContent}>
        <Avatar
          name={item.name}
          uri={item.avatar}
          isOnline={item.isOnline}
          size={56}
        />
        <View style={styles.applicantInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.applicantName}>{item.name}</Text>
            {item.rating && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
            {item.status === 'new' && (
              <Text style={styles.newLabel}>☆ New</Text>
            )}
          </View>
          <Text style={styles.applicantJob}>{item.jobTitle}</Text>
          <View style={styles.statusRow}>
            <StatusBadge
              label={t(`applicants.stages.${item.stage}`)}
              variant={item.stage}
            />
            <Text style={styles.timeAgo}>• {getTimeAgo(item.appliedDate)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredApplicants}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicant}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// Función auxiliar para formatear tiempo (simulada para el demo)
function getTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Hace unos minutos';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)} days ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing[4],
  },
  headerContent: {
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    marginBottom: Spacing[6],
  },
  filterContainer: {
    marginBottom: Spacing[6],
    paddingRight: Spacing[4],
  },
  filterChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
    marginRight: Spacing[2],
    height: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary[800],
  },
  filterText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  statsContainer: {
    paddingBottom: Spacing[2],
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginRight: Spacing[3],
    minWidth: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  applicantCard: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
  },
  applicantContent: {
    flexDirection: 'row',
  },
  applicantInfo: {
    flex: 1,
    marginLeft: Spacing[4],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  applicantName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#EA580C',
    marginLeft: 4,
  },
  newLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  applicantJob: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing[2],
  },
});
