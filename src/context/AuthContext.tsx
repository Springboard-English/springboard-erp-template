import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  logout as apiLogout,
  fetchCurrentUser,
  UserInfo,
} from "../api_calls/UserData";
import {
  clearStoredUserInfo,
  getStoredUserInfo,
  setStoredUserInfo,
} from "../auth/userStorage";
import { beginSignIn, beginSignOut, markSigningOut } from "../auth/oidc/client";
import { markLogoutToSignInTransition } from "../auth/transitionStorage";
import { AUTH_SESSION_EXPIRED_EVENT } from "../api_calls/fetchWithRefresh";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearAllLocalStorage(): void {
  localStorage.clear();
  clearStoredUserInfo();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      const storedUser = getStoredUserInfo();
      if (storedUser) {
        setUser(storedUser);
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!isActive) {
          return;
        }

        setUser(currentUser);
      } catch {
        if (!isActive) {
          return;
        }

        setUser(null);
        clearStoredUserInfo();
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAllLocalStorage();
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, []);

  const signIn = (returnTo?: string) => {
    void beginSignIn(returnTo);
  };

  const setAuthenticatedUser = (userInfo: UserInfo) => {
    setStoredUserInfo(userInfo);
    setUser(userInfo);
  };

  /**
   * All three sign-outs, in the one order that works.
   *
   * `markSigningOut` FIRST, before anything clears the user: setting
   * `user = null` re-renders, a route guard sees an unauthenticated app and
   * calls `signIn()`, and that redirect races the sign-out one. When the
   * sign-in won, Hydra's session was still alive, so it completed silently and
   * put the person straight back where they were — a Logout button that
   * visibly does nothing.
   *
   * Then the API logout, which ends the first-party session; then
   * `beginSignOut`, which is the only thing that ends **Hydra's**. Dropping our
   * own tokens and stopping there would leave the SSO session alive, and the
   * next authorization would sign them back in without asking. On a shared
   * machine that is the whole problem.
   */
  const logout = async () => {
    markSigningOut();
    markLogoutToSignInTransition();
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear all local storage on logout, including UI preferences and caches.
      clearAllLocalStorage();
      setUser(null);
      beginSignOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        setAuthenticatedUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
