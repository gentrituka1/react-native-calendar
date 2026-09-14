import type { AuthSession } from '../types/auth';

export interface AuthRepository {
  signUp(email: string, password: string): Promise<AuthSession>;
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  restoreSession(): Promise<AuthSession | null>;
}
