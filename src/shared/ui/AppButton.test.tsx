import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AppButton } from './AppButton';

describe('AppButton', () => {
  it('renders a label and calls onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton label="Sign in" onPress={onPress} />,
    );
    fireEvent.press(getByText('Sign in'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not press when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton label="Sign in" disabled onPress={onPress} />,
    );
    fireEvent.press(getByText('Sign in'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
