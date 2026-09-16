import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import type { AppScreenProps } from '../../../app/navigation/types';
import { useEvents } from '../../../app/providers/EventsProvider';
import { getErrorMessage } from '../../../core/errors/AppError';
import type { EventColorKey } from '../../../core/types/events';
import { colors, spacing } from '../../../shared/theme/theme';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppHeader } from '../../../shared/ui/AppHeader';
import { AppText } from '../../../shared/ui/AppText';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { Card } from '../../../shared/ui/Card';
import { ErrorBanner } from '../../../shared/ui/ErrorBanner';
import { Screen } from '../../../shared/ui/Screen';
import {
  combineDateAndTime,
  formatMonthTitle,
  fromDateISO,
} from '../../calendar/domain/calendarDate';
import { MonthGrid } from '../../calendar/components/MonthGrid';
import { appConfig } from '../../../config/appConfig';
import {
  hasEventFieldErrors,
  validateEventDraft,
} from '../validation/eventValidation';
import { ColorPicker } from '../components/ColorPicker';
import { TimeField } from '../components/TimeField';

export function EventEditorScreen({
  navigation,
  route,
}: AppScreenProps<'EventEditor'>) {
  const { eventId, dateISO } = route.params;
  const { createEvent, updateEvent, removeEvent, getEvent } = useEvents();
  const existing = eventId ? getEvent(eventId) : undefined;
  const initialDay = existing ? new Date(existing.startAt) : fromDateISO(dateISO);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [day, setDay] = useState(initialDay);
  const [startAt, setStartAt] = useState(
    existing ? new Date(existing.startAt) : combineDateAndTime(initialDay, 9, 0),
  );
  const [endAt, setEndAt] = useState(
    existing ? new Date(existing.endAt) : combineDateAndTime(initialDay, 10, 0),
  );
  const [color, setColor] = useState<EventColorKey>(existing?.color ?? 'moss');
  const [visibleMonth, setVisibleMonth] = useState(initialDay);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; time?: string }>(
    {},
  );
  const [saving, setSaving] = useState(false);

  const heading = existing ? 'Edit meeting' : 'New meeting';

  const applyDay = (nextDay: Date) => {
    setDay(nextDay);
    setVisibleMonth(nextDay);
    setStartAt(combineDateAndTime(nextDay, startAt.getHours(), startAt.getMinutes()));
    setEndAt(combineDateAndTime(nextDay, endAt.getHours(), endAt.getMinutes()));
  };

  const save = async () => {
    const nextStart = combineDateAndTime(
      day,
      startAt.getHours(),
      startAt.getMinutes(),
    );
    const nextEnd = combineDateAndTime(day, endAt.getHours(), endAt.getMinutes());
    const nextErrors = validateEventDraft({
      title,
      startAt: nextStart,
      endAt: nextEnd,
    });
    setFieldErrors(nextErrors);
    if (hasEventFieldErrors(nextErrors)) {
      return;
    }
    setSaving(true);
    setError('');
    try {
      const draft = {
        title,
        description,
        startAt: nextStart.toISOString(),
        endAt: nextEnd.toISOString(),
        color,
      };
      if (existing) {
        await updateEvent(existing.id, draft);
      } else {
        await createEvent(draft);
      }
      navigation.goBack();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!existing) {
      return;
    }
    Alert.alert('Delete meeting', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeEvent(existing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const emptyEvents = useMemo(() => [], []);

  return (
    <Screen keyboard edges={{ top: true, bottom: true }}>
      <AppHeader
        title={heading}
        subtitle="Title, time, and color"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        {error ? <ErrorBanner message={error} /> : null}
        <Card style={styles.section}>
          <AppText variant="label" color={colors.inkMuted}>
            Details
          </AppText>
          <AppTextField
            label="Title"
            value={title}
            onChangeText={setTitle}
            error={fieldErrors.title}
            placeholder="Team standup"
          />
          <AppTextField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Optional notes"
            multiline
          />
        </Card>
        <Card style={styles.section} padded={false}>
          <View style={styles.sectionPad}>
            <AppText variant="label" color={colors.inkMuted}>
              Date · {formatMonthTitle(visibleMonth)}
            </AppText>
          </View>
          <MonthGrid
            monthDate={visibleMonth}
            selectedDate={day}
            weekStartsOn={appConfig.weekStartsOn}
            events={emptyEvents}
            onSelectDate={applyDay}
          />
          <View style={[styles.sectionPad, styles.times]}>
            <TimeField label="Starts" value={startAt} onChange={setStartAt} />
            <TimeField label="Ends" value={endAt} onChange={setEndAt} />
          </View>
          {fieldErrors.time ? (
            <AppText
              variant="caption"
              color={colors.danger}
              style={styles.timeError}>
              {fieldErrors.time}
            </AppText>
          ) : null}
        </Card>
        <Card style={styles.section}>
          <AppText variant="label" color={colors.inkMuted}>
            Color
          </AppText>
          <ColorPicker value={color} onChange={setColor} />
        </Card>
        <AppButton
          label={existing ? 'Save changes' : 'Create meeting'}
          onPress={save}
          loading={saving}
        />
        {existing ? (
          <AppButton
            variant="danger"
            label="Delete meeting"
            onPress={confirmDelete}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionPad: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  times: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  timeError: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
