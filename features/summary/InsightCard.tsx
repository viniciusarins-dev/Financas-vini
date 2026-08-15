import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Info } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Insight } from '@/services/financeCalculations';

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  const colors = useThemeColors();

  return (
    <GlassCard style={{ marginTop: 16 }}>
      <View style={{ padding: 18 }}>
        <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 14 }}>Insights</Text>
        <View style={{ gap: 12 }}>
          {insights.map((insight) => {
            const tone = insight.tone === 'positive' ? colors.income : insight.tone === 'negative' ? colors.expense : colors.accent;
            const Icon = insight.tone === 'positive' ? TrendingUp : insight.tone === 'negative' ? TrendingDown : Info;
            return (
              <View key={insight.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: `${tone}22`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  <Icon size={14} color={tone} />
                </View>
                <Text style={{ flex: 1, color: colors.muted, fontSize: 13.5, lineHeight: 19 }}>{insight.text}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}
