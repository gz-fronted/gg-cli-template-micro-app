import { create } from 'zustand';

export interface UserInfo {
  name: string;
  role: string;
  dept: string;
}

interface GlobalState {
  user: UserInfo | null;
  token: string | null;
  themeMode: 'light' | 'dark';
  setGlobalState: (state: Partial<GlobalState>) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  token: null,
  themeMode: 'light',
  setGlobalState: (state) => set((prev) => ({ ...prev, ...state })),
}));
