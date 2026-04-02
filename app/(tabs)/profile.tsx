import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { useAuthStore } from '@store/authStore';
import type { SupportedLanguage, LanguageOption } from '@/types/index';
import { MOCK_USER } from '@utils/mockData';

// Opciones de idioma disponibles
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

/**
 * Pantalla de Perfil mejorada con el nuevo diseño
 */
export default function ProfileTab() {
  const { t, locale, changeLanguage } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { logout, user: authUser } = useAuthStore();

  const user = authUser || MOCK_USER;

  const handleLogout = () => {
    logout();
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ── Header Naval ── */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('tabs.profile')}</Text>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Ionicons name="add" size={26} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Tarjeta de Perfil flotante ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={Colors.primary[700]} />
              </View>
              <View style={styles.onlineBadge} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.department || user.role}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* ── Cuadrícula de Métricas ── */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>12</Text>
              <Text style={styles.metricLabel}>{t('profile.jobsPosted')}</Text>
              <Text style={styles.metricSubtext}>+2 {t('profile.thisMonth')}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>245</Text>
              <Text style={styles.metricLabel}>{t('profile.candidatesReviewed')}</Text>
              <Text style={styles.metricSubtext}>+42 {t('profile.thisWeek')}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>38</Text>
              <Text style={styles.metricLabel}>{t('profile.interviewsConducted')}</Text>
              <Text style={styles.metricSubtext}>5 {t('profile.thisWeek')}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>8</Text>
              <Text style={styles.metricLabel}>{t('profile.successfulHires')}</Text>
              <Text style={styles.metricSubtext}>{t('profile.thisMonth')}</Text>
            </View>
          </View>
        </View>

        {/* ── Sección de Ajustes ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.settings').toUpperCase()}</Text>
          
          {/* Edit Profile */}
          <TouchableOpacity style={styles.settingListItem} activeOpacity={0.7}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="person-outline" size={20} color={Colors.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingItemTitle}>{t('profile.editProfile')}</Text>
              <Text style={styles.settingItemSubtitle}>{t('profile.updatePersonalInfo')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Preferences */}
          <TouchableOpacity style={styles.settingListItem} activeOpacity={0.7}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="sparkles-outline" size={20} color={Colors.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingItemTitle}>{t('profile.preferences')}</Text>
              <Text style={styles.settingItemSubtitle}>{t('profile.customizeExperience')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Security */}
          <TouchableOpacity style={styles.settingListItem} activeOpacity={0.7}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingItemTitle}>{t('profile.security')}</Text>
              <Text style={styles.settingItemSubtitle}>{t('profile.passwordAuth')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Cambio de Idioma */}
          <TouchableOpacity 
            style={styles.settingListItem} 
            activeOpacity={0.7}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: Colors.infoLight }]}>
              <Ionicons name="language-outline" size={20} color={Colors.info} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingItemTitle}>{t('profile.changeLanguage')}</Text>
              <Text style={styles.settingItemSubtitle}>
                {locale === 'es' ? 'Español' : 'English'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* ── Modal de Selección de Idioma ── */}
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
            <Text style={styles.modalTitle}>{t('common.selectLanguage')}</Text>

            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageOption,
                  locale === option.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageSelect(option.code as SupportedLanguage)}
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
                    size={22}
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
  header: {
    backgroundColor: Colors.navy,
    height: 180,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['3xl'],
    marginTop: -70,
    padding: Spacing[5],
    alignItems: 'center',
    ...Shadows.lg,
  },
  avatarContainer: {
    marginTop: -Spacing[12],
    marginBottom: Spacing[4],
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[50],
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  userName: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    justifyContent: 'center',
  },
  metricItem: {
    width: '47%',
    backgroundColor: Colors.statsBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    alignItems: 'flex-start',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.navy,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  metricSubtext: {
    fontSize: 10,
    color: Colors.accentBlue,
    fontWeight: Typography.fontWeight.medium,
  },
  sectionContainer: {
    marginTop: Spacing[6],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accentBlue,
    marginBottom: Spacing[3],
    letterSpacing: 1,
  },
  settingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
  },
  settingTextContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  settingItemSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },
  logoutText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.error,
    marginLeft: Spacing[2],
  },
  footerSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[5],
  },
  modalContainer: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[5],
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[2],
  },
  languageOptionSelected: {
    borderColor: Colors.primary[700],
    backgroundColor: Colors.primary[50],
  },
  languageFlag: {
    fontSize: 24,
    marginRight: Spacing[4],
  },
  languageLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  languageLabelSelected: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
});
