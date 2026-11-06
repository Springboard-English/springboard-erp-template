import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Compass, Home, Users } from "lucide-react";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Ada Teacher", username: "ada", account_type: "employee" },
    logout: vi.fn(),
  }),
}));

import { I18nProvider } from "@/context/I18nContext";
import DashboardLayout, { type DashboardLayoutProps } from "../DashboardLayout";

// jsdom lacks the scroll APIs the layout calls on mount.
beforeAll(() => {
  Element.prototype.scrollTo ??= () => undefined;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

/** Renders the shell with a two-tab nav, a brand and an account panel. */
function renderLayout(props: Partial<DashboardLayoutProps> = {}) {
  return render(
    <I18nProvider locale="en">
      <MemoryRouter>
        <DashboardLayout
          navItems={[
            { id: "home", label: "Home", icon: Home },
            { id: "people", label: "People", icon: Users, dataAttributes: { "data-tour": "nav-people" } },
          ]}
          activeTab="home"
          onTabSelect={() => {}}
          brand={{ subtitle: "HRM" }}
          account={{
            manageAccount: false,
            actions: [{ id: "tour", label: "Take the tour", icon: Compass, onClick: () => {} }],
          }}
          {...props}
        >
          <p>page</p>
        </DashboardLayout>
      </MemoryRouter>
    </I18nProvider>,
  );
}

/** The side nav's tab of that name (the bottom bar draws a second one). */
function sideTab(name: string) {
  return screen.getAllByRole("button", { name }).find((button) => button.closest("aside"))!;
}

describe("DashboardLayout sidebar rows", () => {
  it("keeps every row in the same two columns collapsed and expanded", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    renderLayout({ defaultCollapsed: true });

    const collapsedClasses = sideTab("People").className;
    const logoutClasses = sideTab("Logout").className;
    expect(collapsedClasses).toContain("grid-cols-[3rem_minmax(0,1fr)]");
    expect(logoutClasses).toContain("grid-cols-[3rem_minmax(0,1fr)]");
    // Still the tab's name while faded, so it needs no aria-label of its own.
    expect(sideTab("People")).not.toHaveAttribute("aria-label");

    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));

    expect(sideTab("People").className).toBe(collapsedClasses);
    expect(sideTab("Logout").className).toBe(logoutClasses);
  });

  it("draws the app's values: sized icons, tour anchors, brand and account actions", () => {
    renderLayout();

    expect(sideTab("People")).toHaveAttribute("data-tour", "nav-people");
    expect(sideTab("People").querySelector("svg")).toHaveClass("size-5");
    expect(screen.getByText("Springboard English")).toBeInTheDocument();
    expect(screen.getByText("HRM")).toBeInTheDocument();
    expect(sideTab("Take the tour")).toBeInTheDocument();
  });
});
