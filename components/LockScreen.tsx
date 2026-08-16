import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ScanFace } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';
import { gradients } from '@/constants/theme';

interface LockScreenProps {
  onAuthenticate: () => void;
}

export function LockScreen({ onAuthenticate }: LockScreenProps) {
  const colors = useThemeColors();

  useEffect(() => {
    onAuthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 24, paddingHorizontal: 32 }}>
      <LinearGradient
        colors={gradients.accent}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ width: 84, height: 84, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
      >
        <ScanFace size={40} color="#FFFFFF" strokeWidth={2} />
      </LinearGradient>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Fluxo está bloqueado</Text>
        <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center' }}>
          Use Face ID para acessar seus dados financeiros
        </Text>
      </View>
      <Pressable
        onPress={onAuthenticate}
        style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, backgroundColor: colors.raised }}
      >
        <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 15 }}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}
