import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Ada Teacher", username: "ada", account_type: "employee" },
    logout: vi.fn(),
  }),
}));

import { I18nProvider } from "@/context/I18nContext";
import DashboardLayout, { type DashboardLayoutProps } from "../DashboardLayout";

// jsdom lacks the scroll and pointer-capture APIs the layout and Radix call on mount and click.
beforeAll(() => {
  Element.prototype.scrollTo ??= () => undefined;
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

const NAV = [
  { id: "home", label: "Home" },
  { id: "people", label: "People" },
];

/** Renders the shell at /people with the given report config. */
function renderLayout(props: Partial<DashboardLayoutProps> = {}) {
  return render(
    <I18nProvider locale="en">
      <MemoryRouter initialEntries={["/people"]}>
        <DashboardLayout navItems={NAV} activeTab="home" onTabSelect={() => {}} {...props}>
          <p>page</p>
        </DashboardLayout>
      </MemoryRouter>
    </I18nProvider>,
  );
}

describe("DashboardLayout reportProblem", () => {
  it("puts a ghost icon button in the desktop header that opens the form with the app and path", async () => {
    const user = userEvent.setup();
    renderLayout({ reportProblem: { app: "erp-hrm" } });

    const button = screen.getByRole("button", { name: "Report a problem" });
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-size", "icon-sm");
    expect(button.querySelector("svg.lucide-message-circle-warning")).not.toBeNull();

    await user.click(button);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Reported from erp-hrm · /people")).toBeInTheDocument();
    expect(within(dialog).getByRole("combobox", { name: "Area" })).toHaveTextContent("Process");
  });

  it("draws a full-width entry in the phone menu even when the app overrides mobileMenu", async () => {
    const user = userEvent.setup();
    renderLayout({ reportProblem: { app: "lms" }, mobileMenu: <p>app menu</p> });

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByText("app menu")).toBeInTheDocument();
    const entry = within(sheet).getByRole("button", { name: "Report a problem" });
    expect(entry).toHaveAttribute("data-variant", "outline");
    expect(entry.className).toContain("w-full");
    expect(entry.className).toContain("min-h-11");

    await user.click(entry);
    const form = await screen.findByRole("dialog");
    expect(within(form).getByText("Reported from lms · /people")).toBeInTheDocument();
    expect(within(form).getByRole("combobox", { name: "Area" })).toHaveTextContent("LMS");
  });

  it("draws no entry point when the app does not enable it", async () => {
    const user = userEvent.setup();
    const { unmount } = renderLayout({ reportProblem: { app: "lms", enabled: false } });
    expect(screen.queryByRole("button", { name: "Report a problem" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "Report a problem" })).not.toBeInTheDocument();
    unmount();

    renderLayout();
    expect(screen.queryByRole("button", { name: "Report a problem" })).not.toBeInTheDocument();
  });

  it("never draws a floating launcher", () => {
    renderLayout({ reportProblem: { app: "lms" } });
    expect(screen.getAllByRole("button", { name: "Report a problem" })).toHaveLength(1);
    expect(document.querySelector(".animate-pulse")).toBeNull();
  });
});

describe("DashboardLayout phone bottom bar", () => {
  it("keeps four tabs and moves the rest into the Menu sheet, so Menu stays on screen", async () => {
    const user = userEvent.setup();
    const many = ["One", "Two", "Three", "Four", "Five", "Six"].map((label) => ({
      id: label.toLowerCase(),
      label,
    }));
    renderLayout({ navItems: many });

    // The side nav draws every tab once; the bar adds the first four.
    expect(screen.getAllByRole("button", { name: "Four" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Five" })).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByRole("button", { name: "Five" })).toBeInTheDocument();
    expect(within(sheet).getByRole("button", { name: "Six" })).toBeInTheDocument();
    expect(within(sheet).queryByRole("button", { name: "Four" })).toBeNull();
  });
});
