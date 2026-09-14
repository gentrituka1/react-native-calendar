import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: Variant;
};

const variantStyles: Record<
  Variant,
  { background: string; pressed: string; text: string; border?: string }
> = {
  primary: {
    background: colors.primary,
    pressed: colors.primaryPressed,
    text: colors.white,
  },
  secondary: {
    background: colors.surface,
    pressed: colors.surfaceMuted,
    text: colors.ink,
    border: colors.border,
  },
  ghost: {
    background: 'transparent',
    pressed: colors.primarySoft,
    text: colors.primary,
  },
  danger: {
    background: colors.dangerSoft,
    pressed: '#F0C8C2',
    text: colors.danger,
  },
};

export function AppButton({
  label,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: Props) {
  const palette = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      style={state => [
        styles.base,
        {
          backgroundColor: state.pressed ? palette.pressed : palette.background,
          borderColor: palette.border ?? 'transparent',
          borderWidth: palette.border ? 1 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <AppText style={[styles.label, { color: palette.text }]}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.subtitle,
  },
});
