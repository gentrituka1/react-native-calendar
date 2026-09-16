import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { CalendarEvent } from '../../../core/types/events';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import {
  formatHourLabel,
  formatTime,
  isSameDay,
  minutesFromMidnight,
} from '../domain/calendarDate';
import { layoutDayEvents } from '../domain/eventLayout';

const HOUR_HEIGHT = 64;
const TIME_GUTTER = 58;
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
        <View style={styles.eventLane} pointerEvents="box-none">
          {positioned.map(item => {
            const top = (item.startMinutes / 60) * HOUR_HEIGHT;
            const height = Math.max(
              28,
              ((item.endMinutes - item.startMinutes) / 60) * HOUR_HEIGHT - 4,
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
                    left: `${item.column * widthPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: colors.event[item.event.color],
                  },
                ]}>
                <AppText
                  variant="caption"
                  color={colors.white}
                  numberOfLines={1}
                  style={styles.eventTitle}>
                  {item.event.title}
                </AppText>
                {height > 36 ? (
                  <AppText
                    variant="caption"
                    color={colors.white}
                    style={styles.eventTime}>
                    {formatTime(new Date(item.event.startAt))}
                  </AppText>
                ) : null}
              </Pressable>
            );
          })}
        </View>
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
  },
  hourRow: {
    height: HOUR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: TIME_GUTTER,
    textAlign: 'right',
    paddingRight: spacing.sm,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: 8,
    marginRight: 16,
  },
  eventLane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: TIME_GUTTER + 6,
    right: 16,
  },
  event: {
    position: 'absolute',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingRight: 10,
  },
  eventTitle: {
    fontWeight: '700',
  },
  eventTime: {
    opacity: 0.9,
    marginTop: 2,
  },
  now: {
    position: 'absolute',
    left: TIME_GUTTER - 5,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.accent,
  },
});
