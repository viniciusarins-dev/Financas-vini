import { useEffect, useState } from 'react';
import { useSharedValue, withTiming, useAnimatedReaction, runOnJS, Easing } from 'react-native-reanimated';

export function useAnimatedCounter(target: number, duration = 900): number {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(target, { duration, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setDisplay)(value);
    },
  );

  return display;
}
