import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { invalidateAllCachedValues } from './utils/queryCache';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const routerBasename = getRouterBasename();

function getRouterBasename(): string | undefined {
  const baseUrl = import.meta.env.BASE_URL?.trim();

  if (!baseUrl || baseUrl === '/') {
    return undefined;
  }

  return baseUrl.endsWith('/') && baseUrl.length > 1
    ? baseUrl.slice(0, -1)
    : baseUrl;
}

function isReloadNavigation(): boolean {
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  if (navigationEntry && 'type' in navigationEntry) {
    return navigationEntry.type === 'reload';
  }

  return performance.navigation?.type === performance.navigation.TYPE_RELOAD;
}

async function clearBrowserCachesOnReload(): Promise<void> {
  if (!isReloadNavigation()) {
    return;
  }

  invalidateAllCachedValues();
  queryClient.clear();

  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheKeys = await window.caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => window.caches.delete(cacheKey)));
  } catch (error) {
    console.error('Failed to clear browser caches on reload:', error);
  }
}

void clearBrowserCachesOnReload();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={routerBasename}>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
