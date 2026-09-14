import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  firebaseConfig,
  isFirebaseConfigured,
} from '../../config/firebaseConfig';
import { AppError } from '../../core/errors/AppError';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

function getApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new AppError(
      'Firebase is not configured. Add keys in src/config/firebaseConfig.ts.',
      'firebase_unconfigured',
    );
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) {
    return auth;
  }
  const firebaseApp = getApp();
  try {
    const { getReactNativePersistence } = require('firebase/auth') as {
      getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
    };
    if (typeof getReactNativePersistence === 'function') {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage) as never,
      });
    } else {
      auth = getAuth(firebaseApp);
    }
  } catch {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getApp());
  }
  return firestore;
}
