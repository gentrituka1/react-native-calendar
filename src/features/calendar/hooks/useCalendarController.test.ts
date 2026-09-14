import { act, renderHook } from '@testing-library/react-native';
import { useCalendarController } from './useCalendarController';

describe('useCalendarController', () => {
  const now = () => new Date(2026, 8, 14, 10, 0, 0);

  it('starts on the current day in month view', () => {
    const { result } = renderHook(() => useCalendarController(now));
    expect(result.current.view).toBe('month');
    expect(result.current.title).toBe('September 2026');
    expect(result.current.selectedDate.getDate()).toBe(14);
  });

  it('moves by month, then by day after switching views', () => {
    const { result } = renderHook(() => useCalendarController(now));

    act(() => {
      result.current.goNext();
    });
    expect(result.current.visibleMonth.getMonth()).toBe(9);
    expect(result.current.title).toBe('October 2026');

    act(() => {
      result.current.setView('day');
    });
    act(() => {
      result.current.goPrevious();
    });
    expect(result.current.selectedDate.getDate()).toBe(30);
    expect(result.current.selectedDate.getMonth()).toBe(8);
  });

  it('returns to today', () => {
    const { result } = renderHook(() => useCalendarController(now));
    act(() => {
      result.current.goNext();
      result.current.goToToday();
    });
    expect(result.current.selectedDate.getMonth()).toBe(8);
    expect(result.current.selectedDate.getDate()).toBe(14);
  });
});
