import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

type Props = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
  align?: 'center' | 'left';
};

export function AppHeader({
  title,
  subtitle,
  left,
  right,
  onBack,
  align = 'center',
}: Props) {
  const leftNode = onBack ? (
    <IconButton onPress={onBack} accessibilityLabel="Go back">
      <AppText variant="title">{'‹'}</AppText>
    </IconButton>
  ) : (
    left
  );

  return (
    <View style={styles.row}>
      <View style={styles.side}>{leftNode}</View>
      <View style={[styles.center, align === 'left' ? styles.centerLeft : null]}>
        <AppText
          variant="subtitle"
          align={align === 'left' ? 'left' : 'center'}
          numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="caption"
            color={colors.inkMuted}
            align={align === 'left' ? 'left' : 'center'}>
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
    minHeight: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  centerLeft: {
    alignItems: 'flex-start',
  },
});
