import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Image,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, RFValue } from '@utils/responsive';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import type { SupportedLanguage, LanguageOption } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { MOCK_USER, MOCK_STATS } from '@utils/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Available language options
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'es', label: 'Español (LATAM)', flag: '🇪🇸' },
];

/**
 * Stat Card Component for Performance Section
 */
const StatCard = ({ 
  label, 
  value, 
  trend, 
  icon 
}: { 
  label: string; 
  value: string | number; 
  trend?: string;
  icon: string;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon as any} size={moderateScale(16)} color={Colors.primary[600]} />
      </View>
      {trend && (
        <View style={styles.trendBadge}>
          <Text style={styles.trendText}>{trend}</Text>
        </View>
      )}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
  </View>
);

/**
 * Settings Row Component
 */
const SettingRow = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightElement,
  destructive = false,
  isLast = false
}: { 
  icon: string; 
  title: string; 
  subtitle?: string; 
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
  isLast?: boolean;
}) => (
  <TouchableOpacity 
    style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingRowContent}>
      <View style={[styles.settingIconBox, destructive && { backgroundColor: Colors.accent.red + '10' }]}>
        <Ionicons 
          name={icon as any} 
          size={moderateScale(20)} 
          color={destructive ? Colors.accent.red : Colors.primary[700]} 
        />
      </View>
      <View style={styles.settingTextBox}>
        <Text style={[styles.settingTitle, destructive && { color: Colors.accent.red }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement ? rightElement : (
      <Ionicons 
        name="chevron-forward" 
        size={moderateScale(18)} 
        color={destructive ? Colors.accent.red : Colors.gray[400]} 
      />
    )}
  </TouchableOpacity>
);

/**
 * Main Profile Screen
 */
