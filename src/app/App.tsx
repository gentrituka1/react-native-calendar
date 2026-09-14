import React from 'react';
import { enableScreens } from 'react-native-screens';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from './navigation/RootNavigator';

enableScreens();

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
