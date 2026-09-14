import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { CalendarEvent } from '../../../core/types/events';
import { colors, radius } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import {
  formatHourLabel,
  isSameDay,
  minutesFromMidnight,
} from '../domain/calendarDate';
import { layoutDayEvents } from '../domain/eventLayout';

const HOUR_HEIGHT = 56;
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

type Props = {
  day: Date;
  events: CalendarEvent[];
  onPressEvent: (event: CalendarEvent) => void;
};

export function DayTimeline({ day, events, onPressEvent }: Props) {
  const positioned = useMemo(() => layoutDayEvents(events, day), [day, events]);
  const now = new Date();
  const showNow = isSameDay(day, now);
  const nowTop = (minutesFromMidnight(now) / 60) * HOUR_HEIGHT;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.timeline}>
        {HOURS.map(hour => (
          <View key={hour} style={styles.hourRow}>
            <AppText variant="caption" color={colors.inkFaint} style={styles.label}>
              {formatHourLabel(hour)}
            </AppText>
            <View style={styles.line} />
          </View>
        ))}
        {positioned.map(item => {
          const top = (item.startMinutes / 60) * HOUR_HEIGHT;
          const height = Math.max(
            22,
            ((item.endMinutes - item.startMinutes) / 60) * HOUR_HEIGHT,
          );
          const widthPercent = 100 / item.columnCount;
          return (
            <Pressable
              key={item.event.id}
              onPress={() => onPressEvent(item.event)}
              style={[
                styles.event,
                {
                  top,
                  height,
                  left: `${8 + item.column * widthPercent * 0.72}%`,
                  width: `${widthPercent * 0.7}%`,
                  backgroundColor: colors.event[item.event.color],
                },
              ]}>
              <AppText variant="caption" color={colors.white} numberOfLines={2}>
                {item.event.title}
              </AppText>
            </Pressable>
          );
        })}
        {showNow ? (
          <View style={[styles.now, { top: nowTop }]}>
            <View style={styles.nowDot} />
            <View style={styles.nowLine} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 96,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 8,
  },
  hourRow: {
    height: HOUR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: 48,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: 8,
    marginRight: 12,
  },
  event: {
    position: 'absolute',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  now: {
    position: 'absolute',
    left: 42,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.accent,
  },
});
