import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme/theme';
import { AppText } from './AppText';

type Props = {
  onPress: () => void;
};

export function FAB({ onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Create meeting"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: pressed ? colors.accentPressed : colors.accent },
      ]}>
      <AppText style={styles.plus}>+</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  plus: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '400',
  },
});
