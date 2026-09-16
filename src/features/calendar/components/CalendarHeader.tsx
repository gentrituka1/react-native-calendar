import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { IconButton } from '../../../shared/ui/IconButton';
import { ViewSwitcher } from './ViewSwitcher';
import type { CalendarView } from '../hooks/useCalendarController';

type Props = {
  title: string;
  subtitle?: string;
  isToday: boolean;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onChangeView: (view: CalendarView) => void;
};

export function CalendarHeader({
  title,
  subtitle,
  isToday,
  view,
  onPrevious,
  onNext,
  onToday,
  onChangeView,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.titles}>
          <AppText variant="display">{title}</AppText>
          {subtitle ? (
            <AppText variant="body" color={colors.inkMuted}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <View style={styles.controls}>
          <IconButton onPress={onPrevious} accessibilityLabel="Previous">
            <AppText variant="title">{'‹'}</AppText>
          </IconButton>
          <IconButton onPress={onNext} accessibilityLabel="Next">
            <AppText variant="title">{'›'}</AppText>
          </IconButton>
        </View>
      </View>
      <View style={styles.toolbar}>
        <Pressable
          onPress={onToday}
          hitSlop={8}
          accessibilityRole="button"
          style={[styles.today, isToday ? styles.todayActive : null]}>
          <AppText
            variant="label"
            color={isToday ? colors.white : colors.primary}>
            Today
          </AppText>
        </Pressable>
        <ViewSwitcher value={view} onChange={onChangeView} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  today: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  todayActive: {
    backgroundColor: colors.primary,
  },
});
