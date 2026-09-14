import { useCallback, useMemo, useState } from 'react';
import { appConfig } from '../../../config/appConfig';
import {
  addDays,
  addMonths,
  formatDayHeading,
  formatMonthTitle,
  isSameDay,
  isSameMonth,
} from '../domain/calendarDate';

export type CalendarView = 'month' | 'day';

export function useCalendarController(now = () => new Date()) {
  const [view, setView] = useState<CalendarView>('month');
  const [visibleMonth, setVisibleMonth] = useState(() => now());
  const [selectedDate, setSelectedDate] = useState(() => now());

  const title = useMemo(
    () =>
      view === 'month'
        ? formatMonthTitle(visibleMonth)
        : formatDayHeading(selectedDate),
    [selectedDate, view, visibleMonth],
  );

  const goToToday = useCallback(() => {
    const today = now();
    setSelectedDate(today);
    setVisibleMonth(today);
  }, [now]);

  const goPrevious = useCallback(() => {
    if (view === 'month') {
      const nextMonth = addMonths(visibleMonth, -1);
      setVisibleMonth(nextMonth);
      if (!isSameMonth(selectedDate, nextMonth)) {
        setSelectedDate(nextMonth);
      }
      return;
    }
    const previousDay = addDays(selectedDate, -1);
    setSelectedDate(previousDay);
    setVisibleMonth(previousDay);
  }, [selectedDate, view, visibleMonth]);

  const goNext = useCallback(() => {
    if (view === 'month') {
      const nextMonth = addMonths(visibleMonth, 1);
      setVisibleMonth(nextMonth);
      if (!isSameMonth(selectedDate, nextMonth)) {
        setSelectedDate(nextMonth);
      }
      return;
    }
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    setVisibleMonth(nextDay);
  }, [selectedDate, view, visibleMonth]);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setVisibleMonth(date);
  }, []);

  const isTodaySelected = isSameDay(selectedDate, now());

  return {
    view,
    setView,
    visibleMonth,
    selectedDate,
    title,
    weekStartsOn: appConfig.weekStartsOn,
    isTodaySelected,
    goToToday,
    goPrevious,
    goNext,
    selectDate,
  };
}
