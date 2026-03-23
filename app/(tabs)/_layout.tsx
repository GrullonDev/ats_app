import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Typography } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';

/**
 * Layout del Tab Navigator.
 * Define las 4 pestañas principales: Dashboard, Aplicantes, Calendario, Perfil.
 */
export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary[700],
          tabBarInactiveTintColor: Colors.gray[400],
          tabBarShowLabel: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom > 0 ? insets.bottom : 16,
            left: 16,
            right: 16,
            height: 72,
            borderRadius: 24,
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: Colors.border,
            elevation: 12,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            paddingBottom: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 10,
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
        }}
      >
      {/* Dashboard / Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Aplicantes */}
      <Tabs.Screen
        name="applicants"
        options={{
          title: t('tabs.applicants'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Calendario */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
