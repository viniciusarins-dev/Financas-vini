import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { gradients } from '@/constants/theme';

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <LinearGradient
      colors={gradients.balanceCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 28,
        padding: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: '#7C5CFF',
          opacity: 0.16,
          top: -90,
          right: -60,
        }}
      />
      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
        Saldo atual
      </Text>
      <AnimatedNumber
        value={balance}
        style={{ color: '#FFFFFF', fontSize: 40, fontWeight: '800', letterSpacing: -1 }}
      />
    </LinearGradient>
  );
}
