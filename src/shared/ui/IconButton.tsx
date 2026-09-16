import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

type Props = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'plain' | 'surface';
};

export function IconButton({
  children,
  onPress,
  accessibilityLabel,
  variant = 'surface',
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        variant === 'surface' ? styles.surface : null,
        pressed ? styles.pressed : null,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
});
