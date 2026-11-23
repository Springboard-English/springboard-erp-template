import { describe, expect, it } from "vitest";

import {
  assertCanPatchPayload,
  getMissingPatchFieldScopes,
  getPatchPayloadFields,
  getUserScopes,
  hasAnyUserScope,
  hasFieldScope,
  hasPatchFieldScope,
  hasPatchUserPermission,
  hasScopedUserPermission,
  hasUserScope,
} from "../userScopes";

// `/v2/users/me` answers `roles` as one space-separated string.
const user = { sub: "u1", account_type: "employee", roles: "users_get users_patch_name  rates_post_rate_type\ttests_patch" };

describe("getUserScopes", () => {
  it("reads a user's roles, a roles string or a list", () => {
    expect(getUserScopes(user)).toEqual(["users_get", "users_patch_name", "rates_post_rate_type", "tests_patch"]);
    expect(getUserScopes("a b")).toEqual(["a", "b"]);
    expect(getUserScopes(["a", "", 3, "b"])).toEqual(["a", "b"]);
  });

  it("does not split on commas, which the API never writes", () => {
    expect(getUserScopes("a,b")).toEqual(["a,b"]);
  });

  it("is empty for a user without roles or for nothing", () => {
    expect(getUserScopes({ sub: "u1" })).toEqual([]);
    expect(getUserScopes(null)).toEqual([]);
    expect(getUserScopes(undefined)).toEqual([]);
  });
});

describe("scope checks", () => {
  it("matches exact scopes", () => {
    expect(hasUserScope(user, "users_get")).toBe(true);
    expect(hasUserScope(user, "users")).toBe(false);
    expect(hasAnyUserScope(user, ["x", "tests_patch"])).toBe(true);
  });

  it("counts a narrower scope under a permission", () => {
    expect(hasScopedUserPermission(user, "users_patch")).toBe(true);
    expect(hasScopedUserPermission(user, "users_post")).toBe(false);
    expect(hasPatchUserPermission(user, "users")).toBe(true);
    expect(hasPatchUserPermission(user, "rates")).toBe(false);
  });

  it("checks one field under a whole scope or its own", () => {
    expect(hasFieldScope(user, "rates_post", "rate_type")).toBe(true);
    expect(hasFieldScope(user, "rates_post", "rate")).toBe(false);
    expect(hasPatchFieldScope(user, "users", "name")).toBe(true);
    expect(hasPatchFieldScope(user, "users", "email")).toBe(false);
    expect(hasPatchFieldScope(user, "tests", "anything")).toBe(true);
  });
});

describe("patch payload scopes", () => {
  it("leaves the concurrency and time-zone fields out", () => {
    expect(getPatchPayloadFields({ name: "A", edited_at: "t", timezone_offset: 7 })).toEqual(["name"]);
  });

  it("names the fields the user cannot patch", () => {
    expect(getMissingPatchFieldScopes(user, "users", { name: "A", email: "e", edited_at: "t" })).toEqual(["email"]);
    expect(getMissingPatchFieldScopes(user, "tests", { title: "T" })).toEqual([]);
  });

  it("throws naming the missing scopes", () => {
    expect(() => assertCanPatchPayload(user, "users", { email: "e" })).toThrow("Missing patch scope(s): users_patch_email");
    expect(() => assertCanPatchPayload(user, "users", { name: "A" })).not.toThrow();
  });
});
