import React, { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { getErrorMessage } from '../../../core/errors/AppError';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/ui/AppButton';
import { Screen } from '../../../shared/ui/Screen';
import { AuthForm, AuthLink } from '../components/AuthForm';

export function SignInScreen({ navigation }: AuthScreenProps<'SignIn'>) {
  const {
    signIn,
    signInWithBiometrics,
    isSubmitting,
    biometricsAvailable,
    hasBiometricLogin,
    biometricLabel,
  } = useAuth();
  const [error, setError] = useState('');

  return (
    <Screen keyboard edges={{ top: true, bottom: true }}>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to manage your meetings."
        submitLabel="Sign in"
        loading={isSubmitting}
        error={error}
        extra={
          biometricsAvailable && hasBiometricLogin ? (
            <AppButton
              variant="secondary"
              label={`Sign in with ${biometricLabel}`}
              onPress={async () => {
                setError('');
                try {
                  await signInWithBiometrics();
                } catch (caught) {
                  setError(getErrorMessage(caught));
                }
              }}
            />
          ) : null
        }
        footer={
          <AuthLink
            prompt="Need an account?"
            action="Sign up"
            onPress={() => navigation.navigate('SignUp')}
          />
        }
        onSubmit={async (email, password) => {
          setError('');
          try {
            await signIn(email, password);
          } catch (caught) {
            setError(getErrorMessage(caught));
          }
        }}
      />
    </Screen>
  );
}
