import { getEndpoint } from "../config/api";
import { setStoredUserInfo } from "../auth/userStorage";
import { fetchWithRefresh } from "./fetchWithRefresh";
import { throwIfNotOk } from "./apiErrors";
import { isOutdatedEditedAtConflictError } from "../utils/conflictErrors";

/**
 * Auth, and only auth.
 *
 * A shared component library has no business owning an app's resource calls:
 * the endpoints, their shapes and their pagination belong to the app that
 * serves them. What DOES belong here is what the package's own ResetPassword
 * and AuthContext call — redeem a reset link, and read back who is signed in —
 * plus writing the signed-in user's own `info`, where the widget board keeps
 * its layout. Signing in and out are OIDC's (`auth/oidc/client.ts`).
 *
 * If you are about to add a resource call here, add it to the app instead.
 */

export interface UserInfo {
    name: string;
    username: string;
    sub: string;
    account_type: string;
    /** The profile picture's public URL; absent or null for none. */
    picture_url?: string | null;
    [key: string]: unknown;
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
        picture_url: typeof item.picture_url === "string" ? item.picture_url : null,
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

export async function fetchCurrentUser(): Promise<UserInfo> {
    const response = await fetchWithRefresh(getEndpoint("currentUser"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
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

async function sendInfoPatch(
    editedAt: unknown,
    patch: Record<string, unknown>,
): Promise<UserInfo> {
    const response = await fetchWithRefresh(getEndpoint("currentUser"), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ edited_at: editedAt ?? null, info: patch }),
    });

    await throwIfNotOk(response, "Failed to save your settings");

    const userInfo = toUserInfo(getCurrentUserPayload(await response.json()));
    if (!userInfo) {
        // The write landed; only the echo is unreadable.
        return fetchCurrentUser();
    }

    setStoredUserInfo(userInfo);
    return userInfo;
}

/**
 * Merge `patch` into the signed-in user's `info`. Send only the keys being
 * changed: the API merges one level deep, so a key left out is kept and a key
 * set to `null` is cleared.
 *
 * `edited_at` is read fresh rather than taken from the cached user, which goes
 * stale the moment anything else (a tour, onboarding) writes the record; a
 * conflict that still slips through is retried once.
 */
export async function patchCurrentUserInfo(
    patch: Record<string, unknown>,
): Promise<UserInfo> {
    const current = await fetchCurrentUser();
    try {
        return await sendInfoPatch(current.edited_at, patch);
    } catch (error) {
        if (!isOutdatedEditedAtConflictError(error)) {
            throw error;
        }
        const fresh = await fetchCurrentUser();
        return sendInfoPatch(fresh.edited_at, patch);
    }
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
            body: formData.toString(),
        },
    );

    await throwIfNotOk(response, "Password reset failed");
}
