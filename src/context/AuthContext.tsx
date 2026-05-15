import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  fetchCurrentUser,
  LoginCredentials,
  UserInfo,
} from "../api_calls/UserData";
import {
  clearStoredUserInfo,
  getStoredUserInfo,
  setStoredUserInfo,
} from "../auth/userStorage";
import { AUTH_SESSION_EXPIRED_EVENT } from "../api_calls/fetchWithRefresh";

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
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

  const login = async (credentials: LoginCredentials) => {
    try {
      const userInfo = await apiLogin(credentials);
      setUser(userInfo);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const setAuthenticatedUser = (userInfo: UserInfo) => {
    setStoredUserInfo(userInfo);
    setUser(userInfo);
  };

  const logout = async () => {
    try {
      // Call logout API to clear cookie server-side
      await apiLogout();
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear all local storage on logout, including UI preferences and caches.
      clearAllLocalStorage();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
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
