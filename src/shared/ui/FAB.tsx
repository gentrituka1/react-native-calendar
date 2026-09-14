import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';
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
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  plus: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '400',
  },
});
