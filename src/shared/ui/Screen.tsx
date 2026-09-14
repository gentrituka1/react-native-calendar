import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';

type Edges = {
  top?: boolean;
  bottom?: boolean;
};

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  edges?: Edges;
  keyboard?: boolean;
  backgroundColor?: string;
};

export function Screen({
  children,
  style,
  padded = false,
  edges = { top: true, bottom: false },
  keyboard = false,
  backgroundColor = colors.background,
}: Props) {
  const insets = useSafeAreaInsets();
  const content = (
    <View
      style={[
        styles.root,
        {
          backgroundColor,
          paddingTop: edges.top ? insets.top : 0,
          paddingBottom: edges.bottom
            ? Math.max(insets.bottom, spacing.xs)
            : 0,
          paddingHorizontal: padded ? spacing.md : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );

  if (!keyboard) {
    return content;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
});
