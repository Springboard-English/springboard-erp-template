import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/context/I18nContext";
import {
  REFRESH_NUDGE_COOLDOWN_MS,
  REFRESH_NUDGE_WINDOW_MS,
  isRefreshNudgeDue,
  recordRefresh,
} from "@/utils/refreshActivity";
import RefreshNudge from "../RefreshNudge";

/** Renders the nudge in English with a spy for its report button. */
function renderNudge(allowed = true) {
  const onReport = vi.fn();
  const view = render(
    <I18nProvider locale="en">
      <RefreshNudge onReport={onReport} allowed={allowed} />
    </I18nProvider>,
  );
  return { onReport, ...view };
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe("isRefreshNudgeDue", () => {
  it("needs three refreshes inside the window", () => {
    recordRefresh(1000);
    recordRefresh(2000);
    expect(isRefreshNudgeDue(3000)).toBe(false);
    recordRefresh(3000);
    expect(isRefreshNudgeDue(3000)).toBe(true);
  });

  it("forgets refreshes older than the window", () => {
    recordRefresh(1000);
    recordRefresh(2000);
    recordRefresh(2000 + REFRESH_NUDGE_WINDOW_MS);
    expect(isRefreshNudgeDue(2000 + REFRESH_NUDGE_WINDOW_MS)).toBe(false);
  });
});

describe("RefreshNudge", () => {
  it("stays away below the threshold", () => {
    recordRefresh();
    renderNudge();
    expect(screen.queryByTestId("refresh-nudge")).not.toBeInTheDocument();
  });

  it("appears on mount when reloads brought it due, and opens the report", async () => {
    const user = userEvent.setup();
    recordRefresh();
    recordRefresh();
    recordRefresh();
    const { onReport } = renderNudge();

    await user.click(screen.getByRole("button", { name: "Report a bug" }));

    expect(onReport).toHaveBeenCalledOnce();
    expect(screen.queryByTestId("refresh-nudge")).not.toBeInTheDocument();
  });

  it("appears on an in-app refresh while mounted", () => {
    recordRefresh();
    recordRefresh();
    renderNudge();
    act(() => recordRefresh());
    expect(screen.getByTestId("refresh-nudge")).toBeInTheDocument();
  });

  it("does not return for a day after being dismissed", async () => {
    const user = userEvent.setup();
    recordRefresh();
    recordRefresh();
    recordRefresh();
    const { unmount } = renderNudge();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    unmount();

    recordRefresh();
    recordRefresh();
    recordRefresh();
    renderNudge();
    expect(screen.queryByTestId("refresh-nudge")).not.toBeInTheDocument();

    const later = Date.now() + REFRESH_NUDGE_COOLDOWN_MS + 1;
    recordRefresh(later);
    recordRefresh(later);
    recordRefresh(later);
    expect(isRefreshNudgeDue(later)).toBe(true);
  });

  it("waits while the report flow is open, and spends no cooldown", () => {
    recordRefresh();
    recordRefresh();
    recordRefresh();
    renderNudge(false);
    expect(screen.queryByTestId("refresh-nudge")).not.toBeInTheDocument();
    expect(isRefreshNudgeDue()).toBe(true);
  });
});
