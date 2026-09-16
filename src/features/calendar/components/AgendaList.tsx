import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { CalendarEvent } from '../../../core/types/events';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { formatAgendaHeading, formatTime } from '../domain/calendarDate';
import { eventsOnDay } from '../domain/eventLayout';

type Props = {
  day: Date;
  events: CalendarEvent[];
  onPressEvent: (event: CalendarEvent) => void;
};

export function AgendaList({ day, events, onPressEvent }: Props) {
  const items = eventsOnDay(events, day);
  const countLabel =
    items.length === 0
      ? 'Free day'
      : `${items.length} meeting${items.length === 1 ? '' : 's'}`;

  return (
    <View style={styles.list}>
      <View style={styles.heading}>
        <AppText variant="subtitle">{formatAgendaHeading(day)}</AppText>
        <View style={styles.badge}>
          <AppText variant="caption" color={colors.primary}>
            {countLabel}
          </AppText>
        </View>
      </View>
      {items.length === 0 ? (
        <EmptyState
          title="Nothing scheduled"
          body="This day is clear. Add a meeting when you are ready."
        />
      ) : (
        items.map(event => (
          <Pressable
            key={event.id}
            onPress={() => onPressEvent(event)}
            style={styles.card}
            accessibilityRole="button">
            <View style={styles.timeCol}>
              <AppText variant="label">{formatTime(new Date(event.startAt))}</AppText>
              <AppText variant="caption" color={colors.inkFaint}>
                {formatTime(new Date(event.endAt))}
              </AppText>
            </View>
            <View
              style={[
                styles.body,
                { backgroundColor: colors.eventSoft[event.color] },
              ]}>
              <View
                style={[
                  styles.stripe,
                  { backgroundColor: colors.event[event.color] },
                ]}
              />
              <View style={styles.copy}>
                <AppText variant="subtitle">{event.title}</AppText>
                {event.description ? (
                  <AppText
                    variant="body"
                    color={colors.inkMuted}
                    numberOfLines={2}>
                    {event.description}
                  </AppText>
                ) : null}
              </View>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 76,
  },
  timeCol: {
    width: 52,
    paddingTop: 10,
    gap: 2,
  },
  body: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 76,
  },
  stripe: {
    width: 5,
  },
  copy: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: 2,
    justifyContent: 'center',
  },
});
