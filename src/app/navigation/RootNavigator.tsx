import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { colors, spacing } from '../../shared/theme/theme';
import { BrandMark } from '../../shared/ui/BrandMark';
import { AppText } from '../../shared/ui/AppText';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { session, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={styles.boot}>
        <BrandMark size={72} />
        <ActivityIndicator color={colors.primary} style={styles.spinner} />
        <AppText variant="caption" color={colors.inkMuted}>
          Loading Quipendar
        </AppText>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  spinner: {
    marginTop: spacing.xs,
  },
});
