import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';
import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
};

export function AppHeader({ title, subtitle, left, right, onBack }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <AppText variant="title">{'‹'}</AppText>
          </Pressable>
        ) : (
          left
        )}
      </View>
      <View style={styles.center}>
        <AppText variant="subtitle" align="center" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.inkMuted} align="center">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
});
