import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { AppContainer } from '../../infrastructure/createContainer';
import { createContainer } from '../../infrastructure/createContainer';

const DependenciesContext = createContext<AppContainer | null>(null);

export function DependenciesProvider({ children }: { children: ReactNode }) {
  const container = useMemo(() => createContainer(), []);
  return (
    <DependenciesContext.Provider value={container}>
      {children}
    </DependenciesContext.Provider>
  );
}

export function useDependencies(): AppContainer {
  const value = useContext(DependenciesContext);
  if (!value) {
    throw new Error('useDependencies must be used inside DependenciesProvider');
  }
  return value;
}
