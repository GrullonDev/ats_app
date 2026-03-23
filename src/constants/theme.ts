/**
 * Tipografía del sistema ATS Mobile
 * Tamaños y pesos de fuente estandarizados
 */
import { moderateScale } from '../utils/responsive';

export const Typography = {
  // Familias de fuente
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  // Tamaños (escala tipográfica)
  fontSize: {
    xs: moderateScale(11),
    sm: moderateScale(13),
    base: moderateScale(15),
    md: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    '2xl': moderateScale(24),
    '3xl': moderateScale(28),
    '4xl': moderateScale(32),
    '5xl': moderateScale(40),
  },
  // Alturas de línea
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Pesos de fuente
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
} as const;

/**
 * Espaciado del sistema (escala de 4pts)
 */
export const Spacing = {
  0: 0,
  1: moderateScale(4),
  2: moderateScale(8),
  3: moderateScale(12),
  4: moderateScale(16),
  5: moderateScale(20),
  6: moderateScale(24),
  7: moderateScale(28),
  8: moderateScale(32),
  10: moderateScale(40),
  12: moderateScale(48),
  16: moderateScale(64),
} as const;

/**
 * Radios de borde
 */
export const BorderRadius = {
  none: 0,
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  '2xl': moderateScale(20),
  full: 9999,
} as const;

/**
 * Sombras
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
