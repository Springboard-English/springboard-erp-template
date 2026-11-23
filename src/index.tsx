import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import OidcBoot from './auth/oidc/OidcBoot';
import { clearCachesOnReload } from './boot/reloadCache';
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
void clearCachesOnReload(queryClient);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider storageKey="springboard_locale">
        {/* Above AuthProvider on purpose — see the note in OidcBoot. The
            provider's bootstrap treats a missing token as a dead session,
            which is every reload under OIDC. */}
        <OidcBoot>
          <AuthProvider>
            <p style={{ padding: '3rem', textAlign: 'center' }}>
              Signed in. This harness exists to exercise the boot path; the
              apps supply their own routes.
            </p>
          </AuthProvider>
        </OidcBoot>
      </I18nProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
