import { getEndpoint } from "../config/api";
import { setStoredUserInfo } from "../auth/userStorage";
import { fetchWithRefresh } from "./fetchWithRefresh";
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
 * serves them. What DOES belong here is what the package's own ResetPassword
 * and AuthContext call — redeem a reset link, and read back who is signed in.
 * Signing in and out are OIDC's (`auth/oidc/client.ts`).
 *
 * If you are about to add a resource call here, add it to the app instead.
 */

export interface UserInfo {
    name: string;
    username: string;
    sub: string;
    account_type: string;
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
