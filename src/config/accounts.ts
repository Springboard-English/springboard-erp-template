import { appUrl, PRODUCTION_APP_URLS } from "./apps";

/** The production accounts panel. Kept for apps that import it; links use `accountsProfileUrl()`. */
export const ACCOUNTS_PROFILE_URL = `${PRODUCTION_APP_URLS.accounts}/profile`;

/** The accounts site's panel (profile, password, connected apps), at the configured accounts URL. */
export function accountsProfileUrl(): string {
    return appUrl("accounts", "/profile");
}
