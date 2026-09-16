import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EventColorKey } from '../../../core/types/events';
import { colors, radius } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { isSameDay } from '../domain/calendarDate';
import type { CalendarCell } from '../domain/calendarDate';

type Props = {
  cell: CalendarCell;
  selectedDate: Date;
  today: Date;
  dots: EventColorKey[];
  onPress: (date: Date) => void;
};

export function DayCell({ cell, selectedDate, today, dots, onPress }: Props) {
  const selected = isSameDay(cell.date, selectedDate);
  const todayCell = isSameDay(cell.date, today);
  const textColor = selected
    ? colors.white
    : cell.inCurrentMonth
      ? colors.ink
      : colors.inkFaint;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={cell.date.toDateString()}
      onPress={() => onPress(cell.date)}
      style={styles.cell}>
      <View
        style={[
          styles.bubble,
          todayCell && !selected ? styles.today : null,
          selected ? styles.selected : null,
        ]}>
        <AppText variant="label" color={textColor} style={styles.number}>
          {cell.date.getDate()}
        </AppText>
      </View>
      <View style={styles.dots}>
        {dots.slice(0, 3).map(color => (
          <View
            key={color}
            style={[styles.dot, { backgroundColor: colors.event[color] }]}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 56,
  },
  bubble: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    backgroundColor: colors.primarySoft,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  number: {
    fontWeight: '700',
  },
  dots: {
    height: 8,
    marginTop: 4,
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
