type UserScopeSource = {
  roles?: unknown;
  account_type?: unknown;
};

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

/** A user's scopes, read from `roles`: the only such field `/v2/users/me` returns. */
export function getUserScopes(value: unknown): string[] {
  return normalizeScopeList(isUserScopeSource(value) ? value.roles : value);
}

export function hasUserScope(value: unknown, permission: string): boolean {
  return getUserScopes(value).includes(permission);
}

export function hasAnyUserScope(value: unknown, permissions: string[]): boolean {
  const scopes = getUserScopes(value);
  return permissions.some((permission) => scopes.includes(permission));
}

