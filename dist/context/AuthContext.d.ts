import { ReactNode } from "react";
import { UserInfo } from "../api_calls/UserData";
/**
 * **Signing in is not this provider's job any more.**
 *
 * There is no `login(credentials)`. The API is the only thing that ever sees a
 * password or a Google credential — it hosts the one login page, as the OIDC
 * bridge in front of Hydra — and an app reaches it by redirecting, which is
 * what `signIn()` does. `setAuthenticatedUser` stays because `OidcCallback`
 * needs to hand the loaded account back after the code exchange.
 *
 * The bootstrap below is unchanged and is safe **because `OidcBoot` runs above
 * this provider**: it does not render children without an access token, so
 * `fetchCurrentUser` here is never the call that discovers there is no session.
 */
interface AuthContextType {
    user: UserInfo | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    /** Redirect to the authorization server. Returns only if a sign-out owns the page. */
    signIn: (returnTo?: string) => void;
    setAuthenticatedUser: (userInfo: UserInfo) => void;
    logout: () => Promise<void>;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
