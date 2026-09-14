import AsyncStorage from '@react-native-async-storage/async-storage';
import type { KeyValueStore } from '../../core/contracts/KeyValueStore';

export function createAsyncStorageStore(): KeyValueStore {
  return {
    getItem: key => AsyncStorage.getItem(key),
    setItem: (key, value) => AsyncStorage.setItem(key, value),
    removeItem: key => AsyncStorage.removeItem(key),
  };
}
