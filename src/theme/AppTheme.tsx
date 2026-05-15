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

const COLOR_MODE_STORAGE_KEY = 'app-color-mode';

const ColorModeContext = React.createContext<ColorModeContextValue>({
  mode: 'system',
  resolvedMode: 'light',
  systemMode: 'light',
  setMode: () => undefined,
});

function getStoredMode(): ColorMode {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const storedMode = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  return storedMode === 'light' || storedMode === 'dark' || storedMode === 'system'
    ? storedMode
    : 'system';
}

function getSystemMode(): ResolvedColorMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyResolvedMode(mode: ResolvedColorMode) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
}

export function useColorMode() {
  return React.useContext(ColorModeContext);
}

export default function AppTheme({ children, disableCustomTheme }: AppThemeProps) {
  const [mode, setMode] = React.useState<ColorMode>(() => getStoredMode());
  const [systemMode, setSystemMode] = React.useState<ResolvedColorMode>(() => getSystemMode());
  const resolvedMode = mode === 'system' ? systemMode : mode;

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? 'dark' : 'light');
    };

    setSystemMode(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  }, [mode]);

  React.useEffect(() => {
    if (disableCustomTheme) {
      return;
    }

    applyResolvedMode(resolvedMode);
  }, [disableCustomTheme, resolvedMode]);

  const contextValue = React.useMemo<ColorModeContextValue>(() => ({
    mode,
    resolvedMode,
    systemMode,
    setMode,
  }), [mode, resolvedMode, systemMode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      {children}
    </ColorModeContext.Provider>
  );
}
