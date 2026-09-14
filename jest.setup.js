jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(async () => true),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(async () => true),
}));

jest.mock('react-native-biometrics', () => {
  return jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn(async () => ({
      available: false,
      biometryType: undefined,
    })),
    simplePrompt: jest.fn(async () => ({ success: false })),
  }));
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));
