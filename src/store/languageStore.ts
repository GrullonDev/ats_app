import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage, getCurrentLocale } from '@i18n/index';
import type { SupportedLanguage } from '@types';

interface LanguageState {
  /** Idioma activo de la aplicación */
  locale: SupportedLanguage;
  /** Cambiar el idioma de la app */
  setLanguage: (lang: SupportedLanguage) => void;
}

/**
 * Store para manejo del idioma activo de la aplicación.
 * Guardado persistente con MMKV.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: (getCurrentLocale() as SupportedLanguage) ?? 'es',

      setLanguage: (lang: SupportedLanguage) => {
        changeLanguage(lang);
        set({ locale: lang });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          changeLanguage(state.locale);
        }
      },
    }
  )
);
