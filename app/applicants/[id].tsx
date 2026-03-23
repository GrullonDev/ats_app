import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '@utils/responsive';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { Avatar, StatusBadge } from '@components/ui';
import { MOCK_APPLICANTS } from '@utils/mockData';

type TabType = 'resume' | 'notes' | 'history';

export default function CandidateProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  const applicant = MOCK_APPLICANTS.find((a) => a.id === id) || MOCK_APPLICANTS[0];

  const renderActionIcon = (name: string, label: string, icon: any) => (
    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color={Colors.textPrimary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{t('applicants.profileTitle')}</Text>
          <View style={styles.navActions}>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="share-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="ellipsis-vertical" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Avatar
            name={applicant.name}
            uri={applicant.avatar}
            isOnline={applicant.isOnline}
            size={moderateScale(100)}
            style={styles.mainAvatar}
          />
          <Text style={styles.name}>{applicant.name}</Text>
          <Text style={styles.jobTitle}>{applicant.jobTitle}</Text>
          
          <View style={styles.statusLocationRow}>
            <StatusBadge
              label={t(`applicants.stages.${applicant.stage}`)}
              variant={applicant.stage as any}
            />
            <Text style={styles.dot}>•</Text>
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>

          <View style={styles.actionsRow}>
            {renderActionIcon('email', t('applicants.actions.email'), 'mail-outline')}
            {renderActionIcon('call', t('applicants.actions.call'), 'call-outline')}
            {renderActionIcon('linkedin', t('applicants.actions.linkedin'), 'logo-linkedin')}
            {renderActionIcon('cv', t('applicants.actions.cv'), 'document-text-outline')}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {(['resume', 'notes', 'history'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {t(`applicants.tabs.${tab}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'resume' && (
            <View style={styles.resumeContent}>
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>{t('applicants.contactInfo')}</Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('applicants.emailAddress')}</Text>
                  <Text style={styles.infoValue}>{applicant.email}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('applicants.phoneNumber')}</Text>
                  <Text style={styles.infoValue}>+1 (555) 012-3456</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('applicants.location')}</Text>
                  <Text style={styles.infoValue}>San Francisco, CA</Text>
                </View>
              </View>

              <View style={styles.fileCard}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document-outline" size={24} color={Colors.primary[700]} />
                  <Text style={styles.fileName}>Resume_{applicant.name?.replace(' ', '_')}.pdf</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.downloadText}>{t('applicants.download')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* Otros tabs placeholders */}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={[styles.bottomIconBtn, styles.rejectBtn]}>
            <Ionicons name="close-outline" size={24} color={Colors.accent.red} />
            <Text style={styles.rejectText}>{t('applicants.actions.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIconBtn}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.iconBtnLabel}>{t('applicants.actions.message')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nextStageBtn} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.nextStageText}>{t('applicants.actions.moveToNext')}</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[2],
    height: verticalScale(56),
  },
  navButton: {
    padding: Spacing[2],
  },
  navTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  navActions: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing[8],
    paddingBottom: Spacing[6],
  },
  mainAvatar: {
    marginBottom: Spacing[4],
  },
  name: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobTitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semiBold,
    marginTop: 2,
  },
  statusLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  stageBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
  },
  stageBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  dot: {
    marginHorizontal: Spacing[2],
    color: Colors.textSecondary,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing[8],
    marginTop: Spacing[8],
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[2],
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: Spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[4],
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[700],
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeTabText: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.bold,
  },
  tabContent: {
    padding: Spacing[4],
  },
  resumeContent: {
    marginTop: Spacing[2],
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textDisabled,
    letterSpacing: 1,
    marginBottom: Spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing[2],
  },
  downloadText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    flex: 1,
  },
  bottomIconBtn: {
    alignItems: 'center',
    marginRight: Spacing[6],
  },
  rejectBtn: {
    // Especial style for reject?
  },
  rejectText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.red,
    marginTop: 2,
  },
  iconBtnLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  nextStageBtn: {
    backgroundColor: Colors.primary[800],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    height: verticalScale(56),
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    flex: 2,
  },
  nextStageText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginRight: Spacing[2],
  },
});