export default function ProfileScreen() {
  const { t, locale, changeLanguage } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const { logout } = useAuthStore();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    reminders: true,
  });

  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const user = MOCK_USER;

  const handleSignOut = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('profile.logout'), 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageSheet(false);
  };

  const currentLanguageLabel = LANGUAGE_OPTIONS.find(l => l.code === locale)?.label || 'English';

  return (
    <View style={styles.container}>
      {/* ── Header Backdrop ── */}
      <View style={[styles.headerBackdrop, { height: insets.top + verticalScale(160) }]} />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => console.log('Settings pressed')}
          >
            <Ionicons name="settings-outline" size={moderateScale(24)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + verticalScale(100) }
          ]}
        >
        {/* ── Identity Card ── */}
        <View style={styles.identityCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarShadow}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: user.avatar || 'https://i.pravatar.cc/150?u=jorge' }} 
                  style={styles.avatarImage} 
                />
                <View style={styles.statusIndicator} />
              </View>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={moderateScale(16)} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{t('profile.identity.role')}</Text>
              <View style={styles.dot} />
              <Text style={styles.teamText}>{t('profile.identity.team')}</Text>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="pencil" size={moderateScale(14)} color={Colors.primary[700]} style={{ marginRight: scale(6) }} />
            <Text style={styles.editProfileBtnText}>{t('profile.identity.editBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Performance Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile.sections.performance')}</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard 
              label={t('profile.stats.jobsPosted')} 
              value={MOCK_STATS.activeJobs} 
              trend="+2" 
              icon="briefcase-outline"
            />
            <StatCard 
              label={t('profile.stats.candidatesReviewed')} 
              value={MOCK_STATS.totalApplicants} 
              trend="+12" 
              icon="people-outline"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              label={t('profile.stats.interviewsConducted')} 
              value={38} 
              trend="+5" 
              icon="calendar-outline"
            />
            <StatCard 
              label={t('profile.stats.successfulHires')} 
              value={MOCK_STATS.hiredThisMonth} 
              icon="checkmark-circle-outline"
            />
          </View>
        </View>

        {/* ── Preferences Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile.sections.preferences')}</Text>
        </View>
        <View style={styles.optionsGroup}>
          <SettingRow 
            icon="language-outline" 
            title={t('profile.options.language')} 
            subtitle={currentLanguageLabel}
            onPress={() => setShowLanguageSheet(true)}
          />
          <SettingRow 
            icon="moon-outline" 
            title={t('profile.options.appearance')} 
            subtitle={t('profile.options.appearanceSub')}
            rightElement={
              <Switch 
                value={false} 
                onValueChange={() => {}} 
                trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
                thumbColor={Colors.white}
              />
            }
          />
          <SettingRow 
            icon="notifications-outline" 
            title={t('profile.options.notifications')} 
            subtitle={t('profile.options.notificationsSub')}
            onPress={() => console.log('Notifications')}
          />
          <SettingRow 
            icon="alarm-outline" 
            title={t('profile.options.scheduleAlerts')} 
            subtitle={t('profile.options.scheduleAlertsSub')}
            onPress={() => console.log('Schedule')}
            isLast
          />
        </View>

        {/* ── Account & Security ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile.sections.account')}</Text>
        </View>
        <View style={styles.optionsGroup}>
          <SettingRow 
            icon="shield-checkmark-outline" 
            title={t('profile.options.security')} 
            subtitle={t('profile.options.securitySub')}
            onPress={() => console.log('Security')}
          />
          <SettingRow 
            icon="finger-print-outline" 
            title={t('profile.options.activity')} 
            subtitle={t('profile.options.activitySub')}
            onPress={() => console.log('Activity')}
          />
          <SettingRow 
            icon="eye-outline" 
            title={t('profile.options.privacy')} 
            subtitle={t('profile.options.privacySub')}
            onPress={() => console.log('Privacy')}
            isLast
          />
        </View>

        {/* ── Support & Info ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile.sections.support')}</Text>
        </View>
        <View style={styles.optionsGroup}>
          <SettingRow 
            icon="help-buoy-outline" 
            title={t('profile.options.help')} 
            subtitle={t('profile.options.helpSub')}
            onPress={() => console.log('Help')}
          />
          <SettingRow 
            icon="information-circle-outline" 
            title={t('profile.options.about')} 
            subtitle={`${t('profile.options.version')} 1.2.4`}
            onPress={() => console.log('About')}
            isLast
          />
        </View>

        {/* ── Sign Out ── */}
        <View style={{ marginTop: verticalScale(10) }}>
          <SettingRow 
            icon="log-out-outline" 
            title={t('profile.logout')} 
            destructive
            onPress={handleSignOut}
            isLast
          />
        </View>

        <Text style={styles.footerText}>{t('common.appFooter')}</Text>
      </ScrollView>

      {/* ── Language Bottom Sheet ── */}
      <Modal
        visible={showLanguageSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageSheet(false)}
      >
        <Pressable 
          style={styles.sheetOverlay} 
          onPress={() => setShowLanguageSheet(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t('common.selectLanguage')}</Text>
            
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageItem,
                  locale === option.code && styles.languageItemSelected
                ]}
                onPress={() => handleLanguageSelect(option.code as SupportedLanguage)}
                activeOpacity={0.7}
              >
                <View style={styles.languageItemLeft}>
                  <Text style={styles.languageFlag}>{option.flag}</Text>
                  <Text style={[
                    styles.languageLabel,
                    locale === option.code && styles.languageLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {locale === option.code && (
                  <Ionicons name="checkmark-circle" size={moderateScale(24)} color={Colors.primary[600]} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.sheetCloseBtn}
              onPress={() => setShowLanguageSheet(false)}
            >
              <Text style={styles.sheetCloseText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary[900],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: RFValue(24),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  headerAction: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10), // Small top padding
  },
  
  // Identity Card
  identityCard: {
    backgroundColor: Colors.white,
    marginTop: verticalScale(40), // Push the card down so it overlaps the backdrop edge nicely
    borderRadius: moderateScale(28),
    padding: moderateScale(20),
    alignItems: 'center',
    ...Shadows.lg,
    marginBottom: verticalScale(24),
    overflow: 'visible', // Ensure avatar top doesn't clip
    zIndex: 1,
  },
  avatarSection: {
    position: 'relative',
    marginTop: verticalScale(-50),
    marginBottom: verticalScale(16),
  },
  avatarShadow: {
    padding: moderateScale(4),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(60),
    ...Shadows.md,
  },
  avatarContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editAvatarBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: Colors.primary[600],
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  userName: {
    fontSize: RFValue(20),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    marginBottom: verticalScale(4),
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(8),
  },
  roleText: {
    fontSize: RFValue(11),
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary[700],
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary[300],
    marginHorizontal: scale(6),
  },
  teamText: {
    fontSize: RFValue(11),
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary[600],
  },
  userEmail: {
    fontSize: RFValue(13),
    color: Colors.textSecondary,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: Colors.primary[100],
    backgroundColor: Colors.white,
  },
  editProfileBtnText: {
    fontSize: RFValue(13),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },

  // Stats
  sectionHeader: {
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(4),
  },
  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    marginBottom: verticalScale(24),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statIconContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    backgroundColor: Colors.success + '15',
    borderRadius: moderateScale(6),
  },
  trendText: {
    fontSize: RFValue(9),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  statValue: {
    fontSize: RFValue(20),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: RFValue(11),
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },

  // Options
  optionsGroup: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(24),
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(14),
  },
  settingTextBox: {
    flex: 1,
  },
  settingTitle: {
    fontSize: RFValue(15),
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: RFValue(11),
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },

  footerText: {
    textAlign: 'center',
    fontSize: RFValue(11),
    color: Colors.textDisabled,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },

  // Language Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(32),
    borderTopRightRadius: moderateScale(32),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(40),
    ...Shadows.lg,
  },
  sheetHandle: {
    width: scale(40),
    height: verticalScale(5),
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  sheetTitle: {
    fontSize: RFValue(20),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    marginBottom: verticalScale(24),
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
    borderWidth: 1.5,
    borderColor: Colors.divider,
  },
  languageItemSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: RFValue(24),
    marginRight: scale(16),
  },
  languageLabel: {
    fontSize: RFValue(16),
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  languageLabelSelected: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  sheetCloseBtn: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  sheetCloseText: {
    fontSize: RFValue(16),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
});
