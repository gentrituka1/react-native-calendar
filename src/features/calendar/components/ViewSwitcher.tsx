import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import type { CalendarView } from '../hooks/useCalendarController';

type Props = {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
};

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {(['day', 'month'] as const).map(item => {
        const active = value === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.item, active ? styles.active : null]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <AppText
              variant="caption"
              color={active ? colors.white : colors.inkMuted}
              style={styles.label}>
              {item === 'day' ? 'Day' : 'Month'}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: colors.primary,
  },
  label: {
    textTransform: 'capitalize',
    fontWeight: '700',
  },
});
