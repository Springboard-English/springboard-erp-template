import { getEndpoint } from "../config/api";
import { clearStoredUserInfo, setStoredUserInfo } from "../auth/userStorage";
import { clearAccessToken } from "../auth/accessToken";
import {
    exchangeForAccessToken,
    fetchAuthExchange,
    fetchWithRefresh,
} from "./fetchWithRefresh";
import { throwIfNotOk } from "./apiErrors";

/**
 * Auth, and only auth.
 *
 * This file used to be 3,426 lines: the whole LMS/HRM resource surface —
 * classes, sessions, schedules, assessments, feedbacks, achievements — sitting
 * in a UI package that exported none of it. `exports.ts` never listed it, so no
 * consumer could import it, and lms and erp-hrm kept their own 5,618- and
 * 3,682-line copies with roughly 2,600 lines byte-identical to what was here.
 *
 * A shared component library has no business owning an app's resource calls:
 * the endpoints, their shapes and their pagination belong to the app that
 * serves them. What DOES belong here is the credential exchange the package's
 * own SignIn, ResetPassword and AuthContext perform — sign in, sign out, and
 * read back who is signed in. That is what is left.
 *
 * If you are about to add a resource call here, add it to the app instead.
 */

export interface LoginCredentials {
    username: string;
    password: string;
    account_type?: string;
}

export interface UserInfo {
    name: string;
    username: string;
    sub: string;
    account_type: string;
    [key: string]: unknown;
}

export interface LoginResponse extends UserInfo {
    // Extends UserInfo which has sub, name, and any additional fields
}

export interface ResetPasswordRequest {
    token: string;
    username: string;
    password: string;
}

function toUserInfo(raw: unknown): UserInfo | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const name = item.name;
    const username = item.username;
    const sub = item.sub;
    const accountType = item.account_type;

    if (
        typeof name !== "string" ||
        typeof username !== "string" ||
        typeof sub !== "string" ||
        typeof accountType !== "string"
    ) {
        return null;
    }

    return {
        ...item,
        name,
        username,
        sub,
        account_type: accountType,
    };
}

function getCurrentUserPayload(data: unknown): unknown {
    if (!data || typeof data !== "object") {
        return data;
    }

    const record = data as Record<string, unknown>;

    // v2 ApiEnvelope: { attributes: {...}, objects: [user] }
    if (Array.isArray(record.objects) && record.objects.length > 0) {
        return record.objects[0];
    }

    if (record.user) {
        return record.user;
    }

    if (record.data && typeof record.data === "object") {
        const nestedData = record.data as Record<string, unknown>;
        if (nestedData.user) {
            return nestedData.user;
        }
    }

    return data;
}

export async function login(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    const loginUrl = new URL(getEndpoint("login"), window.location.origin);

    if (credentials.account_type) {
        loginUrl.searchParams.append("account_type", credentials.account_type);
    }
    // A credential exchange, not an authed request: cookies out (the reply sets
    // the refresh cookie, the durable credential that carries SSO between the
    // apps), access token back, held in memory. No Bearer, and no refreshing out
    // of a 401 — that would mean the password was wrong.
    const response = await exchangeForAccessToken(loginUrl.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: formData.toString(),
    });

    await throwIfNotOk(response, "Login failed");

    return fetchCurrentUser();
}

export async function loginWithGoogle(
    credential: string,
    accountType?: string,
): Promise<LoginResponse> {
    // Send Google JWT credential to backend as query parameter
    // Backend will verify the token and set cookies
    const params = new URLSearchParams();
    params.append("credential", credential);
    if (accountType) {
        params.append("account_type", accountType);
    }
    const response = await exchangeForAccessToken(
        `${getEndpoint("authenticateGoogle")}?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        },
    );

    await throwIfNotOk(response, "Google login failed");

    return fetchCurrentUser();
}

export async function logout(): Promise<void> {
    // Clearing the refresh cookie is the whole point, so this is an exchange
    // too — and a 401 here must not trigger a refresh that mints the session we
    // are trying to end.
    const response = await fetchAuthExchange(getEndpoint("logout"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    // The in-memory token outlives the cookie otherwise, and would keep working
    // until it expired.
    clearAccessToken();

    await throwIfNotOk(response, "Logout failed");

    clearStoredUserInfo();
}

export async function fetchCurrentUser(): Promise<UserInfo> {
    const response = await fetchWithRefresh(getEndpoint("currentUser"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    await throwIfNotOk(response, "Failed to fetch current user");

    const data = await response.json();
    const userInfo = toUserInfo(getCurrentUserPayload(data));

    if (!userInfo) {
        throw new Error("Current user response did not contain a valid user");
    }

    setStoredUserInfo(userInfo);
    return userInfo;
}

export async function resetPassword(
    request: ResetPasswordRequest,
): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("token", request.token);
    formData.append("username", request.username);
    formData.append("password", request.password);

    const response = await fetchWithRefresh(
        getEndpoint("resetPasswordAuthorised"),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            credentials: "include",
            body: formData.toString(),
        },
    );

    await throwIfNotOk(response, "Password reset failed");
}
