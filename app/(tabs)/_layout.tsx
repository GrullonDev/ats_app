import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
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

  // Calcular altura y padding dinámico según insets del dispositivo
  // iOS con gestos suele tener bottom > 0. Android con botones suele tener bottom = 0 o pequeño.
  const tabHeight = 60 + Math.max(insets.bottom, 10);
  const paddingBottom = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accentBlue,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
          // Evitar que la barra flote si hay botones nativos
          elevation: 0,
          borderBottomWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.medium,
        },
      }}
    >
      {/* Dashboard / Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Aplicantes */}
      <Tabs.Screen
        name="applicants"
        options={{
          title: t('tabs.applicants'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Calendario */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
