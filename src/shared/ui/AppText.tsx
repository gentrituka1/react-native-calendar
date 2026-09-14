import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { colors, typography } from '../theme/theme';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  color = colors.ink,
  align,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[typography[variant], { color, textAlign: align }, style]}
    />
  );
}

export const textStyles = StyleSheet.create({});
