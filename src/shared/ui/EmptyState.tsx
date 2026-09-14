import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';
import { AppText } from './AppText';

type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="subtitle" align="center">
        {title}
      </AppText>
      <AppText variant="body" color={colors.inkMuted} align="center">
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    alignItems: 'center',
  },
});
