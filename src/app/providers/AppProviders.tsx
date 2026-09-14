import React, { type ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './AuthProvider';
import { DependenciesProvider } from './DependenciesProvider';
import { EventsProvider } from './EventsProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <DependenciesProvider>
          <AuthProvider>
            <EventsProvider>{children}</EventsProvider>
          </AuthProvider>
        </DependenciesProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

