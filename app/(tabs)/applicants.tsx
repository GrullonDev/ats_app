import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { Card, StatusBadge, Avatar, SearchInput } from '@components/ui';
import { useTranslation } from '@hooks/useTranslation';
import { MOCK_APPLICANTS } from '@utils/mockData';
import { verticalScale, moderateScale, scale } from '@utils/responsive';
import { getTimeAgo } from '@utils/dateUtils';
import { Applicant, HiringStage } from '@/types';
import { useRouter } from 'expo-router';

type FilterType = 'ALL' | HiringStage | 'needs_review' | 'interviews' | 'offers';
type SortOption = 'date' | 'score' | 'name';

export default function ApplicantsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial para prototipo (Skeleton demo)
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const pipelineStages: { id: HiringStage | 'ALL'; label: string }[] = [
    { id: 'ALL', label: t('applicants.filterAll') },
    { id: 'applied', label: t('applicants.stages.applied') },
    { id: 'screening', label: t('applicants.stages.screening') },
    { id: 'interviewing', label: t('applicants.stages.interviewing') },
    { id: 'psychometric_test', label: t('applicants.stages.psychometric_test') },
    { id: 'selection', label: t('applicants.stages.selection') },
    { id: 'offered', label: t('applicants.stages.offered') },
    { id: 'hired', label: t('applicants.stages.hired') },
    { id: 'rejected', label: t('applicants.stages.rejected') },
  ];

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: MOCK_APPLICANTS.length };
    MOCK_APPLICANTS.forEach(a => {
      counts[a.stage] = (counts[a.stage] || 0) + 1;
    });
    return counts;
  }, []);

  const statsPreviews = [
    { id: 'ALL', label: t('applicants.stats.active'), value: MOCK_APPLICANTS.length, color: Colors.primary[700], icon: 'people' },
    { id: 'needs_review', label: t('applicants.stats.toReview'), value: MOCK_APPLICANTS.filter(a => a.urgency === 'awaiting_review').length, color: Colors.accent.purple, icon: 'time' },
    { id: 'interviews', label: t('applicants.stats.interviews'), value: MOCK_APPLICANTS.filter(a => a.urgency === 'interview_today').length, color: Colors.accent.orange, icon: 'calendar' },
    { id: 'offers', label: t('applicants.stats.offers'), value: MOCK_APPLICANTS.filter(a => a.urgency === 'offer_pending').length, color: Colors.accent.blue, icon: 'document-text' },
  ];

  const filteredApplicants = useMemo(() => {
    let result = MOCK_APPLICANTS.filter((applicant) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        applicant.name.toLowerCase().includes(query) ||
        applicant.jobTitle?.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query) ||
        t(`applicants.stages.${applicant.stage}`).toLowerCase().includes(query) ||
        applicant.location?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
      
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'needs_review') return applicant.urgency === 'awaiting_review';
      if (activeFilter === 'interviews') return applicant.urgency === 'interview_today';
      if (activeFilter === 'offers') return applicant.urgency === 'offer_pending';
      return applicant.stage === (activeFilter as HiringStage);
    });

    // Ordenamiento
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'score': return (b.matchScore || 0) - (a.matchScore || 0);
        case 'name': return a.name.localeCompare(b.name);
        case 'date': 
        default: return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      }
    });

    return result;
  }, [searchQuery, activeFilter, sortOption, t]);

  const sections = useMemo(() => {
    if (filteredApplicants.length === 0) return [];
    
    const groups: { title: string; data: Applicant[] }[] = [];
    
    if (activeFilter === 'ALL' && searchQuery === '') {
      const todayArr = filteredApplicants.filter(a => {
        const diff = Date.now() - new Date(a.appliedDate).getTime();
        return diff < 24 * 60 * 60 * 1000;
      });
      const earlierArr = filteredApplicants.filter(a => {
        const diff = Date.now() - new Date(a.appliedDate).getTime();
        return diff >= 24 * 60 * 60 * 1000;
      });

      if (todayArr.length > 0) groups.push({ title: t('common.today'), data: todayArr });
      if (earlierArr.length > 0) groups.push({ title: t('applicants.latestApplicants'), data: earlierArr });
    } else {
      const needsAction = filteredApplicants.filter(a => a.urgency);
      const others = filteredApplicants.filter(a => !a.urgency);
      
      if (needsAction.length > 0 && activeFilter !== 'needs_review') {
        groups.push({ title: t('applicants.needsReview'), data: needsAction });
      }
      
      if (others.length > 0) {
        groups.push({ title: groups.length > 0 ? t('common.other') : '', data: others });
      } else if (needsAction.length === 0) {
        groups.push({ title: '', data: filteredApplicants });
      }
    }
    
    return groups;
  }, [filteredApplicants, activeFilter, searchQuery, t]);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>{t('applicants.allApplicants')}</Text>
          <Text style={styles.subtitle}>
            {filteredApplicants.length === 1 
              ? t('applicants.subtitleSingular') 
              : t('applicants.subtitle', { count: filteredApplicants.length })}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          activeOpacity={0.7} 
          onPress={() => setIsLoading(true)}
        >
          <Ionicons name="person-add" size={20} color={Colors.white} />
          <Text style={styles.addButtonText}>{t('applicants.actions.add')}</Text>
        </TouchableOpacity>
      </View>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('applicants.searchPlaceholder')}
        style={styles.searchInput}
        showFilter
        onFilterPress={() => {
          const options: SortOption[] = ['date', 'score', 'name'];
          const currentIndex = options.indexOf(sortOption);
          setSortOption(options[(currentIndex + 1) % options.length]);
        }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {pipelineStages.map((stage) => {
          const isActive = activeFilter === stage.id;
          return (
            <TouchableOpacity
              key={stage.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(stage.id as FilterType)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {stage.label}
              </Text>
              <View style={[styles.countBadge, isActive ? styles.countBadgeActive : styles.countBadgeInactive]}>
                <Text style={[styles.countText, isActive && styles.countTextActive]}>
                  {stageCounts[stage.id] || 0}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      >
        {statsPreviews.map((stat, index) => {
          const isActive = activeFilter === stat.id;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.statCard, isActive && styles.statCardActive]} 
              activeOpacity={0.7}
              onPress={() => setActiveFilter(stat.id as FilterType)}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIconBox, isActive && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name={stat.icon as any} size={16} color={isActive ? Colors.white : stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }, isActive && { color: Colors.white }]}>{stat.value}</Text>
              </View>
              <Text style={[styles.statLabel, isActive && { color: Colors.white }]}>{stat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderApplicant = ({ item }: { item: Applicant }) => (
    <Card 
      style={styles.applicantCard}
      onPress={() => router.push(`/applicants/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Avatar
          name={item.name}
          uri={item.avatar}
          size={moderateScale(54)}
          isOnline={!!item.lastActivityDate}
        />
        <View style={styles.mainInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.applicantName} numberOfLines={1}>{item.name}</Text>
            {item.matchScore && (
              <View style={styles.matchBadge}>
                <Ionicons name="sparkles" size={10} color={Colors.accent.orange} style={{marginRight: 2}} />
                <Text style={styles.matchScoreText}>{item.matchScore.toFixed(1)} {t('applicants.matchScore')}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.applicantJob}>
              <Text style={styles.jobLink}>{item.jobTitle}</Text>
              {item.department && <Text style={styles.jobMeta}> • {item.department}</Text>}
            </Text>
            <Text style={styles.locationLabel}>
              <Ionicons name="location-outline" size={12} color={Colors.textSecondary} /> {item.location} {item.isRemote ? '(Remote)' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.bottomLeft}>
          <StatusBadge
            label={t(`applicants.stages.${item.stage}`).toUpperCase()}
            variant={item.stage}
          />
          <Text style={styles.timeAgo}>{getTimeAgo(item.appliedDate, t)}</Text>
        </View>
        
        <View style={styles.bottomRight}>
          {item.urgency && (
             <StatusBadge
              label={t(`applicants.urgency.${item.urgency}`)}
              variant={item.urgency}
              style={styles.urgencyBadge}
            />
          )}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/applicants/${item.id}`)}
          >
            <Text style={styles.actionButtonText}>{t('applicants.actions.review')}</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary[700]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
    if (!title) return <View style={{ height: Spacing[2] }} />;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionLine} />
      </View>
    );
  };

  const renderRecommended = () => {
    if (isLoading || sections.length === 0) return null;
    const isFewResults = filteredApplicants.length > 0 && filteredApplicants.length < 3;
    
    if (!isFewResults) return null;

    return (
      <View style={styles.recommendedSection}>
        <View style={styles.recommendedHeader}>
          <Ionicons name="bulb-outline" size={18} color={Colors.accent.orange} />
          <Text style={styles.recommendedTitle}>{t('applicants.emptyStates.suggestedActions')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
          <TouchableOpacity style={styles.recommendCard}>
            <View style={[styles.recommendIcon, { backgroundColor: Colors.accent.blueLight }]}>
              <Ionicons name="mail-outline" size={20} color={Colors.accent.blue} />
            </View>
            <Text style={styles.recommendText}>Email applicants</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recommendCard}>
            <View style={[styles.recommendIcon, { backgroundColor: Colors.accent.greenLight }]}>
              <Ionicons name="arrow-redo-outline" size={20} color={Colors.accent.green} />
            </View>
            <Text style={styles.recommendText}>Bulk move</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recommendCard}>
            <View style={[styles.recommendIcon, { backgroundColor: Colors.accent.purpleLight }]}>
              <Ionicons name="share-outline" size={20} color={Colors.accent.purple} />
            </View>
            <Text style={styles.recommendText}>Share stage</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name={searchQuery ? "search-outline" : "people-outline"} size={48} color={Colors.gray[300]} />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? t('applicants.emptyStates.noResults') : t('applicants.emptyStates.noCandidates')}
      </Text>
      <Text style={styles.emptySub}>
        {t('applicants.emptyStates.tryAdjusting')}
      </Text>
      <TouchableOpacity 
        style={styles.clearFiltersBtn}
        onPress={() => {
          setSearchQuery('');
          setActiveFilter('ALL');
        }}
      >
        <Text style={styles.clearFiltersText}>{t('applicants.filterAll')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isLoading ? (
        <View style={{ flex: 1 }}>
          {renderHeader()}
          <View style={styles.loadingContainer}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.skeletonCard}>
                 <View style={styles.skeletonHeader}>
                    <View style={styles.skeletonAvatar} />
                    <View style={styles.skeletonContent}>
                       <View style={styles.skeletonLineShort} />
                       <View style={styles.skeletonLineLong} />
                    </View>
                 </View>
                 <View style={styles.skeletonFooter} />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderApplicant}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderRecommended}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 110,
  },
  loadingContainer: {
    padding: Spacing[4],
  },
  skeletonCard: {
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  skeletonHeader: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
  },
  skeletonAvatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: Colors.gray[100],
  },
  skeletonContent: {
    flex: 1,
    marginLeft: Spacing[3],
    gap: moderateScale(8),
  },
  skeletonLineShort: {
    width: '40%',
    height: moderateScale(14),
    borderRadius: moderateScale(4),
    backgroundColor: Colors.gray[100],
  },
  skeletonLineLong: {
    width: '80%',
    height: moderateScale(12),
    borderRadius: moderateScale(4),
    backgroundColor: Colors.gray[50],
  },
  skeletonFooter: {
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.gray[50],
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
    marginBottom: Spacing[5],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.md,
    gap: Spacing[1],
    ...Shadows.sm,
  },
  addButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  searchInput: {
    marginBottom: Spacing[6],
  },
  filterContainer: {
    marginBottom: Spacing[6],
    paddingRight: Spacing[4],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing[4],
    paddingRight: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    marginRight: Spacing[2],
    height: verticalScale(34),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
    ...Shadows.sm,
  },
  filterText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginRight: Spacing[2],
  },
  filterTextActive: {
    color: Colors.white,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeInactive: {
    backgroundColor: Colors.gray[100],
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  countText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: Colors.white,
  },
  statsContainer: {
    paddingBottom: Spacing[2],
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[3],
    marginRight: Spacing[3],
    minWidth: scale(115),
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  statCardActive: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[50],
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  sectionHeader: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    marginTop: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  applicantCard: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  mainInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  applicantName: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.orangeLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  matchScoreText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.orange,
  },
  applicantJob: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  jobLink: {
    color: Colors.primary[700],
    textDecorationLine: 'underline',
  },
  jobMeta: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.regular,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.regular,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  bottomLeft: {
    gap: Spacing[2],
  },
  bottomRight: {
    alignItems: 'flex-end',
    gap: Spacing[2],
  },
  timeAgo: {
    fontSize: 10,
    color: Colors.textDisabled,
    fontWeight: Typography.fontWeight.medium,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing[4],
    paddingVertical: moderateScale(6),
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[100],
    gap: 4,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  recommendedSection: {
    marginTop: Spacing[8],
    paddingBottom: Spacing[4],
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    gap: Spacing[2],
  },
  recommendedTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  recommendedScroll: {
    paddingHorizontal: Spacing[4],
  },
  recommendCard: {
    width: scale(115),
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginRight: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing[2],
    ...Shadows.sm,
  },
  recommendIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[10],
    marginTop: Spacing[8],
  },
  emptyIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
  clearFiltersBtn: {
    marginTop: Spacing[6],
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.primary[700],
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  clearFiltersText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
});
