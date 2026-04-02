import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  StatusBar,
  useWindowDimensions,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ApplicantStatus | 'all'>('all');
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
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
      const matchesFilter = activeFilter === 'all' || applicant.status === activeFilter;
      const job = MOCK_JOBS.find(j => j.id === applicant.jobId);
      const matchesSearch = 
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesFilter && matchesSearch;
    });
  }, [applicants, activeFilter, searchQuery]);

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
            <Text style={styles.jobTitle} numberOfLines={1}>{job?.title || 'Unknown Position'}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.timeAgo}>• {t('common.today')}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.score ? (item.score/20).toFixed(1) : 'New'}</Text>
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
              <Text style={styles.inputLabel}>{t('auth.username')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre completo"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
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
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
});
