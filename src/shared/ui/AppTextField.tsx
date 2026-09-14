import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextField({ label, error, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color={colors.inkMuted}>
        {label}
      </AppText>
      <View
        style={[
          styles.field,
          error ? styles.fieldError : null,
        ]}>
        <TextInput
          {...rest}
          secureTextEntry={secureTextEntry ? hidden : false}
          placeholderTextColor={colors.inkFaint}
          style={[styles.input, style]}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden(value => !value)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <AppText variant="caption" color={colors.primary}>
              {hidden ? 'Show' : 'Hide'}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xxs,
  },
  field: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    color: colors.ink,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
});
