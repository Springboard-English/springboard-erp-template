import { ReactNode } from 'react';
import { API_CONFIG } from '../config/api';
interface ConfigContextType {
    apiConfig: typeof API_CONFIG;
}
export declare function ConfigProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useConfig(): ConfigContextType;
export {};
