import { useCallback } from 'react';
import { useLanguageStore } from '@store/languageStore';
import i18n from '@i18n/index';
import type { SupportedLanguage } from '@/types';

/**
 * Hook para acceder a las traducciones y el idioma actual.
 *
 * @example
 * const { t, locale, setLanguage } = useTranslation();
 * <Text>{t('welcome.greeting')}</Text>
 */
export const useTranslation = () => {
  const { locale, setLanguage } = useLanguageStore();

  /**
   * Función de traducción — devuelve el texto según el idioma activo
   */
  const t = useCallback(
    (key: string, options?: Record<string, unknown>): any => {
      // @ts-ignore - i18n might return array/object depending on key
      return i18n.t(key, options);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale], // Se recalcula cuando cambia el idioma
  );

  /**
   * Cambiar el idioma de la app
   */
  const changeLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setLanguage(lang);
    },
    [setLanguage],
  );

  return {
    t,
    locale,
    changeLanguage,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
  };
};
