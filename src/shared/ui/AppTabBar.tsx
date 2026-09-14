import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';
import { AppText } from './AppText';

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? colors.primary : colors.inkFaint;
  if (name === 'Calendar') {
    return (
      <View style={[styles.calendarIcon, { borderColor: color }]}>
        <View style={[styles.calendarBar, { backgroundColor: color }]} />
        <View style={styles.calendarDots}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <View style={[styles.dot, { backgroundColor: color }]} />
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.profileIcon}>
      <View style={[styles.head, { borderColor: color }]} />
      <View style={[styles.shoulders, { borderColor: color }]} />
    </View>
  );
}

export function AppTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        const options = descriptors[route.key].options;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}>
            <TabIcon name={route.name} active={selected} />
            <AppText
              variant="caption"
              color={selected ? colors.primary : colors.inkFaint}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  calendarIcon: {
    width: 22,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  calendarBar: {
    height: 5,
  },
  calendarDots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  profileIcon: {
    width: 22,
    height: 20,
    alignItems: 'center',
  },
  head: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  shoulders: {
    marginTop: 2,
    width: 16,
    height: 8,
    borderWidth: 1.5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
  },
});
