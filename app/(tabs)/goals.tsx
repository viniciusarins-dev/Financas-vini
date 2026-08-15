import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { GoalCard } from '@/features/goals/GoalCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGoalsStore } from '@/store/useGoalsStore';

export default function GoalsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const goals = useGoalsStore((s) => s.goals);

  return (
    <Screen>
      <ScreenHeader
        title="Metas"
        subtitle="Seus objetivos financeiros"
        right={
          <Pressable
            onPress={() => router.push('/goal/new')}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} color={colors.accent} />
          </Pressable>
        }
      />

      {goals.length === 0 ? (
        <View style={{ paddingTop: 60, alignItems: 'center' }}>
          <Text style={{ color: colors.faint }}>Você ainda não criou nenhuma meta.</Text>
        </View>
      ) : (
        goals.map((goal, index) => (
          <Animated.View key={goal.id} entering={FadeInDown.duration(400).delay(index * 60).springify()}>
            <GoalCard goal={goal} />
          </Animated.View>
        ))
      )}
    </Screen>
  );
}
