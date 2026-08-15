import { create } from 'zustand';
import type { AppSettings } from '@/types/finance';
import { readValue, writeValue, STORAGE_KEYS } from '@/database/storage';

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  notificationsEnabled: true,
  dailyReminderEnabled: false,
  userName: 'Vinicius',
};

interface SettingsState {
  settings: AppSettings;
  isLoaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  load: async () => {
    const settings = await readValue<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    set({ settings, isLoaded: true });
  },

  update: async (patch) => {
    const next = { ...get().settings, ...patch };
    await writeValue(STORAGE_KEYS.settings, next);
    set({ settings: next });
  },
}));
