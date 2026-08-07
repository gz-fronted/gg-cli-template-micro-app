import { create } from 'zustand';
import type { GZThemeMode } from 'gz-ui';

export interface UserInfo {
  name: string;
  role: string;
  dept: string;
}

export interface GlobalState {
  user: UserInfo | null;
  token: string | null;
  themeMode: GZThemeMode;
  setThemeMode: (themeMode: GZThemeMode) => void;
  setGlobalState: (state: Partial<GlobalState>) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  token: null,
  themeMode: 'gold-dark',
  setThemeMode: (themeMode) => set({ themeMode }),
  setGlobalState: (state) => set((prev) => ({ ...prev, ...state })),
}));
