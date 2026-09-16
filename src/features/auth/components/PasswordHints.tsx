import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { getPasswordChecks } from '../validation/authValidation';

type Props = {
  password: string;
};

const RULES: Array<{
  key: 'minLength' | 'letter' | 'number';
  label: string;
}> = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'letter', label: 'Contains a letter' },
  { key: 'number', label: 'Contains a number' },
];

export function PasswordHints({ password }: Props) {
  const checks = getPasswordChecks(password);
  const score = RULES.filter(rule => checks[rule.key]).length;

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {RULES.map((rule, index) => (
          <View
            key={rule.key}
            style={[
              styles.bar,
              index < score ? styles.barFilled : null,
              score === 3 ? styles.barComplete : null,
            ]}
          />
        ))}
      </View>
      {RULES.map(rule => {
        const ok = checks[rule.key];
        return (
          <View key={rule.key} style={styles.row}>
            <View style={[styles.dot, ok ? styles.dotOk : null]} />
            <AppText
              variant="caption"
              color={ok ? colors.primary : colors.inkFaint}>
              {rule.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  bars: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  barFilled: {
    backgroundColor: colors.accent,
  },
  barComplete: {
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotOk: {
    backgroundColor: colors.primary,
  },
});
