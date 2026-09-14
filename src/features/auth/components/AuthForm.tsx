import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppText } from '../../../shared/ui/AppText';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { ErrorBanner } from '../../../shared/ui/ErrorBanner';
import { colors, spacing } from '../../../shared/theme/theme';
import {
  hasAuthFieldErrors,
  validateAuthForm,
} from '../validation/authValidation';

type Props = {
  title: string;
  subtitle: string;
  submitLabel: string;
  loading: boolean;
  error?: string;
  extra?: React.ReactNode;
  footer: React.ReactNode;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  loading,
  error,
  extra,
  footer,
  onSubmit,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async () => {
    const nextErrors = validateAuthForm(email, password);
    setFieldErrors(nextErrors);
    if (hasAuthFieldErrors(nextErrors)) {
      return;
    }
    await onSubmit(email, password);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <AppText variant="title" color={colors.white}>
            C
          </AppText>
        </View>
        <AppText variant="display">{title}</AppText>
        <AppText variant="body" color={colors.inkMuted}>
          {subtitle}
        </AppText>
      </View>
      {error ? <ErrorBanner message={error} /> : null}
      <AppTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        error={fieldErrors.email}
      />
      <AppTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        error={fieldErrors.password}
      />
      <AppButton label={submitLabel} onPress={handleSubmit} loading={loading} />
      {extra}
      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

export function AuthLink({
  prompt,
  action,
  onPress,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.linkRow} accessibilityRole="button">
      <AppText color={colors.inkMuted}>{prompt} </AppText>
      <AppText color={colors.primary} variant="subtitle">
        {action}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  brand: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
