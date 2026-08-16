import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSettingsStore } from '@/store/useSettingsStore';

interface AppLockState {
  isLockActive: boolean;
  isLocked: boolean;
  authenticate: () => Promise<void>;
}

export function useAppLock(): AppLockState {
  const appLockEnabled = useSettingsStore((s) => s.settings.appLockEnabled);
  const [isLocked, setIsLocked] = useState(appLockEnabled);
  const appState = useRef(AppState.currentState);

  const authenticate = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      setIsLocked(false);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloquear Fluxo',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });
    if (result.success) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (appLockEnabled) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, [appLockEnabled]);

  useEffect(() => {
    if (!appLockEnabled) return;
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        setIsLocked(true);
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [appLockEnabled]);

  return { isLockActive: appLockEnabled, isLocked: appLockEnabled && isLocked, authenticate };
}
