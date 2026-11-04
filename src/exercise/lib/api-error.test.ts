import { describe, expect, it } from "vitest";

import { ApiError } from "../../api_calls/apiErrors";
import { errorDetail, errorStatus } from "./api-error";

class AppError extends Error {
  constructor(
    readonly status: number,
    readonly detail?: string,
  ) {
    super("app error");
  }
}

describe("errorStatus / errorDetail", () => {
  it("reads the template's ApiError", () => {
    const err = new ApiError({ context: "x", status: 409, statusText: "Conflict", url: "/x", detail: "Already played" });
    expect(errorStatus(err)).toBe(409);
    expect(errorDetail(err)).toBe("Already played");
  });

  it("reads an app's own error class", () => {
    expect(errorStatus(new AppError(409))).toBe(409);
    expect(errorDetail(new AppError(500, "Down"))).toBe("Down");
    expect(errorDetail(new AppError(500, ""))).toBeNull();
  });

  it("is null for anything that is not an API error", () => {
    expect(errorStatus(new Error("plain"))).toBeNull();
    expect(errorStatus("409")).toBeNull();
    expect(errorDetail(null)).toBeNull();
  });
});
