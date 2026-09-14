import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { CalendarTabProps } from '../../../app/navigation/types';
import { useEvents } from '../../../app/providers/EventsProvider';
import { colors, spacing } from '../../../shared/theme/theme';
import { AppHeader } from '../../../shared/ui/AppHeader';
import { AppText } from '../../../shared/ui/AppText';
import { FAB } from '../../../shared/ui/FAB';
import { Screen } from '../../../shared/ui/Screen';
import { toDateISO, isSameDay } from '../domain/calendarDate';
import { useCalendarController } from '../hooks/useCalendarController';
import { AgendaList } from '../components/AgendaList';
import { DayTimeline } from '../components/DayTimeline';
import { MonthGrid } from '../components/MonthGrid';
import { ViewSwitcher } from '../components/ViewSwitcher';

export function CalendarScreen({ navigation }: CalendarTabProps) {
  const { events } = useEvents();
  const calendar = useCalendarController();

  const openEditor = (eventId?: string, date = calendar.selectedDate) => {
    navigation.navigate('EventEditor', {
      eventId,
      dateISO: toDateISO(date),
    });
  };

  return (
    <Screen edges={{ top: true, bottom: false }}>
      <AppHeader
        title={calendar.title}
        left={
          <Pressable onPress={calendar.goPrevious} hitSlop={10}>
            <AppText variant="title">{'‹'}</AppText>
          </Pressable>
        }
        right={
          <Pressable onPress={calendar.goNext} hitSlop={10}>
            <AppText variant="title">{'›'}</AppText>
          </Pressable>
        }
      />
      <View style={styles.toolbar}>
        <Pressable onPress={calendar.goToToday} hitSlop={8}>
          <AppText color={colors.primary} variant="label">
            Today
          </AppText>
        </Pressable>
        <ViewSwitcher value={calendar.view} onChange={calendar.setView} />
      </View>
      {calendar.view === 'month' ? (
        <ScrollView contentContainerStyle={styles.monthContent}>
          <MonthGrid
            monthDate={calendar.visibleMonth}
            selectedDate={calendar.selectedDate}
            weekStartsOn={calendar.weekStartsOn}
            events={events}
            onSelectDate={date => {
              if (isSameDay(date, calendar.selectedDate)) {
                calendar.setView('day');
                return;
              }
              calendar.selectDate(date);
            }}
          />
          <AgendaList
            day={calendar.selectedDate}
            events={events}
            onPressEvent={event => openEditor(event.id, new Date(event.startAt))}
          />
        </ScrollView>
      ) : (
        <DayTimeline
          day={calendar.selectedDate}
          events={events}
          onPressEvent={event => openEditor(event.id, new Date(event.startAt))}
        />
      )}
      <FAB onPress={() => openEditor(undefined, calendar.selectedDate)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthContent: {
    paddingBottom: 96,
  },
});
