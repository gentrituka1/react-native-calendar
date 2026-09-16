import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { CalendarEvent } from '../../../core/types/events';
import { colors, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { Card } from '../../../shared/ui/Card';
import { getMonthMatrix, getWeekdayLabels } from '../domain/calendarDate';
import { eventColorKeysOnDay } from '../domain/eventLayout';
import { DayCell } from './DayCell';

type Props = {
  monthDate: Date;
  selectedDate: Date;
  weekStartsOn: 0 | 1;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  framed?: boolean;
};

export function MonthGrid({
  monthDate,
  selectedDate,
  weekStartsOn,
  events,
  onSelectDate,
  framed = false,
}: Props) {
  const weeks = useMemo(
    () => getMonthMatrix(monthDate, weekStartsOn),
    [monthDate, weekStartsOn],
  );
  const labels = getWeekdayLabels(weekStartsOn);
  const today = useMemo(() => new Date(), []);

  const grid = (
    <View style={styles.wrap}>
      <View style={styles.weekRow}>
        {labels.map(label => (
          <AppText
            key={label}
            variant="caption"
            color={colors.inkMuted}
            align="center"
            style={styles.weekday}>
            {label}
          </AppText>
        ))}
      </View>
      {weeks.map((week, index) => (
        <View key={index} style={styles.weekRow}>
          {week.map(cell => (
            <DayCell
              key={cell.date.toISOString()}
              cell={cell}
              selectedDate={selectedDate}
              today={today}
              dots={eventColorKeysOnDay(events, cell.date)}
              onPress={onSelectDate}
            />
          ))}
        </View>
      ))}
    </View>
  );

  if (!framed) {
    return grid;
  }

  return (
    <Card padded={false} style={styles.frame}>
      {grid}
    </Card>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  frame: {
    marginHorizontal: spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    paddingVertical: spacing.sm,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontSize: 11,
  },
});
