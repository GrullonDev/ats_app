import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '@utils/responsive';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import type { SupportedLanguage, LanguageOption } from '@types/index';
import { MOCK_USER } from '@utils/mockData';

// Opciones de idioma disponibles
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

/**
 * Pantalla de Perfil con opción de cambio de idioma
 */
export default function ProfileTab() {
  const { t, locale, changeLanguage } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const user = MOCK_USER;

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header del perfil ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={40} color={Colors.primary[700]} />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Opciones de configuración ── */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionLabel}>{t('profile.settings')}</Text>

          {/* Cambiar idioma */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.primary[100] }]}>
                <Ionicons name="language-outline" size={20} color={Colors.primary[700]} />
              </View>
              <View>
                <Text style={styles.settingTitle}>{t('profile.changeLanguage')}</Text>
                <Text style={styles.settingSubtitle}>
                  {locale === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Notificaciones */}
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.accent.orangeLight }]}>
                <Ionicons name="notifications-outline" size={20} color={Colors.accent.orange} />
              </View>
              <Text style={styles.settingTitle}>{t('profile.notifications')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Acerca de */}
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.accent.blueLight }]}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.accent.blue} />
              </View>
              <Text style={styles.settingTitle}>{t('profile.about')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* ── Cerrar sesión ── */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.accent.red} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modal de selección de idioma ── */}
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
                    size={22}
                    color={Colors.primary[700]}
                    style={styles.languageCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Perfil header ──
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing[6],
    paddingBottom: Spacing[6],
    paddingHorizontal: Spacing[4],
  },
  avatarLarge: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
    ...Shadows.md,
  },
  profileName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  roleBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
    letterSpacing: 1,
  },

  // ── Sección de ajustes ──
  settingsSection: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    flex: 1,
  },
  settingIcon: {
    width: scale(38),
    height: scale(38),
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Logout ──
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[8],
    backgroundColor: Colors.accent.redLight,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[4],
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.accent.red,
  },

  // ── Modal de idioma ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[5],
    width: '100%',
    maxWidth: 320,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[2],
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  languageOptionSelected: {
    borderColor: Colors.primary[700],
    backgroundColor: Colors.primary[50],
  },
  languageFlag: {
    fontSize: moderateScale(26),
    marginRight: Spacing[3],
  },
  languageLabel: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  languageLabelSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semiBold,
  },
  languageCheck: {
    marginLeft: 'auto',
  },
});
