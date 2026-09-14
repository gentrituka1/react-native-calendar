import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarScreen } from '../../features/calendar/screens/CalendarScreen';
import { EventEditorScreen } from '../../features/events/screens/EventEditorScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { AppTabBar } from '../../shared/ui/AppTabBar';
import type { AppStackParamList, MainTabParamList } from './types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function renderTabBar(props: BottomTabBarProps) {
  return <AppTabBar {...props} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="EventEditor"
        component={EventEditorScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
