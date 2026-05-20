import type { UserInfo } from "../api_calls/UserData";
export declare function getStoredUserInfo(): UserInfo | null;
export declare function clearStoredUserInfo(): void;
export declare function setStoredUserInfo(userInfo: UserInfo): void;
