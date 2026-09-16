import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

type TextFieldRef = React.ComponentRef<typeof TextInput>;

export const AppTextField = forwardRef<TextFieldRef, Props>(function AppTextField(
  {
    label,
    error,
    hint,
    secureTextEntry,
    style,
    onFocus,
    onBlur,
    multiline,
    ...rest
  },
  ref,
) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color={colors.inkMuted}>
        {label}
      </AppText>
      <View
        style={[
          styles.field,
          multiline ? styles.fieldMultiline : null,
          focused ? styles.fieldFocused : null,
          error ? styles.fieldError : null,
        ]}>
        <TextInput
          ref={ref}
          {...rest}
          multiline={multiline}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          secureTextEntry={secureTextEntry ? hidden : false}
          placeholderTextColor={colors.inkFaint}
          textAlignVertical={multiline ? 'top' : 'center'}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            multiline ? styles.inputMultiline : styles.inputSingle,
            style,
          ]}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden(value => !value)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <AppText variant="caption" color={colors.primary}>
              {hidden ? 'Show' : 'Hide'}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.inkFaint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xxs,
  },
  field: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldMultiline: {
    height: undefined,
    minHeight: 108,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  fieldFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  inputSingle: {
    height: '100%',
  },
  inputMultiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
});
