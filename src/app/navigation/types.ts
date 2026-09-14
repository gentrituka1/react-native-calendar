import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Calendar: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EventEditor: { eventId?: string; dateISO: string };
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type CalendarTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Calendar'>,
  NativeStackScreenProps<AppStackParamList>
>;

export type ProfileTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<AppStackParamList>
>;
