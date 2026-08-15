import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import type { Goal } from '@/types/finance';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <Pressable onPress={() => router.push(`/goal/${goal.id}`)}>
      <GlassCard style={{ marginBottom: 14 }}>
        <View style={{ padding: 18, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                backgroundColor: `${goal.color}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DynamicIcon name={goal.icon} size={22} color={goal.color} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: 15.5, fontWeight: '700' }}>{goal.title}</Text>
              <Text style={{ color: colors.muted, fontSize: 12.5, marginTop: 2 }}>
                {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
              </Text>
            </View>
            <Text style={{ color: goal.color, fontSize: 15, fontWeight: '800' }}>{formatPercentage(percentage)}</Text>
          </View>
          <ProgressBar progress={percentage} color={goal.color} height={8} />
        </View>
      </GlassCard>
    </Pressable>
  );
}
