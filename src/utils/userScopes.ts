type UserScopeSource = {
  roles?: unknown;
  scope?: unknown;
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
  return Boolean(value) && typeof value === "object";
}

export function getUserScopes(value: unknown): string[] {
  if (isUserScopeSource(value)) {
    const roles = normalizeScopeList(value.roles);
    if (roles.length > 0) {
      return roles;
    }

    return normalizeScopeList(value.scope);
  }

  return normalizeScopeList(value);
}

export function hasUserScope(value: unknown, permission: string): boolean {
  return getUserScopes(value).includes(permission);
}

export function hasAnyUserScope(value: unknown, permissions: string[]): boolean {
  const scopes = getUserScopes(value);
  return permissions.some((permission) => scopes.includes(permission));
}

export function canAccessManagement(value: unknown): boolean {
  if (!isUserScopeSource(value) || value.account_type !== "employee") {
    return false;
  }

  return hasAnyUserScope(value, [
    "classes_get",
    "sessions_get",
    "schedules_get",
    "tests_get",
    "classes_feedbacks_get",
  ]);
}
