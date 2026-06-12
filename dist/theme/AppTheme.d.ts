import * as React from 'react';
type ColorMode = 'system' | 'light' | 'dark';
type ResolvedColorMode = 'light' | 'dark';
interface AppThemeProps {
    children: React.ReactNode;
    disableCustomTheme?: boolean;
}
interface ColorModeContextValue {
    mode: ColorMode;
    resolvedMode: ResolvedColorMode;
    systemMode: ResolvedColorMode;
    setMode: (mode: ColorMode) => void;
}
export declare function useColorMode(): ColorModeContextValue;
export default function AppTheme({ children, disableCustomTheme }: AppThemeProps): import("react/jsx-runtime").JSX.Element;
export {};
