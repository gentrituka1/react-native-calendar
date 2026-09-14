export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKDAY_LABELS_SUNDAY = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

export type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

export function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatMonthTitle(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDayHeading(date: Date): string {
  const weekday = WEEKDAY_LABELS_SUNDAY[date.getDay()];
  return `${weekday}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatHourLabel(hour: number): string {
  return `${pad2(hour)}:00`;
}

export function toDateISO(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function fromDateISO(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function combineDateAndTime(day: Date, hours: number, minutes: number): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export function getWeekdayLabels(weekStartsOn: 0 | 1): string[] {
  if (weekStartsOn === 1) {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
  return [...WEEKDAY_LABELS_SUNDAY];
}

export function getMonthMatrix(
  monthDate: Date,
  weekStartsOn: 0 | 1 = 1,
): CalendarCell[][] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = firstOfMonth.getDay();
  const leadingDays =
    weekStartsOn === 1 ? (firstWeekday + 6) % 7 : firstWeekday;

  let cursor = addDays(firstOfMonth, -leadingDays);
  const weeks: CalendarCell[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const row: CalendarCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push({
        date: cursor,
        inCurrentMonth: isSameMonth(cursor, firstOfMonth),
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }

  return weeks;
}

export function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
