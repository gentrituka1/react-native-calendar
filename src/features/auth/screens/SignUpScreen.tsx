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
        mode="signUp"
        title="Create your calendar"
        subtitle="A few details and you can start adding meetings on this device."
        submitLabel="Create account"
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
