import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useDependencies } from '../../../app/providers/DependenciesProvider';
import { colors, spacing } from '../../../shared/theme/theme';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppText } from '../../../shared/ui/AppText';
import { Card } from '../../../shared/ui/Card';
import { Screen } from '../../../shared/ui/Screen';

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const name = local
    .split(/[._-]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  return name || 'You';
}

function initialsFromEmail(email: string): string {
  const name = displayNameFromEmail(email);
  const parts = name.split(' ').filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return email.slice(0, 1).toUpperCase();
}

export function ProfileScreen() {
  const { session, signOut, biometricLabel, hasBiometricLogin } = useAuth();
  const { dataSource } = useDependencies();

  if (!session) {
    return null;
  }

  const name = displayNameFromEmail(session.user.email);
  const initials = initialsFromEmail(session.user.email);

  return (
    <Screen edges={{ top: true, bottom: false }}>
      <View style={styles.header}>
        <AppText variant="display">Profile</AppText>
        <AppText variant="body" color={colors.inkMuted}>
          Account and device settings
        </AppText>
      </View>
      <View style={styles.content}>
        <Card style={styles.identity}>
          <View style={styles.avatar}>
            <AppText variant="title" color={colors.white}>
              {initials}
            </AppText>
          </View>
          <AppText variant="title">{name}</AppText>
          <AppText variant="body" color={colors.inkMuted}>
            {session.user.email}
          </AppText>
        </Card>
        <Card style={styles.card}>
          <Row label="Session" value="Signed in" />
          <Row
            label="Storage"
            value={dataSource === 'firebase' ? 'Cloud · Firebase' : 'On this device'}
          />
          <Row
            label={biometricLabel}
            value={hasBiometricLogin ? 'Ready for next sign-in' : 'Not enrolled'}
            last
          />
        </Card>
        <AppButton variant="danger" label="Sign out" onPress={signOut} />
      </View>
    </Screen>
  );
}

function Row({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last ? styles.rowLast : null]}>
      <AppText variant="caption" color={colors.inkMuted}>
        {label}
      </AppText>
      <AppText variant="subtitle">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 4,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  identity: {
    alignItems: 'flex-start',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  card: {
    gap: 0,
    paddingVertical: spacing.xs,
  },
  row: {
    width: '100%',
    gap: 2,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
});
