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
    <View style={styles.banner}>
      <AppText variant="caption" color={colors.danger}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
});
