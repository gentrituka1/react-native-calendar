import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme/theme';

type Props = {
  size?: number;
};

export function BrandMark({ size = 64 }: Props) {
  const inner = size * 0.58;
  const barHeight = Math.max(6, size * 0.14);

  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}>
      <View style={[styles.bar, { height: barHeight }]} />
      <View style={[styles.page, { width: inner, height: inner }]}>
        <View style={styles.row}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.row}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotAccent]} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bar: {
    alignSelf: 'stretch',
    backgroundColor: colors.primaryPressed,
  },
  page: {
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: 7,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primarySoft,
  },
  dotAccent: {
    backgroundColor: colors.accent,
  },
});
