import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { changeLanguage, getCurrentLocale } from '@i18n/index';
import type { SupportedLanguage } from '@types';

const storage = new MMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

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
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          changeLanguage(state.locale);
        }
      },
    }
  )
);
