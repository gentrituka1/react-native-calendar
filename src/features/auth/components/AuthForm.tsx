import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppText } from '../../../shared/ui/AppText';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { BrandMark } from '../../../shared/ui/BrandMark';
import { Card } from '../../../shared/ui/Card';
import { ErrorBanner } from '../../../shared/ui/ErrorBanner';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import {
  hasAuthFieldErrors,
  validateAuthForm,
  validatePasswordConfirmation,
} from '../validation/authValidation';
import { PasswordHints } from './PasswordHints';

type Mode = 'signIn' | 'signUp';

type Props = {
  mode: Mode;
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
  mode,
  title,
  subtitle,
  submitLabel,
  loading,
  error,
  extra,
  footer,
  onSubmit,
}: Props) {
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const isSignUp = mode === 'signUp';

  const handleSubmit = async () => {
    const nextErrors = validateAuthForm(email, password);
    if (isSignUp) {
      const confirmError = validatePasswordConfirmation(password, confirm);
      if (confirmError) {
        nextErrors.confirm = confirmError;
      }
    }
    setFieldErrors(nextErrors);
    if (hasAuthFieldErrors(nextErrors)) {
      return;
    }
    await onSubmit(email, password);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
      <View style={styles.hero}>
        <BrandMark />
        <AppText variant="caption" color={colors.primary} style={styles.kicker}>
          Quipendar
        </AppText>
        <AppText variant="display">{title}</AppText>
        <AppText variant="body" color={colors.inkMuted}>
          {subtitle}
        </AppText>
      </View>
      <Card style={styles.card}>
        {error ? <ErrorBanner message={error} /> : null}
        <AppTextField
          label="Email"
          value={email}
          onChangeText={value => {
            setEmail(value);
            if (fieldErrors.email) {
              setFieldErrors(current => ({ ...current, email: undefined }));
            }
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder="you@company.com"
          error={fieldErrors.email}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <AppTextField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={value => {
            setPassword(value);
            if (fieldErrors.password) {
              setFieldErrors(current => ({ ...current, password: undefined }));
            }
          }}
          secureTextEntry
          textContentType={isSignUp ? 'newPassword' : 'password'}
          autoComplete={isSignUp ? 'password-new' : 'password'}
          returnKeyType={isSignUp ? 'next' : 'go'}
          blurOnSubmit={!isSignUp}
          placeholder={isSignUp ? 'Create a password' : 'Your password'}
          error={fieldErrors.password}
          onSubmitEditing={() => {
            if (isSignUp) {
              confirmRef.current?.focus();
              return;
            }
            handleSubmit();
          }}
        />
        {isSignUp && password.length > 0 ? (
          <PasswordHints password={password} />
        ) : null}
        {isSignUp ? (
          <AppTextField
            ref={confirmRef}
            label="Confirm password"
            value={confirm}
            onChangeText={value => {
              setConfirm(value);
              if (fieldErrors.confirm) {
                setFieldErrors(current => ({ ...current, confirm: undefined }));
              }
            }}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            returnKeyType="go"
            placeholder="Repeat password"
            error={fieldErrors.confirm}
            onSubmitEditing={handleSubmit}
          />
        ) : null}
        <AppButton
          label={submitLabel}
          onPress={handleSubmit}
          loading={loading}
        />
        {extra ? (
          <>
            <View style={styles.divider}>
              <View style={styles.rule} />
              <AppText variant="caption" color={colors.inkFaint}>
                or
              </AppText>
              <View style={styles.rule} />
            </View>
            {extra}
          </>
        ) : null}
      </Card>
      <View style={styles.footer}>{footer}</View>
    </ScrollView>
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
    <Pressable
      onPress={onPress}
      style={styles.linkRow}
      accessibilityRole="button">
      <AppText color={colors.inkMuted}>{prompt} </AppText>
      <AppText color={colors.primary} variant="subtitle">
        {action}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  blobTop: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primarySoft,
    top: -80,
    right: -70,
    opacity: 0.7,
  },
  blobBottom: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accentSoft,
    bottom: 40,
    left: -70,
    opacity: 0.8,
  },
  hero: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  kicker: {
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  card: {
    gap: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
