import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import '@/i18n/index'; // Inicializar i18n globalmente
import { useAuthStore } from '@/store/authStore';

// Prevenir que el splash desaparezca automáticamente
SplashScreen.preventAutoHideAsync();

/**
 * Root Layout de la aplicación.
 * Maneja la redirección de autenticación y configuración global.
 */
export default function RootLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que el store se cargue (hidratación)
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(tabs)';

    // Si no está autenticado y trata de entrar a las pestañas, ir a login
    if (!isAuthenticated && inAuthGroup) {
      router.replace('/login');
    }
    // Si está autenticado y trata de entrar al login, ir al dashboard
    else if (isAuthenticated && segments[0] === 'login') {
      router.replace('/(tabs)');
    }

    // Ocultar splash screen cuando la app esté lista y la lógica de ruta decidida
    SplashScreen.hideAsync();
  }, [isAuthenticated, segments, isHydrated, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pantalla de login (fuera del tab navigator) */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* Pantalla principal - Tab Navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
