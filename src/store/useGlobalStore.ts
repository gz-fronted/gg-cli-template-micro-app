import { create } from 'zustand';
import type { AppThemeMode } from '@/config/theme';

export interface UserInfo {
  name: string;
  role: string;
  dept: string;
}

export interface GlobalState {
  user: UserInfo | null;
  token: string | null;
  themeMode: AppThemeMode;
  setThemeMode: (themeMode: AppThemeMode) => void;
  setGlobalState: (state: Partial<Pick<GlobalState, 'user' | 'token'>>) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  token: null,
  themeMode: 'gold-dark',
  setThemeMode: (themeMode) => set({ themeMode }),
  setGlobalState: (state) => set((prev) => ({ ...prev, ...state })),
}));

export const resetGlobalState = (): void => {
  useGlobalStore.setState({ user: null, token: null, themeMode: 'gold-dark' });
};
