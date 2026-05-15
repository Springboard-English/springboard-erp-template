import { createContext, useContext, ReactNode } from 'react';
import { API_CONFIG } from '../config/api';

interface ConfigContextType {
  apiConfig: typeof API_CONFIG;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={{ apiConfig: API_CONFIG }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
