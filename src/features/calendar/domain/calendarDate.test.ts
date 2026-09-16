import {
  addDays,
  addMonths,
  combineDateAndTime,
  formatAgendaHeading,
  formatHourLabel,
  formatMonthTitle,
  formatTime,
  fromDateISO,
  getMonthMatrix,
  getWeekdayLabels,
  isSameDay,
  isSameMonth,
  startOfDay,
  toDateISO,
} from './calendarDate';

describe('calendarDate', () => {
  it('normalizes to the start of a local day', () => {
    const date = new Date(2026, 8, 14, 18, 45, 12);
    expect(startOfDay(date)).toEqual(new Date(2026, 8, 14));
  });

  it('adds days across month boundaries', () => {
    expect(addDays(new Date(2026, 8, 30), 2)).toEqual(new Date(2026, 9, 2));
  });

  it('adds months without keeping an overflow day', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 1));
  });

  it('compares days and months', () => {
    expect(isSameDay(new Date(2026, 8, 14, 1), new Date(2026, 8, 14, 23))).toBe(
      true,
    );
    expect(isSameDay(new Date(2026, 8, 14), new Date(2026, 8, 15))).toBe(false);
    expect(isSameMonth(new Date(2026, 8, 1), new Date(2026, 8, 30))).toBe(true);
  });

  it('formats titles with a stable English locale', () => {
    expect(formatMonthTitle(new Date(2026, 8, 1))).toBe('September 2026');
    expect(formatTime(new Date(2026, 8, 14, 9, 5))).toBe('09:05');
    expect(formatHourLabel(7)).toBe('07:00');
    expect(formatAgendaHeading(new Date(2026, 8, 16))).toBe('Wednesday 16');
  });

  it('round-trips ISO dates without timezone shift', () => {
    expect(toDateISO(new Date(2026, 8, 14))).toBe('2026-09-14');
    expect(fromDateISO('2026-09-14')).toEqual(new Date(2026, 8, 14));
  });

  it('combines a calendar day with a clock time', () => {
    expect(combineDateAndTime(new Date(2026, 8, 14), 9, 30)).toEqual(
      new Date(2026, 8, 14, 9, 30, 0, 0),
    );
  });

  it('starts the week on Monday for European calendars', () => {
    expect(getWeekdayLabels(1)[0]).toBe('Mon');
    const weeks = getMonthMatrix(new Date(2026, 8, 1), 1);
    expect(weeks).toHaveLength(6);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0].date).toEqual(new Date(2026, 7, 31));
    expect(weeks[0][0].inCurrentMonth).toBe(false);
    const fourteenth = weeks.flat().find(cell => cell.date.getDate() === 14);
    expect(fourteenth?.inCurrentMonth).toBe(true);
  });

  it('can also start the week on Sunday', () => {
    expect(getWeekdayLabels(0)[0]).toBe('Sun');
    const weeks = getMonthMatrix(new Date(2026, 8, 1), 0);
    expect(weeks[0][0].date.getDay()).toBe(0);
  });
});
