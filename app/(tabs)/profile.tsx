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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, RFValue, WINDOW_WIDTH } from '@utils/responsive';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import type { SupportedLanguage, LanguageOption } from '@/types';
import { MOCK_USER, MOCK_STATS } from '@utils/mockData';

// Opciones de idioma disponibles
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

/**
 * Componente de Tarjeta de Estadísticas
 */
const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statSubtext}>{subtext}</Text>
  </View>
);

/**
 * Componente de Item de Ajustes (Navegación)
 */
const SettingItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  iconColor = Colors.primary[700], 
  badgeColor = Colors.primary[50],
  isLast = false,
  destructive = false
}: { 
  icon: string; 
  title: string; 
  subtitle?: string; 
  onPress?: () => void;
  iconColor?: string;
  badgeColor?: string;
  isLast?: boolean;
  destructive?: boolean;
}) => (
  <TouchableOpacity 
    style={[styles.settingItem, isLast && { borderBottomWidth: 0 }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingContent}>
      <View style={[styles.settingIconContainer, { backgroundColor: badgeColor }]}>
        <Ionicons name={icon as any} size={moderateScale(20)} color={iconColor} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, destructive && { color: Colors.accent.red }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons 
      name="chevron-forward" 
      size={moderateScale(18)} 
      color={destructive ? Colors.accent.red : Colors.gray[400]} 
    />
  </TouchableOpacity>
);

/**
 * Componente de Item de Notificación (Switch)
 */
const NotificationItem = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onValueChange,
  isLast = false
}: { 
  icon: string; 
  title: string; 
  subtitle?: string; 
  value: boolean; 
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) => (
  <View style={[styles.settingItem, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.settingContent}>
      <View style={styles.notificationIconContainer}>
        <Ionicons name={icon as any} size={moderateScale(22)} color={Colors.gray[700]} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch 
      value={value} 
      onValueChange={onValueChange}
      trackColor={{ false: Colors.gray[200], true: Colors.primary[700] }}
      thumbColor={Colors.white}
    />
  </View>
);

/**
 * Pantalla de Perfil Mejorada
 */
export default function ProfileScreen() {
  const { t, locale, changeLanguage } = useTranslation();

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    schedule: false,
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const user = MOCK_USER;

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
  };

  return (
    <View style={styles.container}>
      {/* ── Header Azul Oscuro ── */}
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="add" size={moderateScale(28)} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Espaciador para evitar recorte del avatar */}
        <View style={{ height: verticalScale(65) }} />

        {/* ── Tarjeta de Perfil Principal ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Image 
                   source={{ uri: 'https://i.pravatar.cc/150?u=alex' }} 
                   style={styles.avatarImage} 
                />
              )}
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileRole}>Senior Recruiter</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          {/* Grid de Estadísticas */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard label="Jobs Posted" value={MOCK_STATS.activeJobs} subtext="+2 this month" />
              <StatCard label="Candidates Reviewed" value={MOCK_STATS.totalApplicants} subtext="+42 this week" />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Interviews Conducted" value={38} subtext="5 this week" />
              <StatCard label="Successful Hires" value={MOCK_STATS.hiredThisMonth} subtext="This month" />
            </View>
          </View>
        </View>

        {/* ── Sección de Ajustes ── */}
        <Text style={styles.sectionLabel}>{t('profile.settings')}</Text>
        <View style={styles.settingsGroup}>
          <SettingItem 
            icon="person-outline" 
            title={t('profile.editProfile')} 
            subtitle={t('profile.editProfileSub')}
            badgeColor={Colors.gray[50]}
            iconColor={Colors.gray[700]}
          />
          <SettingItem 
            icon="sparkles-outline" 
            title={t('profile.preferences')} 
            subtitle={t('profile.preferencesSub')}
            badgeColor={Colors.gray[50]}
            iconColor={Colors.gray[700]}
          />
          <SettingItem 
            icon="lock-closed-outline" 
            title={t('profile.security')} 
            subtitle={t('profile.securitySub')}
            badgeColor={Colors.gray[50]}
            iconColor={Colors.gray[700]}
            isLast
          />
        </View>

        {/* ── Sección de Notificaciones ── */}
        <Text style={styles.sectionLabel}>{t('profile.notifications')}</Text>
        <View style={styles.settingsGroup}>
          <NotificationItem 
            icon="notifications-outline" 
            title={t('profile.push')} 
            subtitle={t('profile.pushSub')}
            value={notifications.push}
            onValueChange={(v) => setNotifications(prev => ({ ...prev, push: v }))}
          />
          <NotificationItem 
            icon="mail-outline" 
            title={t('profile.email')} 
            subtitle={t('profile.emailSub')}
            value={notifications.email}
            onValueChange={(v) => setNotifications(prev => ({ ...prev, email: v }))}
          />
          <NotificationItem 
            icon="calendar-outline" 
            title={t('profile.schedule')} 
            subtitle={t('profile.scheduleSub')}
            value={notifications.schedule}
            onValueChange={(v) => setNotifications(prev => ({ ...prev, schedule: v }))}
            isLast
          />
        </View>

        {/* ── Otras Opciones ── */}
        <View style={styles.settingsGroup}>
          <SettingItem 
            icon="time-outline" 
            title={t('profile.activity')} 
            badgeColor={Colors.white}
            iconColor={Colors.gray[700]}
          />
          <SettingItem 
            icon="help-circle-outline" 
            title={t('profile.help')} 
            badgeColor={Colors.white}
            iconColor={Colors.gray[700]}
          />
          <SettingItem 
            icon="exit-outline" 
            title={t('profile.logout')} 
            badgeColor={Colors.white}
            iconColor={Colors.accent.red}
            destructive
            isLast
          />
        </View>

        <Text style={styles.versionText}>Recruitment Dashboard v1.0.0</Text>
        
        <View style={{ height: verticalScale(20) }} />
      </ScrollView>

      {/* ── Modal de selección de idioma (Mantenido por funcionalidad) ── */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Language</Text>

            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageOption,
                  locale === option.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageSelect(option.code)}
                activeOpacity={0.8}
              >
                <Text style={styles.languageFlag}>{option.flag}</Text>
                <Text style={[
                  styles.languageLabel,
                  locale === option.code && styles.languageLabelSelected,
                ]}>
                  {option.label}
                </Text>
                {locale === option.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={moderateScale(22)}
                    color={Colors.primary[700]}
                  />
                )}
              </TouchableOpacity>
            ))}
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
  headerBackground: {
    backgroundColor: Colors.primary[900],
    height: verticalScale(180),
    paddingHorizontal: scale(16),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(8),
  },
  headerTitle: {
    fontSize: RFValue(24),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
    marginTop: verticalScale(-120), // Ajustativo para que el espaciador compense
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(120),
  },

  // ── Tarjeta de Perfil Principal ──
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(24),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
    ...Shadows.md,
    marginBottom: verticalScale(20),
    zIndex: 1,
    overflow: 'visible',
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: verticalScale(-60),
    marginBottom: verticalScale(10),
    zIndex: 100,
    elevation: 20,
  },
  avatarContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    padding: moderateScale(4),
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.white, // Borde blanco limpio
    ...Shadows.sm,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(50),
  },
  onlineBadge: {
    position: 'absolute',
    bottom: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: {
    fontSize: RFValue(22),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    marginTop: verticalScale(8), // Compensa la elevación del avatar
    marginBottom: verticalScale(2),
  },
  profileRole: {
    fontSize: RFValue(14),
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: verticalScale(2),
  },
  profileEmail: {
    fontSize: RFValue(12),
    color: Colors.textDisabled,
    marginBottom: verticalScale(15),
  },

  // ── Grid de Estadísticas ──
  statsGrid: {
    width: '100%',
    marginTop: verticalScale(5),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
    marginBottom: verticalScale(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.gray[50], // Gris muy tenue para un look más limpio
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    minHeight: verticalScale(80),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  statValue: {
    fontSize: RFValue(18),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[900],
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: RFValue(10),
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray[600],
    letterSpacing: 0.1,
  },
  statSubtext: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },

  // ── Secciones de Ajustes ──
  sectionLabel: {
    fontSize: RFValue(10),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    letterSpacing: 1,
    marginBottom: verticalScale(8),
    marginLeft: scale(4),
    textTransform: 'uppercase',
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: verticalScale(20),
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  notificationIconContainer: {
    width: moderateScale(38),
    height: moderateScale(38),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: RFValue(14),
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    marginTop: verticalScale(1),
  },

  versionText: {
    textAlign: 'center',
    fontSize: RFValue(10),
    color: Colors.textDisabled,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(20),
  },

  // ── Modal de idioma ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    width: '100%',
    maxWidth: 320,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  languageOptionSelected: {
    borderColor: Colors.primary[700],
    backgroundColor: Colors.primary[50],
  },
  languageFlag: {
    fontSize: RFValue(24),
    marginRight: scale(12),
  },
  languageLabel: {
    flex: 1,
    fontSize: RFValue(16),
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  languageLabelSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.bold,
  },
});
