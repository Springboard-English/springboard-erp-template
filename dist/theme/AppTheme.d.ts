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
    /**
     * False when there is no `AppTheme` above — the context default is a real
     * object with a no-op `setMode`, so without this a colour-mode control
     * renders happily and does nothing when clicked. Leap mounts no `AppTheme`
     * at all (it is light-only), so shared chrome has to ask before offering one.
     */
    isConfigured: boolean;
}
export declare function useColorMode(): ColorModeContextValue;
export default function AppTheme({ children, disableCustomTheme }: AppThemeProps): import("react/jsx-runtime").JSX.Element;
export {};
