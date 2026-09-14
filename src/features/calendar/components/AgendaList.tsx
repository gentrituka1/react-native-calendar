import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { CalendarEvent } from '../../../core/types/events';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { formatTime } from '../domain/calendarDate';
import { eventsOnDay } from '../domain/eventLayout';

type Props = {
  day: Date;
  events: CalendarEvent[];
  onPressEvent: (event: CalendarEvent) => void;
};

export function AgendaList({ day, events, onPressEvent }: Props) {
  const items = eventsOnDay(events, day);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No meetings"
        body="Create a meeting for this day with the plus button."
      />
    );
  }

  return (
    <View style={styles.list}>
      {items.map(event => (
        <Pressable
          key={event.id}
          onPress={() => onPressEvent(event)}
          style={styles.card}
          accessibilityRole="button">
          <View
            style={[
              styles.stripe,
              { backgroundColor: colors.event[event.color] },
            ]}
          />
          <View style={styles.body}>
            <AppText variant="subtitle">{event.title}</AppText>
            <AppText variant="caption" color={colors.inkMuted}>
              {formatTime(new Date(event.startAt))} –{' '}
              {formatTime(new Date(event.endAt))}
            </AppText>
            {event.description ? (
              <AppText variant="body" color={colors.inkMuted} numberOfLines={2}>
                {event.description}
              </AppText>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 72,
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    padding: spacing.sm,
    gap: 2,
  },
});
