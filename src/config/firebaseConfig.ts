/**
 * Fill these values from the Firebase console (Project settings → Your apps)
 * and set `appConfig.dataSource` to `'firebase'`.
 *
 * Keep real keys out of git if this repository is public. The empty strings
 * below are intentional placeholders so the local adapter remains the default.
 */
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}
