import { describe, expect, it } from "vitest";

import { ApiError, NetworkError, errorMessage, toApiError } from "../apiErrors";

describe("errorMessage", () => {
  it("shows the server's explanation for an ApiError", async () => {
    const error = await toApiError(
      new Response(JSON.stringify({ detail: "test is already published" }), { status: 409, statusText: "Conflict" }),
      "Failed to save test",
    );
    expect(errorMessage(error, "Could not save")).toBe("test is already published");
  });

  it("falls back to the status line for an ApiError with no detail", () => {
    const error = new ApiError({ context: "Failed to save test", status: 500, statusText: "Internal Server Error", url: "", detail: null });
    expect(errorMessage(error, "Could not save")).toBe("Failed to save test: 500 Internal Server Error");
  });

  it("shows a NetworkError's or another Error's message", () => {
    const network = new NetworkError({ url: "https://api.test/v2/tests", method: "GET", elapsedMs: 3, online: false, cause: new TypeError("Failed to fetch") });
    expect(errorMessage(network, "x")).toContain("this device is offline");
    expect(errorMessage(new Error("boom"), "x")).toBe("boom");
  });

  it("uses the fallback for an empty message and for anything that is not an error", () => {
    expect(errorMessage(new Error(""), "Could not save")).toBe("Could not save");
    expect(errorMessage({ status: 500 }, "Could not save")).toBe("Could not save");
    expect(errorMessage(undefined, "Could not save")).toBe("Could not save");
    expect(errorMessage("  nope ", "Could not save")).toBe("nope");
  });
});
