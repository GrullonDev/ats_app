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
  StatusBar,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
 * Pantalla de Perfil mejorada con diseño profesional y funcionalidad completa
 */
export default function ProfileTab() {
  const { t, locale, changeLanguage } = useTranslation();
  const { logout, user: authUser, updateUser } = useAuthStore();
  const insets = useSafeAreaInsets();
  
  // Estados para Modales
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Estado para la información del usuario (editable localmente)
  const [userData, setUserData] = useState({
    name: authUser?.name || MOCK_USER.name,
    role: authUser?.department || MOCK_USER.department || MOCK_USER.role,
    email: authUser?.email || MOCK_USER.email,
  });

  // Estados para Preferencias
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModePlaceholder, setDarkModePlaceholder] = useState(false);

  // Sincronizar datos cuando el usuario cambia (hidratación o edición)
  useEffect(() => {
    if (authUser) {
      setUserData({
        name: authUser.name,
        email: authUser.email,
        role: authUser.department || authUser.role || '',
      });
    }
  }, [authUser]);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('auth.subtitle'), // Reutilizando subtitle como "Are you sure?" o similar
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), onPress: () => logout(), style: 'destructive' },
      ]
    );
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleSaveProfile = () => {
    updateUser({ 
      name: userData.name, 
      email: userData.email,
      department: userData.role 
    });
    setShowEditProfileModal(false);
    Alert.alert(t('common.save'), t('profile.updatePersonalInfo'));
  };

  const renderSettingItem = (
    icon: React.ComponentProps<typeof Ionicons>['name'],
    title: string,
    subtitle: string,
    onPress: () => void,
    iconBg: string = Colors.statsBackground,
    iconColor: string = Colors.textPrimary
  ) => (
    <TouchableOpacity style={styles.settingListItem} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.settingIconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingItemTitle}>{title}</Text>
        <Text style={styles.settingItemSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ── Header Estándar ── */}
      <View style={[styles.header, { height: 80 + insets.top }]}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('tabs.profile')}</Text>
          <TouchableOpacity 
            style={styles.headerAction} 
            activeOpacity={0.7}
            onPress={() => setShowEditProfileModal(true)}
          >
            <Ionicons name="create-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
      
      {/* ── Spacer entre AppBar y Contenido ── */}
      <View style={{ height: 30 }} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Tarjeta de Perfil Flotante ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Text style={[styles.avatarText, { color: '#000000' }]} allowFontScaling={false}>
                  JO
                </Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>

          {/* ── Cuadrícula de Métricas ── */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Ionicons name="briefcase" size={16} color={Colors.primary[600]} />
                <Text style={styles.metricValue}>12</Text>
              </View>
              <Text style={styles.metricLabel}>{t('profile.jobsPosted')}</Text>
              <Text style={styles.metricSubtext}>+2 {t('profile.thisMonth')}</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Ionicons name="people" size={16} color={Colors.accent.purple} />
                <Text style={styles.metricValue}>245</Text>
              </View>
              <Text style={styles.metricLabel}>{t('profile.candidatesReviewed')}</Text>
              <Text style={styles.metricSubtext}>+42 {t('profile.thisWeek')}</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Ionicons name="calendar" size={16} color={Colors.accent.blue} />
                <Text style={styles.metricValue}>38</Text>
              </View>
              <Text style={styles.metricLabel}>{t('profile.interviewsConducted')}</Text>
              <Text style={styles.metricSubtext}>5 {t('profile.thisWeek')}</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Ionicons name="trophy" size={16} color={Colors.accent.green} />
                <Text style={styles.metricValue}>8</Text>
              </View>
              <Text style={styles.metricLabel}>{t('profile.successfulHires')}</Text>
              <Text style={styles.metricSubtext}>{t('profile.thisMonth')}</Text>
            </View>
          </View>
        </View>

        {/* ── Sección: Ajustes de Cuenta ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.accountSettings').toUpperCase()}</Text>
          
          {renderSettingItem(
            'person-outline',
            t('profile.editProfile'),
            t('profile.updatePersonalInfo'),
            () => setShowEditProfileModal(true)
          )}

          {renderSettingItem(
            'shield-checkmark-outline',
            t('profile.security'),
            t('profile.securityDesc'),
            () => setShowSecurityModal(true)
          )}
        </View>

        {/* ── Sección: Preferencias ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.appSettings').toUpperCase()}</Text>
          
          {renderSettingItem(
            'sparkles-outline',
            t('profile.preferences'),
            t('profile.customizeExperience'),
            () => setShowPreferencesModal(true)
          )}

          {renderSettingItem(
            'language-outline',
            t('profile.changeLanguage'),
            locale === 'es' ? 'Español' : 'English',
            () => setShowLanguageModal(true),
            Colors.infoLight,
            Colors.info
          )}
        </View>

        {/* ── Sección: Ayuda y Soporte ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.helpAndSupport').toUpperCase()}</Text>
          
          {renderSettingItem(
            'help-circle-outline',
            t('profile.helpAndSupport'),
            'Centro de ayuda y FAQs',
            () => Alert.alert('Help', 'Help center coming soon...')
          )}

          {renderSettingItem(
            'information-circle-outline',
            t('profile.aboutApp'),
            `${t('profile.version')} 1.0.0`,
            () => Alert.alert('ATS Mobile', 'Build v1.0.0-beta\n© 2026 GrullonDev')
          )}
        </View>

        {/* ── Botón de Cerrar Sesión ── */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <View
            style={[styles.logoutGradient, { backgroundColor: Colors.error + '10' }]}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* ── Modal: Editar Perfil ── */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
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
                    {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Text>
                  <TouchableOpacity style={styles.editBadge}>
                    <Ionicons name="camera" size={18} color={Colors.white} />
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ── Modal: Preferencias ── */}
      <Modal
        visible={showPreferencesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreferencesModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPreferencesModal(false)}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.smallModalTitle}>{t('profile.preferences')}</Text>
            
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>{t('profile.notificationsEnabled')}</Text>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.gray[300], true: Colors.primary[400] }}
                thumbColor={notificationsEnabled ? Colors.primary[700] : '#f4f3f4'}
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>{t('profile.darkMode')}</Text>
              <Switch 
                value={darkModePlaceholder} 
                onValueChange={setDarkModePlaceholder}
                trackColor={{ false: Colors.gray[300], true: Colors.primary[400] }}
                thumbColor={darkModePlaceholder ? Colors.primary[700] : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowPreferencesModal(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ── Modal: Seguridad ── */}
      <Modal
        visible={showSecurityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSecurityModal(false)}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.smallModalTitle}>{t('profile.security')}</Text>
            <Text style={styles.modalInfoText}>{t('profile.securityDesc')}</Text>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Autenticación de Dos Pasos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.closeButton, { marginTop: 10 }]} 
              onPress={() => setShowSecurityModal(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ── Modal: Selección de Idioma ── */}
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
          <View style={styles.smallModalContainer}>
            <Text style={styles.smallModalTitle}>{t('common.selectLanguage')}</Text>

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
    height: 180,
    backgroundColor: Colors.navy,
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
    marginTop: 20,
    padding: Spacing[5],
    alignItems: 'center',
    zIndex: 1,
    ...Shadows.lg,
  },
  avatarContainer: {
    marginTop: 0,
    marginBottom: Spacing[4],
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentBlue,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
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
    marginTop: Spacing[2],
  },
  userRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontFamily: Typography.fontFamily.medium,
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
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.navy,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[500],
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing[3],
    letterSpacing: 1.2,
    paddingLeft: Spacing[1],
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
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  logoutText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.error,
    marginLeft: Spacing[2],
  },
  footerSpacing: {
    height: 40,
  },
  // Modal Full Styles
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
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  // Modal Small Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[5],
  },
  smallModalContainer: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[5],
    ...Shadows.lg,
  },
  smallModalTitle: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  preferenceLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  actionButton: {
    backgroundColor: Colors.statsBackground,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing[4],
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
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
