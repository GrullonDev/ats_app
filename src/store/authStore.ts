import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import type { User } from '../types';

const storage = new MMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface AuthState {
  /** Usuario autenticado actualmente */
  user: User | null;
  /** Token de sesión */
  token: string | null;
  /** Si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Si está cargando la sesión inicial */
  isHydrated: boolean;

  /** Iniciar sesión */
  login: (user: User, token: string) => void;
  /** Cerrar sesión */
  logout: () => void;
  /** Actualizar datos del usuario */
  updateUser: (user: Partial<User>) => void;
  /** Marcar como hidratado */
  setHydrated: (val: boolean) => void;
}

/**
 * Store de autenticación global con persistencia MMKV.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedFields: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
      },

      setHydrated: (val: boolean) => {
        set({ isHydrated: val });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
