import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useDependencies } from '../../../app/providers/DependenciesProvider';
import { colors, radius, spacing } from '../../../shared/theme/theme';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppHeader } from '../../../shared/ui/AppHeader';
import { AppText } from '../../../shared/ui/AppText';
import { Screen } from '../../../shared/ui/Screen';

export function ProfileScreen() {
  const { session, signOut, biometricLabel, hasBiometricLogin } = useAuth();
  const { dataSource } = useDependencies();

  if (!session) {
    return null;
  }

  const initials = session.user.email.slice(0, 1).toUpperCase();

  return (
    <Screen edges={{ top: true, bottom: false }}>
      <AppHeader title="Profile" />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <AppText variant="title" color={colors.white}>
              {initials}
            </AppText>
          </View>
          <AppText variant="subtitle">{session.user.email}</AppText>
          <AppText variant="caption" color={colors.inkMuted}>
            User ID {session.user.id}
          </AppText>
        </View>
        <View style={styles.card}>
          <Row label="Session" value="Signed in" />
          <Row
            label="Storage"
            value={dataSource === 'firebase' ? 'Firebase' : 'Async Storage'}
          />
          <Row
            label={biometricLabel}
            value={hasBiometricLogin ? 'Ready for next sign-in' : 'Not enrolled'}
          />
        </View>
        <AppButton variant="danger" label="Sign out" onPress={signOut} />
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" color={colors.inkMuted}>
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  row: {
    width: '100%',
    gap: 2,
    paddingVertical: spacing.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
