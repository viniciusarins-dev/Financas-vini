import React from 'react';
import { View, Text } from 'react-native';
import { Bot } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import type { AIChatMessage } from '@/types/ai';

function VisualBlock({ message }: { message: AIChatMessage }) {
  const colors = useThemeColors();
  const visual = message.visual;
  if (!visual) return null;

  if (visual.kind === 'stat-cards') {
    return (
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {visual.items.map((item) => {
          const tone = item.tone === 'income' ? colors.income : item.tone === 'expense' ? colors.expense : item.tone === 'saving' ? colors.saving : colors.accent;
          return (
            <View key={item.label} style={{ backgroundColor: `${tone}1A`, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: tone, fontSize: 11, fontWeight: '600' }}>{item.label}</Text>
              <Text style={{ color: tone, fontSize: 14, fontWeight: '800' }}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  if (visual.kind === 'category-breakdown') {
    const max = Math.max(...visual.items.map((i) => i.value), 1);
    return (
      <View style={{ gap: 8, marginTop: 10 }}>
        {visual.items.map((item) => (
          <View key={item.label} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.ink, fontSize: 12.5, fontWeight: '600' }}>{item.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{formatCurrency(item.value)}</Text>
            </View>
            <ProgressBar progress={(item.value / max) * 100} color={item.color} height={6} />
          </View>
        ))}
      </View>
    );
  }

  if (visual.kind === 'comparison') {
    const max = Math.max(visual.a.value, visual.b.value, 1);
    return (
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, alignItems: 'flex-end', height: 80 }}>
        {[visual.a, visual.b].map((item, i) => (
          <View key={item.label} style={{ alignItems: 'center', gap: 6, flex: 1 }}>
            <View
              style={{
                width: '100%',
                height: Math.max((item.value / max) * 60, 6),
                borderRadius: 8,
                backgroundColor: i === 0 ? colors.accent2 : colors.accent,
              }}
            />
            <Text style={{ color: colors.muted, fontSize: 11 }}>{item.label}</Text>
            <Text style={{ color: colors.ink, fontSize: 11, fontWeight: '700' }}>{formatCurrency(item.value)}</Text>
          </View>
        ))}
      </View>
    );
  }

  return null;
}

export function AIMessageBubble({ message }: { message: AIChatMessage }) {
  const colors = useThemeColors();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={{ alignItems: 'flex-end', marginBottom: 14 }}>
        <View style={{ backgroundColor: colors.accent, borderRadius: 18, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '82%' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14.5 }}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, maxWidth: '88%' }}>
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: `${colors.accent}26`, alignItems: 'center', justifyContent: 'center' }}>
        <Bot size={13} color={colors.accent} />
      </View>
      <GlassCard style={{ flexShrink: 1 }}>
        <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
          <Text style={{ color: colors.ink, fontSize: 14.5, lineHeight: 21 }}>{message.text}</Text>
          <VisualBlock message={message} />
        </View>
      </GlassCard>
    </View>
  );
}
