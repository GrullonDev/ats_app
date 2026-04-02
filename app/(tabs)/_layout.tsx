import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { Platform, View, StyleSheet } from 'react-native';
=======
import { Platform } from 'react-native';
>>>>>>> main
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
<<<<<<< HEAD

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
            left: 20,
            right: 20,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.05)',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
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
      {/* Home / Inicio */}
=======

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
>>>>>>> main
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
<<<<<<< HEAD
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeTabIcon}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
            </View>
=======
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
>>>>>>> main
          ),
        }}
      />

      {/* Candidates / Candidatos */}
      <Tabs.Screen
        name="applicants"
        options={{
          title: t('tabs.applicants'),
<<<<<<< HEAD
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeTabIcon}>
              <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
            </View>
=======
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="people-outline" size={size} color={color} />
>>>>>>> main
          ),
        }}
      />

      {/* Calendario */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
<<<<<<< HEAD
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeTabIcon}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
            </View>
=======
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
>>>>>>> main
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
<<<<<<< HEAD
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeTabIcon}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
            </View>
=======
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
>>>>>>> main
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
  activeTabIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary[50], // Soft background for active icon
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
});
