import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppText } from '../../../shared/ui/AppText';
import { pad2 } from '../../calendar/domain/calendarDate';

type Props = {
  label: string;
  value: Date;
  onChange: (next: Date) => void;
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

export function TimeField({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(value.getHours());
  const [minute, setMinute] = useState(Math.round(value.getMinutes() / 5) * 5);

  const display = useMemo(
    () => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`,
    [value],
  );

  const openSheet = () => {
    setHour(value.getHours());
    setMinute(Math.round(value.getMinutes() / 5) * 5 % 60);
    setOpen(true);
  };

  const confirm = () => {
    const next = new Date(value);
    next.setHours(hour, minute, 0, 0);
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable onPress={openSheet} style={styles.field} accessibilityRole="button">
        <AppText variant="caption" color={colors.inkMuted}>
          {label}
        </AppText>
        <AppText variant="subtitle">{display}</AppText>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <AppText variant="subtitle">{label}</AppText>
            <View style={styles.columns}>
              <ScrollView style={styles.column}>
                {HOURS.map(item => (
                  <Pressable
                    key={item}
                    onPress={() => setHour(item)}
                    style={[styles.option, hour === item ? styles.optionActive : null]}>
                    <AppText color={hour === item ? colors.white : colors.ink}>
                      {pad2(item)}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>
              <ScrollView style={styles.column}>
                {MINUTES.map(item => (
                  <Pressable
                    key={item}
                    onPress={() => setMinute(item)}
                    style={[styles.option, minute === item ? styles.optionActive : null]}>
                    <AppText color={minute === item ? colors.white : colors.ink}>
                      {pad2(item)}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <AppButton label="Done" onPress={confirm} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    maxHeight: '70%',
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.sm,
    height: 220,
  },
  column: {
    flex: 1,
  },
  option: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
});
