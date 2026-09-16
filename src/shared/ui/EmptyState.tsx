import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import { AppText } from './AppText';

type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.glyph}>
        <View style={styles.glyphBar} />
        <View style={styles.glyphLine} />
        <View style={[styles.glyphLine, styles.glyphLineShort]} />
      </View>
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
  glyph: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.xs,
    padding: 12,
    justifyContent: 'center',
    gap: 5,
  },
  glyphBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    width: '46%',
  },
  glyphLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  glyphLineShort: {
    width: '62%',
  },
});
