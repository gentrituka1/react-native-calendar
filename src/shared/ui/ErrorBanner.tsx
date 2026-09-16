import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import { AppText } from './AppText';

type Props = {
  message: string;
};

export function ErrorBanner({ message }: Props) {
  if (!message) {
    return null;
  }
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.mark} />
      <AppText variant="caption" color={colors.danger} style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8C4BE',
  },
  mark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  text: {
    flex: 1,
  },
});
