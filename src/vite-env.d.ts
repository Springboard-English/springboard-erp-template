/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_ID_TOKEN_COOKIE_NAME?: string;
  readonly VITE_JWT_PUBLIC_KEY?: string;
  readonly VITE_JWT_ISSUER?: string;
  readonly VITE_JWT_AUDIENCE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: {
          client_id: string;
          callback: (response: any) => void;
          use_fedcm_for_prompt?: boolean;
          auto_select?: boolean;
          context?: string;
        }) => void;
        renderButton: (element: HTMLElement | null, options: any) => void;
        prompt: (callback?: (notification: {
          isNotDisplayed: () => boolean;
          isSkippedMoment: () => boolean;
          getNotDisplayedReason: () => string;
        }) => void) => void;
      };
    };
  };
}
