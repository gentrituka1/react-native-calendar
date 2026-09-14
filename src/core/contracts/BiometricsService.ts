export type StoredCredentials = {
  email: string;
  secret: string;
};

export interface BiometricsService {
  isAvailable(): Promise<boolean>;
  getLabel(): Promise<string>;
  authenticate(prompt: string): Promise<boolean>;
  saveCredentials(credentials: StoredCredentials): Promise<void>;
  loadCredentials(): Promise<StoredCredentials | null>;
  hasStoredCredentials(): Promise<boolean>;
  clearCredentials(): Promise<void>;
}
