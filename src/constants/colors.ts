/**
 * Paleta de colores del sistema ATS Mobile
 * Usa colores semánticos para facilitar el mantenimiento
 */
export const Colors = {
  // Colores primarios de marca
  primary: {
    50: '#E8EDF7',
    100: '#C5D1EC',
    200: '#9FB4DF',
    300: '#7997D2',
    400: '#5C80C9',
    500: '#3F69BF',
    600: '#2E5199',
    700: '#1B3A6B',  // Color principal
    800: '#122650',
    900: '#091336',
  },
  // Colores de acento
  accent: {
    blue: '#2563EB',
    blueLight: '#DBEAFE',
    green: '#16A34A',
    greenLight: '#DCFCE7',
    orange: '#EA580C',
    orangeLight: '#FFEDD5',
    red: '#DC2626',
    redLight: '#FEE2E2',
    purple: '#7C3AED',
    purpleLight: '#EDE9FE',
  },
  // Escala de grises
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Colores semánticos
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  statsBackground: '#F1F5F9',
  navy: '#1A1F36',
  accentBlue: '#3B82F6',
  // Estados
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  // Constantes
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;


export type ColorKey = keyof typeof Colors;
