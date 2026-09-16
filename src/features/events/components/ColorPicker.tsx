import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EventColorKey } from '../../../core/types/events';
import { EVENT_COLOR_KEYS } from '../../../core/types/events';
import { colors, spacing } from '../../../shared/theme/theme';
import { AppText } from '../../../shared/ui/AppText';

const COLOR_LABELS: Record<EventColorKey, string> = {
  moss: 'Moss',
  terracotta: 'Clay',
  indigo: 'Indigo',
  gold: 'Gold',
  plum: 'Plum',
};

type Props = {
  value: EventColorKey;
  onChange: (color: EventColorKey) => void;
};

export function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {EVENT_COLOR_KEYS.map(color => {
        const selected = color === value;
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={COLOR_LABELS[color]}
            style={styles.item}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: colors.event[color] },
                selected ? styles.selected : null,
              ]}
            />
            <AppText
              variant="caption"
              color={selected ? colors.ink : colors.inkFaint}>
              {COLOR_LABELS[color]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.ink,
    transform: [{ scale: 1.08 }],
  },
});
