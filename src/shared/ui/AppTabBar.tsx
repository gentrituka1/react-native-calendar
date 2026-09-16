import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing } from '../theme/theme';
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
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
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
              style={[styles.item, selected ? styles.itemActive : null]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    backgroundColor: colors.background,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
    ...shadows.tab,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: radius.lg,
  },
  itemActive: {
    backgroundColor: colors.primarySoft,
  },
  calendarIcon: {
    width: 22,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 5,
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
