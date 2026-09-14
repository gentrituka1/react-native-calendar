import React, { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { getErrorMessage } from '../../../core/errors/AppError';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { Screen } from '../../../shared/ui/Screen';
import { AuthForm, AuthLink } from '../components/AuthForm';

export function SignUpScreen({ navigation }: AuthScreenProps<'SignUp'>) {
  const { signUp, isSubmitting } = useAuth();
  const [error, setError] = useState('');

  return (
    <Screen keyboard edges={{ top: true, bottom: true }}>
      <AuthForm
        title="Create account"
        subtitle="Register to keep your calendar in sync on this device."
        submitLabel="Sign up"
        loading={isSubmitting}
        error={error}
        footer={
          <AuthLink
            prompt="Already have an account?"
            action="Sign in"
            onPress={() => navigation.navigate('SignIn')}
          />
        }
        onSubmit={async (email, password) => {
          setError('');
          try {
            await signUp(email, password);
          } catch (caught) {
            setError(getErrorMessage(caught));
          }
        }}
      />
    </Screen>
  );
}
