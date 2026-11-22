type UserScopeSource = {
  roles?: unknown;
  account_type?: unknown;
};

// The API stores and returns `roles` space-separated (`/v2/users/me` and the
// user rows); it never writes a comma, so a comma is not a separator here.
function normalizeScopeList(scope: unknown): string[] {
  if (Array.isArray(scope)) {
    return scope.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  if (typeof scope === "string") {
    return scope
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isUserScopeSource(value: unknown): value is UserScopeSource {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * A user's scopes. Takes the user (its `roles`, the only such field
 * `/v2/users/me` returns), the `roles` string itself, or a list of scopes.
 */
export function getUserScopes(value: unknown): string[] {
  return normalizeScopeList(isUserScopeSource(value) ? value.roles : value);
}

/** Whether the user (or roles string) holds exactly `permission`. */
export function hasUserScope(value: unknown, permission: string): boolean {
  return getUserScopes(value).includes(permission);
}

/** Whether the user holds any one of `permissions`. */
export function hasAnyUserScope(value: unknown, permissions: string[]): boolean {
  const scopes = getUserScopes(value);
  return permissions.some((permission) => scopes.includes(permission));
}

/**
 * Whether the user holds `permission` or any narrower scope under it
 * (`users_patch` or `users_patch_name`): enough to show an edit control
 * whose individual fields are then checked one by one.
 */
export function hasScopedUserPermission(value: unknown, permission: string): boolean {
  return getUserScopes(value).some(
    (scope) => scope === permission || scope.startsWith(`${permission}_`),
  );
}

/** Whether the user may patch any field of `resource` (`<resource>_patch` or one of its field scopes). */
export function hasPatchUserPermission(value: unknown, resource: string): boolean {
  return hasScopedUserPermission(value, `${resource}_patch`);
}

/**
 * Whether the user may write `field` under `permission`: the whole scope
 * (`rates_post`) or that field's own (`rates_post_rate_type`).
 */
export function hasFieldScope(value: unknown, permission: string, field: string): boolean {
  const scopes = getUserScopes(value);
  return scopes.includes(permission) || scopes.includes(`${permission}_${field}`);
}

/** Whether the user may patch `field` of `resource`: `<resource>_patch` or `<resource>_patch_<field>`. */
export function hasPatchFieldScope(value: unknown, resource: string, field: string): boolean {
  return hasFieldScope(value, `${resource}_patch`, field);
}

// Sent with a patch for concurrency and time zones, not as fields: no scope guards them.
const PATCH_METADATA_FIELDS = new Set(["edited_at", "timezone_offset"]);

/** The fields a patch body writes, leaving out `edited_at` and `timezone_offset`. */
export function getPatchPayloadFields(payload: object): string[] {
  return Object.keys(payload).filter((field) => !PATCH_METADATA_FIELDS.has(field));
}

/**
 * The fields of `payload` the user has no scope to patch on `resource`;
 * empty when they hold the whole `<resource>_patch`. Returns field names,
 * not scope names.
 */
export function getMissingPatchFieldScopes(value: unknown, resource: string, payload: object): string[] {
  if (hasUserScope(value, `${resource}_patch`)) {
    return [];
  }

  return getPatchPayloadFields(payload).filter(
    (field) => !hasUserScope(value, `${resource}_patch_${field}`),
  );
}

/** Throws, naming each missing `<resource>_patch_<field>` scope, unless the user may send all of `payload`. */
export function assertCanPatchPayload(value: unknown, resource: string, payload: object): void {
  const missing = getMissingPatchFieldScopes(value, resource, payload);
  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `Missing patch scope(s): ${missing.map((field) => `${resource}_patch_${field}`).join(", ")}`,
  );
}
