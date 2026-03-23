import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { scale, verticalScale, moderateScale } from '@/utils/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { MOCK_USER } from '@/utils/mockData';

/**
 * Pantalla de Inicio de Sesión (Login)
 * Implementa autenticación mock con las credenciales: jorge / jorge
 */
export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        router.replace('/(tabs)');
      }, 1);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  /**
   * Manejar intento de login
   */
  const handleLogin = () => {
    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.errorEmpty'));
      return;
    }

    setIsLoading(true);

    // --- Simular llamada a API (Mock logic: jorge/jorge) ---
    setTimeout(() => {
      if (
        (username.toLowerCase() === 'jorge' || username.toLowerCase() === 'jorge@email.com') &&
        password === 'jorge'
      ) {
        // Login exitoso: Inyectar usuario mock con nombre 'Jorge'
        const jorgeUser = {
          ...MOCK_USER,
          name: 'Jorge Grullón',
          email: 'jorge@email.com',
        };
        login(jorgeUser, 'mock_token_abc_123');
        router.replace('/(tabs)');
      } else {
        // Fallido
        setIsLoading(false);
        Alert.alert(t('common.error'), t('auth.errorInvalid'));
      }
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header / Logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="briefcase" size={40} color={Colors.white} />
              </View>
              <Text style={styles.title}>{t('auth.welcome')}</Text>
              <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Usuario */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.username')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="jorge"
                    placeholderTextColor={Colors.gray[400]}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.password')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.gray[400]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.gray[400]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>

              {/* Botón de Login */}
              <TouchableOpacity
                style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Powering the future of recruitment
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: Spacing[6],
    justifyContent: 'center',
  },

  // --- Logo/Header ---
  header: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  logoContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[5],
    ...Shadows.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // --- Form ---
  form: {
    gap: Spacing[4],
  },
  inputGroup: {
    gap: Spacing[2],
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
    height: verticalScale(56),
  },
  inputIcon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    height: '100%',
  },
  eyeIcon: {
    padding: Spacing[2],
  },

  // --- Utils ---
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing[4],
  },
  forgotText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },

  // --- Action Button ---
  loginBtn: {
    height: verticalScale(56),
    backgroundColor: Colors.primary[700],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    marginTop: Spacing[4],
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },

  // --- Footer ---
  footer: {
    marginTop: Spacing[12],
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
