import { I18n } from 'i18n-js';
import * as ExpoLocalization from 'expo-localization';

import es from './es.json';
import en from './en.json';

/**
 * Instancia central de i18n
 * Soporta: Español (es) e Inglés (en)
 */
const i18n = new I18n({
  es,
  en,
});

// Detectar idioma del dispositivo automáticamente
const deviceLocale = ExpoLocalization.getLocales()?.[0]?.languageCode ?? 'es';

// Configurar idioma por defecto
i18n.defaultLocale = 'es';
i18n.locale = deviceLocale;

// Si el idioma del dispositivo no está soportado, usar español
i18n.enableFallback = true;
i18n.missingBehavior = 'guess';

/**
 * Cambia el idioma de la app en tiempo de ejecución
 * @param locale - Código de idioma ('es' | 'en')
 */
export const changeLanguage = (locale: 'es' | 'en'): void => {
  i18n.locale = locale;
};

/**
 * Retorna el idioma actual de la app
 */
export const getCurrentLocale = (): string => i18n.locale;

/**
 * Helper para obtener la traducción con tipo seguro
 */
export const t = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

export default i18n;
