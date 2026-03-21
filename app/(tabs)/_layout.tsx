import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { Colors, Typography } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';

/**
 * Layout del Tab Navigator.
 * Define las 4 pestañas principales: Dashboard, Aplicantes, Calendario, Perfil.
 */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[700],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
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
  );
}
