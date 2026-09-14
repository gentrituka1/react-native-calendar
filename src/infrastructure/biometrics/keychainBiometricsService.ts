import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import type { BiometricsService } from '../../core/contracts/BiometricsService';

const SERVICE = 'react-native-calendar.auth';

export function createKeychainBiometricsService(): BiometricsService {
  const client = new ReactNativeBiometrics();

  return {
    async isAvailable() {
      try {
        const result = await client.isSensorAvailable();
        return Boolean(result.available);
      } catch {
        return false;
      }
    },

    async getLabel() {
      try {
        const result = await client.isSensorAvailable();
        if (result.biometryType === 'FaceID') {
          return 'Face ID';
        }
        if (result.biometryType === 'TouchID') {
          return 'Touch ID';
        }
        if (result.available) {
          return 'Biometrics';
        }
        return 'Biometrics';
      } catch {
        return 'Biometrics';
      }
    },

    async authenticate(prompt) {
      try {
        const result = await client.simplePrompt({ promptMessage: prompt });
        return Boolean(result.success);
      } catch {
        return false;
      }
    },

    async saveCredentials(credentials) {
      await Keychain.setGenericPassword(credentials.email, credentials.secret, {
        service: SERVICE,
      });
    },

    async loadCredentials() {
      const result = await Keychain.getGenericPassword({ service: SERVICE });
      if (!result) {
        return null;
      }
      return { email: result.username, secret: result.password };
    },

    async hasStoredCredentials() {
      const result = await this.loadCredentials();
      return Boolean(result?.email && result.secret);
    },

    async clearCredentials() {
      await Keychain.resetGenericPassword({ service: SERVICE });
    },
  };
}
