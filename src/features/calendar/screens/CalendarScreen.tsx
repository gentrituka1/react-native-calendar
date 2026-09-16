import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { CalendarTabProps } from '../../../app/navigation/types';
import { useEvents } from '../../../app/providers/EventsProvider';
import { Screen } from '../../../shared/ui/Screen';
import { FAB } from '../../../shared/ui/FAB';
import { toDateISO, isSameDay } from '../domain/calendarDate';
import { useCalendarController } from '../hooks/useCalendarController';
import { AgendaList } from '../components/AgendaList';
import { CalendarHeader } from '../components/CalendarHeader';
import { DayTimeline } from '../components/DayTimeline';
import { MonthGrid } from '../components/MonthGrid';

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
      <CalendarHeader
        title={calendar.title}
        isToday={calendar.isTodaySelected}
        view={calendar.view}
        onPrevious={calendar.goPrevious}
        onNext={calendar.goNext}
        onToday={calendar.goToToday}
        onChangeView={calendar.setView}
      />
      {calendar.view === 'month' ? (
        <ScrollView contentContainerStyle={styles.monthContent}>
          <MonthGrid
            framed
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
  monthContent: {
    paddingBottom: 108,
  },
});
