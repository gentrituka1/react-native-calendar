import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EventColorKey } from '../../../core/types/events';
import { EVENT_COLOR_KEYS } from '../../../core/types/events';
import { colors, spacing } from '../../../shared/theme/theme';

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
            style={[
              styles.swatch,
              { backgroundColor: colors.event[color] },
              selected ? styles.selected : null,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
});
