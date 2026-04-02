<<<<<<< HEAD
import React, { useState, useMemo, useEffect } from 'react';
=======
import React, { useState, useMemo, useCallback, useEffect } from 'react';
>>>>>>> main
import {
  View,
  Text,
  StyleSheet,
<<<<<<< HEAD
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
=======
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  StatusBar,
  useWindowDimensions,
  Platform,
  Modal,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { MOCK_APPLICANTS, MOCK_JOBS } from '@utils/mockData';
import type { ApplicantStatus, Applicant } from '@/types/index';

/**
 * Screen for Applicants with responsive design and full interactive functionality
 */
export default function ApplicantsTab() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ jobId?: string }>();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ApplicantStatus | 'all'>('all');
  const [jobIdFilter, setJobIdFilter] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  // Update jobId filter when params change
  useEffect(() => {
    if (params.jobId) {
      setJobIdFilter(params.jobId);
    }
  }, [params.jobId]);

  // Form State for New Applicant
  const [newName, setNewName] = useState('');
  const [newJobId, setNewJobId] = useState(MOCK_JOBS[0].id);

  // Responsive logic
  const isSmallScreen = width < 375;
  const isTablet = width > 768;
  const metricCardWidth = isTablet ? '23.5%' : isSmallScreen ? '47%' : '23.5%';
  const horizontalPadding = isTablet ? Spacing[8] : Spacing[5];

  // Filters for the top bar
  const filterTabs = [
    { id: 'all', label: t('applicants.filterAll') },
    { id: 'new', label: t('applicants.filterApplied') },
    { id: 'screening', label: t('applicants.filterScreening') },
    { id: 'interviewing', label: t('applicants.filterInterview') },
    { id: 'offered', label: t('applicants.filterOffer') },
  ];

  // Logic for filtering
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      // Filter by status tab
      const matchesStatus = activeFilter === 'all' || applicant.status === activeFilter;
      
      // Filter by jobId (if navigated from Dashboard)
      const matchesJobId = !jobIdFilter || applicant.jobId === jobIdFilter;
      
      // Filter by search query
      const job = MOCK_JOBS.find(j => j.id === applicant.jobId);
      const matchesSearch = 
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        
      return matchesStatus && matchesJobId && matchesSearch;
    });
  }, [applicants, activeFilter, jobIdFilter, searchQuery]);


  // Statistics for the metrics bar
  const stats = useMemo(() => [
    { label: t('applicants.metrics.total'), value: applicants.length, color: Colors.navy },
    { label: t('applicants.metrics.new'), value: applicants.filter(a => a.status === 'new').length, color: Colors.accentBlue },
    { label: t('applicants.metrics.interview'), value: applicants.filter(a => a.status === 'interviewing').length, color: Colors.accent.purple },
    { label: t('applicants.metrics.hired'), value: applicants.filter(a => a.status === 'hired').length, color: Colors.success },
  ], [applicants, t]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('all');
    setJobIdFilter(null);
  }, []);


  const handleOpenDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsDetailModalVisible(true);
  };

  const handleAddApplicant = () => {
    if (!newName.trim()) return;

    const newApplicant: Applicant = {
      id: `a${applicants.length + 1}`,
      name: newName,
      jobId: newJobId,
      status: 'new',
      stage: 'application',
      appliedDate: new Date().toISOString(),
      score: 0,
      email: `${newName.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1 (555) 000-0000',
    };

    setApplicants([newApplicant, ...applicants]);
    setNewName('');
    setIsAddModalVisible(false);
  };

  const renderApplicantCard = ({ item }: { item: Applicant }) => {
    const job = MOCK_JOBS.find(j => j.id === item.jobId);
    
    // Status color mapping
    const getStatusStyles = (status: string) => {
      switch (status) {
        case 'interviewing': return Colors.status.interview;
        case 'screening': return Colors.status.screening;
        case 'new': return Colors.status.review;
        case 'offered': return Colors.status.offer;
        case 'hired': return Colors.status.hired;
        case 'rejected': return Colors.status.rejected;
        default: return Colors.status.review;
      }
    };

    const statusStyles = getStatusStyles(item.status);
    const statusLabel = t(`applicants.status.${item.status}`);

    return (
      <TouchableOpacity 
        style={[styles.applicantCard, isTablet && styles.applicantCardTablet]} 
        activeOpacity={0.7}
        onPress={() => handleOpenDetails(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
              <View style={styles.onlineBadge} />
            </View>
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={styles.applicantName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.jobTitle} numberOfLines={1}>{job?.title || t('applicants.unknownPosition')}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.timeAgo}>• {t('common.today')}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.score ? (item.score/20).toFixed(1) : t('applicants.ratingNew')}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
            <Text style={[styles.statusText, { color: statusStyles.text }]}>{statusLabel}</Text>
          </View>
          <View style={styles.chevronButton}>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ── Header Naval ── */}
      <View style={[styles.header, isTablet && { height: 220 }]}>
        <SafeAreaView edges={['top']} style={[styles.headerContent, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{t('applicants.allApplicants')}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {t('applicants.candidatesCount', { count: applicants.length })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.headerAction} 
            activeOpacity={0.7}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Ionicons name="add" size={26} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <View style={styles.mainContent}>
        {/* ── Búsqueda y Filtros ── */}
        <View style={[styles.searchContainer, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.gray[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('applicants.searchPlaceholder')}
              placeholderTextColor={Colors.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <View style={styles.filterBarContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterBarContent, { paddingHorizontal: horizontalPadding }]}
          >
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterTab,
                  activeFilter === tab.id && styles.filterTabActive
                ]}
                onPress={() => setActiveFilter(tab.id as ApplicantStatus | 'all')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === tab.id && styles.filterTabTextActive
                ]}>
                  {tab.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredApplicants}
          renderItem={renderApplicantCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontalPadding }]}
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? 'tablet-list' : 'mobile-list'}
          columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
          initialNumToRender={10}
          ListHeaderComponent={
            <View style={styles.metricsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={[styles.metricCard, { width: metricCardWidth }]}>
                  <Text style={[styles.metricValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.metricLabel} numberOfLines={1}>{stat.label}</Text>
                </View>
              ))}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="search-outline" size={48} color={Colors.gray[300]} />
              </View>
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
              <TouchableOpacity 
                onPress={handleResetFilters}
                style={styles.resetButton}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>{t('common.clearFilters')}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {/* ── Modal Detalle Aplicante ── */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('applicants.title')}</Text>
              <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {selectedApplicant && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailCard}>
                  <View style={styles.avatarLarge}>
                    <Text style={styles.avatarLargeText}>{selectedApplicant.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.detailName}>{selectedApplicant.name}</Text>
                  <Text style={styles.detailJob}>{MOCK_JOBS.find(j => j.id === selectedApplicant.jobId)?.title}</Text>
                  
                  <View style={styles.detailInfoGrid}>
                    <View style={styles.infoItem}>
                      <Ionicons name="mail-outline" size={18} color={Colors.gray[400]} />
                      <Text style={styles.infoText}>{selectedApplicant.email || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="call-outline" size={18} color={Colors.gray[400]} />
                      <Text style={styles.infoText}>{selectedApplicant.phone || 'N/A'}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setIsDetailModalVisible(false)}
                >
                  <Text style={styles.actionButtonText}>{t('common.viewAll')}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Modal Nuevo Aplicante ── */}
      <Modal
        visible={isAddModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.addModalContent}>
            <Text style={styles.modalTitle}>{t('welcome.applicants')}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('applicants.fullNamePlaceholder')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('applicants.fullNamePlaceholder')}
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('jobs.title')}</Text>
              <View style={styles.jobPickerContainer}>
                {MOCK_JOBS.slice(0, 3).map((job) => (
                  <TouchableOpacity 
                    key={job.id}
                    style={[styles.jobOption, newJobId === job.id && styles.jobOptionActive]}
                    onPress={() => setNewJobId(job.id)}
                  >
                    <Text style={[styles.jobOptionText, newJobId === job.id && styles.jobOptionTextActive]}>
                      {job.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddApplicant}
              >
                <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
>>>>>>> main
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
<<<<<<< HEAD
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
=======
  header: {
    backgroundColor: Colors.navy,
    paddingBottom: Spacing[10],
    height: 160,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  headerTextContainer: {
    flex: 1,
    marginRight: Spacing[4],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
>>>>>>> main
    alignItems: 'center',
    marginBottom: Spacing[5],
  },
  mainContent: {
    flex: 1,
    marginTop: -Spacing[8],
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  searchContainer: {
    marginTop: Spacing[6],
    marginBottom: Spacing[4],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    height: 52,
    ...Shadows.md,
  },
  searchIcon: {
    marginRight: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    height: '100%',
  },
  filterBarContainer: {
    height: 44,
    marginBottom: Spacing[4],
  },
  filterBarContent: {
    alignItems: 'center',
    gap: Spacing[2],
  },
  filterTab: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 85,
  },
  filterTabActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingBottom: Spacing[10],
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing[4],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing[6],
    marginTop: Spacing[2],
    gap: Spacing[3],
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    alignItems: 'center',
    ...Shadows.sm,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  applicantCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  applicantCardTablet: {
    flex: 0.485,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Spacing[4],
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cardInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 17,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  ratingContainer: {
    backgroundColor: Colors.gray[50],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
<<<<<<< HEAD
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
=======
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
  },
  chevronButton: {
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    marginTop: Spacing[4],
    ...Shadows.md,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[5],
  },
  emptyText: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing[6],
  },
  resetButton: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing[8],
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  resetButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: 15,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    padding: Spacing[6],
    maxHeight: '80%',
  },
  addModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    padding: Spacing[6],
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing[6],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  detailCard: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  detailName: {
    fontSize: 22,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailJob: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  detailInfoGrid: {
    width: '100%',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    gap: Spacing[3],
  },
  infoItem: {
>>>>>>> main
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
<<<<<<< HEAD
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
=======
  infoText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  actionButton: {
    backgroundColor: Colors.navy,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: Spacing[4],
    marginTop: Spacing[2],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  jobOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobOptionActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  jobOptionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  jobOptionTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing[4],
    marginTop: Spacing[6],
  },
  modalButton: {
    flex: 1,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[100],
  },
  confirmButton: {
    backgroundColor: Colors.navy,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  confirmButtonText: {
>>>>>>> main
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
});
