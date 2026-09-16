import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';

type Props = {
  label: string;
  onPress: () => void;
};

export function BiometricButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Sign in with ${label}`}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
      <View style={styles.icon}>
        <View style={styles.ring} />
        <View style={styles.core} />
      </View>
      <View style={styles.copy}>
        <AppText variant="subtitle">Use {label}</AppText>
        <AppText variant="caption" color={colors.inkMuted}>
          Unlock with your saved sign-in
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  core: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});
