import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';

/**
 * Pantalla de Aplicantes - Placeholder
 * TODO: Implementar lista de aplicantes con filtros y búsqueda
 */
export default function ApplicantsTab() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('applicants.title')}</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
