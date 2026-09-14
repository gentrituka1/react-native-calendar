export type DataSource = 'local' | 'firebase';

/**
 * Composition-root switch.
 *
 * `local` uses AsyncStorage and a mimic auth token so the app runs without
 * cloud credentials. `firebase` uses Firebase Auth + Firestore.
 *
 * The rest of the app depends only on repository contracts, so this flag
 * never leaks into screens.
 */
export const appConfig = {
  dataSource: 'local' as DataSource,
  tokenTtlMs: 1000 * 60 * 60 * 24 * 7,
  weekStartsOn: 1 as 0 | 1,
};
