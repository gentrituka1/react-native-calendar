import { appConfig } from '../config/appConfig';
import { isFirebaseConfigured } from '../config/firebaseConfig';
import type { AuthRepository } from '../core/contracts/AuthRepository';
import type { BiometricsService } from '../core/contracts/BiometricsService';
import type { EventRepository } from '../core/contracts/EventRepository';
import { createFirebaseAuthRepository } from './auth/firebaseAuthRepository';
import { createLocalAuthRepository } from './auth/localAuthRepository';
import { createKeychainBiometricsService } from './biometrics/keychainBiometricsService';
import { createFirebaseEventRepository } from './events/firebaseEventRepository';
import { createLocalEventRepository } from './events/localEventRepository';
import { createAsyncStorageStore } from './storage/asyncStorageStore';

export type AppContainer = {
  dataSource: 'local' | 'firebase';
  authRepository: AuthRepository;
  eventRepository: EventRepository;
  biometrics: BiometricsService;
};

export function createContainer(): AppContainer {
  const useFirebase =
    appConfig.dataSource === 'firebase' && isFirebaseConfigured();
  const biometrics = createKeychainBiometricsService();

  if (useFirebase) {
    return {
      dataSource: 'firebase',
      authRepository: createFirebaseAuthRepository(),
      eventRepository: createFirebaseEventRepository(),
      biometrics,
    };
  }

  const store = createAsyncStorageStore();
  return {
    dataSource: 'local',
    authRepository: createLocalAuthRepository({
      store,
      ttlMs: appConfig.tokenTtlMs,
    }),
    eventRepository: createLocalEventRepository({ store }),
    biometrics,
  };
}
