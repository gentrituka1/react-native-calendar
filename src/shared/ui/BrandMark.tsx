import React from 'react';
import { Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
};

export function BrandMark({ size = 64 }: Props) {
  return (
    <Image
      source={require('../assets/quipendar-icon.png')}
      accessibilityLabel="Quipendar"
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  mark: {
    resizeMode: 'cover',
  },
});
