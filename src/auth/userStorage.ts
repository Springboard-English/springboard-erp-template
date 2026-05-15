import type { UserInfo } from "../api_calls/UserData";

const USER_STORAGE_KEY = "auth.user";

export function getStoredUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as UserInfo;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function clearStoredUserInfo(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function setStoredUserInfo(userInfo: UserInfo): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
}
