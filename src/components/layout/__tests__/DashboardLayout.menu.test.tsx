import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Layers, Users } from "lucide-react";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Ada Teacher", username: "ada", account_type: "employee" },
    logout: vi.fn(),
  }),
}));

import { I18nProvider } from "@/context/I18nContext";
import DashboardLayout, { type DashboardLayoutProps } from "../DashboardLayout";
import PageHeader from "../PageHeader";

beforeAll(() => {
  Element.prototype.scrollTo ??= () => undefined;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // A desktop window, so the menu opens the drawer rather than the phone sheet.
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
});

/** Renders the shell in menu mode with two ungrouped tabs and one under "More". */
function renderMenu(props: Partial<DashboardLayoutProps> = {}) {
  return render(
    <I18nProvider locale="en">
      <MemoryRouter>
        <DashboardLayout
          navMode="menu"
          home={{ id: "home", label: "Dashboard" }}
          navItems={[
            { id: "people", label: "People", icon: Users },
            { id: "groups", label: "Groups", icon: Layers, group: "More" },
          ]}
          activeTab="people"
          onTabSelect={() => {}}
          brand={{ subtitle: "LMS" }}
          menuButtonAttributes={{ "data-tour": "header-menu" }}
          {...props}
        >
          <PageHeader title="People" back={[{ label: "Groups" }]} />
        </DashboardLayout>
      </MemoryRouter>
    </I18nProvider>,
  );
}

describe("DashboardLayout menu mode", () => {
  it("draws no sidebar and no bottom bar, only the menu button", () => {
    const { container } = renderMenu();
    expect(container.querySelector("aside")).toBeNull();
    expect(screen.queryByRole("button", { name: "People" })).toBeNull();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("data-tour", "header-menu");
  });

  it("starts every other page's back trail at home, and not home's own", async () => {
    const onTabSelect = vi.fn();
    const user = userEvent.setup();
    const { unmount } = renderMenu({ onTabSelect });
    await user.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(onTabSelect).toHaveBeenCalledWith("home");
    unmount();

    renderMenu({ activeTab: "home" });
    expect(screen.queryByRole("button", { name: "Dashboard" })).toBeNull();
  });

  it("opens the nav in a drawer, with a heading for each group", async () => {
    const onTabSelect = vi.fn();
    const user = userEvent.setup();
    renderMenu({ onTabSelect });
    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByText("More")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Groups" }));
    expect(onTabSelect).toHaveBeenCalledWith("groups");
  });

  it("draws pinned items in their own list after the others", async () => {
    const user = userEvent.setup();
    renderMenu({
      navItems: [
        { id: "people", label: "People", icon: Users },
        { id: "groups", label: "Groups", icon: Layers, group: "More", pinned: true },
      ],
    });
    await user.click(screen.getByRole("button", { name: "Menu" }));

    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2);
    expect(navs[0]).toHaveTextContent("People");
    expect(navs[1]).toHaveTextContent("More");
    expect(navs[1]).toHaveTextContent("Groups");
  });
});
