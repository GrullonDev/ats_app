import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, RFValue } from '@utils/responsive';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { useAuthStore } from '@store/authStore';
import type { SupportedLanguage, LanguageOption } from '@/types';
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
        name=\"chevron-forward\" 
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
  const { logout, user: authUser, updateUser } = useAuthStore();
  
  // State for user data (local editing)
  const [userData, setUserData] = useState({
    name: authUser?.name || MOCK_USER.name,
    role: authUser?.department || MOCK_USER.department || MOCK_USER.role,
    email: authUser?.email || MOCK_USER.email,
  });

  // Modal States
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Sync state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUserData({
        name: authUser.name,
        email: authUser.email,
        role: authUser.department || authUser.role || '',
      });
    }
  }, [authUser]);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageSheet(false);
  };

  const currentLanguageLabel = LANGUAGE_OPTIONS.find(l => l.code === locale)?.label || 'English';

  const handleSaveProfile = () => {
    updateUser({ 
      name: userData.name, 
      email: userData.email,
      department: userData.role 
    });
    setShowEditProfileModal(false);
    Alert.alert(t('common.save'), t('profile.updatePersonalInfo'));
  };

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

  // Profile Initials
  const userInitials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      {/* ── Header Backdrop ── */}
      <View style={[styles.headerBackdrop, { height: insets.top + verticalScale(160) }]} />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => setShowEditProfileModal(true)}
          >
            <Ionicons name=\"create-outline\" size={moderateScale(24)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + verticalScale(60) }
          ]}
        >
          {/* ── Identity Card ── */}
          <View style={styles.identityCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarShadow}>
                <View style={[styles.avatarContainer, { backgroundColor: Colors.primary[700] }]}>
                   <Text style={styles.avatarInitials} allowFontScaling={false}>
                      {userInitials}
                   </Text>
                   <View style={styles.statusIndicator} />
                </View>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setShowEditProfileModal(true)}>
                <Ionicons name=\"camera\" size={moderateScale(16)} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{userData.role || t('profile.identity.role')}</Text>
              </View>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>

            <TouchableOpacity 
              style={styles.editProfileBtn} 
              onPress={() => setShowEditProfileModal(true)}
            >
              <Ionicons name=\"pencil\" size={moderateScale(14)} color={Colors.primary[700]} style={{ marginRight: scale(6) }} />
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
                trend=\"+2\" 
                icon=\"briefcase-outline\"
              />
              <StatCard 
                label={t('profile.stats.candidatesReviewed')} 
                value={MOCK_STATS.totalApplicants} 
                trend=\"+12\" 
                icon=\"people-outline\"
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                label={t('profile.stats.interviewsConducted')} 
                value={38} 
                trend=\"+5\" 
                icon=\"calendar-outline\"
              />
              <StatCard 
                label={t('profile.stats.successfulHires')} 
                value={MOCK_STATS.hiredThisMonth} 
                icon=\"checkmark-circle-outline\"
              />
            </View>
          </View>

          {/* ── Preferences Section ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profile.sections.preferences')}</Text>
          </View>
          <View style={styles.optionsGroup}>
            <SettingRow 
              icon=\"language-outline\" 
              title={t('profile.options.language')} 
              subtitle={currentLanguageLabel}
              onPress={() => setShowLanguageSheet(true)}
            />
            <SettingRow 
              icon=\"moon-outline\" 
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
              icon=\"notifications-outline\" 
              title={t('profile.options.notifications')} 
              subtitle={t('profile.options.notificationsSub')}
              onPress={() => setShowPreferencesModal(true)}
            />
            <SettingRow 
              icon=\"alarm-outline\" 
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
              icon=\"shield-checkmark-outline\" 
              title={t('profile.options.security')} 
              subtitle={t('profile.options.securitySub')}
              onPress={() => setShowSecurityModal(true)}
            />
            <SettingRow 
              icon=\"finger-print-outline\" 
              title={t('profile.options.activity')} 
              subtitle={t('profile.options.activitySub')}
              onPress={() => console.log('Activity')}
            />
            <SettingRow 
              icon=\"eye-outline\" 
              title={t('profile.options.privacy')} 
              subtitle={t('profile.options.privacySub')}
              onPress={() => console.log('Privacy')}
              isLast
            />
          </View>

          {/* ── Sign Out ── */}
          <View style={{ marginTop: verticalScale(10) }}>
            <SettingRow 
              icon=\"log-out-outline\" 
              title={t('profile.logout')} 
              destructive
              onPress={handleSignOut}
              isLast
            />
          </View>

          <Text style={styles.footerText}>{t('common.appFooter')}</Text>
        </ScrollView>
      </SafeAreaView>

      {/* ── Modal: Editar Perfil ── */}
      <Modal
        visible={showEditProfileModal}
        animationType=\"slide\"
        transparent={false}
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <SafeAreaView style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalFullTitle}>{t('profile.editProfile')}</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSaveText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalBody}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.editAvatarContainer}>
                <View style={styles.avatarPlaceholderLarge}>
                  <Text style={styles.avatarTextLarge}>
                    {userInitials}
                  </Text>
                  <TouchableOpacity style={styles.editBadge}>
                    <Ionicons name=\"camera\" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('profile.firstName')}</Text>
                <TextInput
                  style={styles.input}
                  value={userData.name}
                  onChangeText={(val) => setUserData({ ...userData, name: val })}
                  placeholder={t('profile.firstName')}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('profile.jobTitle')}</Text>
                <TextInput
                  style={styles.input}
                  value={userData.role}
                  onChangeText={(val) => setUserData({ ...userData, role: val })}
                  placeholder={t('profile.jobTitle')}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('profile.email')}</Text>
                <TextInput
                  style={styles.input}
                  value={userData.email}
                  onChangeText={(val) => setUserData({ ...userData, email: val })}
                  placeholder={t('profile.email')}
                  keyboardType=\"email-address\"
                  autoCapitalize=\"none\"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ── Language Bottom Sheet ── */}
      <Modal
        visible={showLanguageSheet}
        transparent
        animationType=\"fade\"
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
                  <Ionicons name=\"checkmark-circle\" size={moderateScale(24)} color={Colors.primary[600]} />
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

      {/* ── Preferences Modal ── */}
      <Modal
        visible={showPreferencesModal}
        transparent
        animationType=\"fade\"
        onRequestClose={() => setShowPreferencesModal(false)}
      >
        <Pressable style={styles.modalOverlaySmall} onPress={() => setShowPreferencesModal(false)}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.smallModalTitle}>{t('profile.preferences')}</Text>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>{t('profile.options.notifications')}</Text>
              <Switch value={true} onValueChange={() => {}} />
            </View>
            <TouchableOpacity style={styles.closeBtnSmall} onPress={() => setShowPreferencesModal(false)}>
              <Text style={styles.closeBtnTextSmall}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ── Security Modal ── */}
      <Modal
        visible={showSecurityModal}
        transparent
        animationType=\"fade\"
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <Pressable style={styles.modalOverlaySmall} onPress={() => setShowSecurityModal(false)}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.smallModalTitle}>{t('profile.options.security')}</Text>
            <Text style={styles.modalInfoText}>{t('profile.options.securitySub')}</Text>
            <TouchableOpacity style={styles.closeBtnSmall} onPress={() => setShowSecurityModal(false)}>
              <Text style={styles.closeBtnTextSmall}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    backgroundColor: Colors.primary[900], // Navy blue
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: RFValue(22),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  headerAction: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
  },
  identityCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(28),
    padding: moderateScale(24),
    alignItems: 'center',
    marginBottom: verticalScale(24),
    ...Shadows.lg,
  },
  avatarSection: {
    marginBottom: verticalScale(16),
  },
  avatarShadow: {
    ...Shadows.md,
    borderRadius: moderateScale(50),
  },
  avatarContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarInitials: {
    fontSize: moderateScale(36),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: moderateScale(5),
    right: moderateScale(5),
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  userName: {
    fontSize: RFValue(20),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(4),
  },
  roleText: {
    fontSize: RFValue(11),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  userEmail: {
    fontSize: RFValue(12),
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.primary[50],
  },
  editProfileBtnText: {
    fontSize: RFValue(12),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  sectionHeader: {
    marginBottom: verticalScale(12),
    paddingLeft: scale(4),
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    gap: verticalScale(12),
    marginBottom: verticalScale(24),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
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
    marginBottom: verticalScale(8),
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
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
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
  },
  // Modal Edit Profile
  modalBg: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalFullTitle: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  modalBody: {
    flex: 1,
    padding: Spacing[5],
  },
  editAvatarContainer: {
    alignItems: 'center',
    marginVertical: Spacing[8],
  },
  avatarPlaceholderLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.md,
  },
  avatarTextLarge: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: Spacing[5],
  },
  label: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
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
    paddingVertical: verticalScale(14),
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
  // Small Modals
  modalOverlaySmall: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[5],
  },
  smallModalContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[6],
    ...Shadows.lg,
  },
  smallModalTitle: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  preferenceLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  closeBtnSmall: {
    marginTop: Spacing[4],
    alignItems: 'center',
  },
  closeBtnTextSmall: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
});
