import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState, type ReactNode } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import GlobalPendingChangesBar from "@/components/GlobalPendingChangesBar";
import { definePendingBarAction } from "@/components/PendingChangesBar";
import { I18nProvider } from "@/context/I18nContext";
import {
  PendingChangesProvider,
  usePendingChanges,
  usePendingChangesSource,
  type PendingChangesSource,
  type PendingSectionRegistration,
} from "../PendingChangesContext";

beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

function Host({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <PendingChangesProvider>
        {children}
        <GlobalPendingChangesBar />
      </PendingChangesProvider>
    </I18nProvider>
  );
}

/** A form that registers whatever source it is given. */
function Source({ source }: { source: PendingChangesSource | null }) {
  usePendingChangesSource(source);
  return null;
}

/** A form holding one text edit until saved or discarded, like a Leap settings card. */
function EditForm({
  section,
  label,
  onSaved,
  fail,
  blocked,
}: {
  section?: string;
  label: string;
  onSaved?: (label: string) => void;
  fail?: boolean;
  blocked?: string | null;
}) {
  const [value, setValue] = useState("");
  usePendingChangesSource({
    section,
    items: value ? [{ key: label, value }] : [],
    save: async () => {
      if (fail) throw new Error("save failed");
      onSaved?.(label);
      setValue("");
    },
    discard: () => setValue(""),
    blocked,
  });
  return (
    <label>
      {label}
      <input aria-label={label} value={value} onChange={(event) => setValue(event.target.value)} />
    </label>
  );
}

/** Exposes the context to a test through a callback on every render. */
function Probe({ onValue }: { onValue: (value: ReturnType<typeof usePendingChanges>) => void }) {
  onValue(usePendingChanges());
  return null;
}

const bar = () => document.querySelector<HTMLElement>("[data-pending-bar]")!;

describe("usePendingChangesSource (Leap's provider behaviour)", () => {
  it("shows nothing until a form has items, and hides when they go", async () => {
    render(
      <Host>
        <EditForm label="Title" />
      </Host>,
    );
    expect(bar()).toHaveAttribute("data-pending-bar", "closed");
    await userEvent.type(screen.getByLabelText("Title"), "x");
    expect(bar()).toHaveAttribute("data-pending-bar", "open");
    expect(within(bar()).getByText("1 unsaved change")).toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText("Title"));
    expect(bar()).toHaveAttribute("data-pending-bar", "closed");
  });

  it("totals the forms and groups Review rows by section", async () => {
    render(
      <Host>
        <EditForm section="Delivery" label="Time limit" />
        <EditForm section="Marks" label="Essay 1" />
      </Host>,
    );
    await userEvent.type(screen.getByLabelText("Time limit"), "30");
    await userEvent.type(screen.getByLabelText("Essay 1"), "7");
    expect(within(bar()).getByText("2 unsaved changes")).toBeInTheDocument();
    await userEvent.click(within(bar()).getByRole("button", { name: /Review/ }));
    expect(within(bar()).getByText("Delivery")).toBeInTheDocument();
    expect(within(bar()).getByText("Marks")).toBeInTheDocument();
  });

  it("drops a source when its form unmounts", async () => {
    function Toggle() {
      const [shown, setShown] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setShown(false)}>Close form</button>
          {shown ? <Source source={{ items: [{ key: "Name", value: "Ann" }], save: () => undefined }} /> : null}
        </>
      );
    }
    render(
      <Host>
        <Toggle />
      </Host>,
    );
    expect(bar()).toHaveAttribute("data-pending-bar", "open");
    await userEvent.click(screen.getByRole("button", { name: "Close form" }));
    expect(bar()).toHaveAttribute("data-pending-bar", "closed");
  });

  it("uses a lone source's labels and the defaults for several", async () => {
    render(
      <Host>
        <Source source={{ items: [{ key: "A", value: "1" }], save: () => undefined, saveLabel: "Save Marks" }} />
      </Host>,
    );
    expect(within(bar()).getByRole("button", { name: "Save Marks" })).toBeInTheDocument();
  });

  it("throws without a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Source source={null} />)).toThrow(/PendingChangesProvider/);
    vi.mocked(console.error).mockRestore();
  });

  it("re-registers without a render loop when the form also reads the context", async () => {
    let renders = 0;
    function Reader() {
      const { pendingCount } = usePendingChanges();
      renders += 1;
      // A fresh object and fresh closures every render, as a form passes them.
      usePendingChangesSource({ items: [{ key: "Count", value: String(pendingCount) }], save: () => undefined });
      return null;
    }
    render(
      <Host>
        <Reader />
      </Host>,
    );
    await waitFor(() => expect(within(bar()).getByText("1 unsaved change")).toBeInTheDocument());
    expect(renders).toBeLessThan(10);
  });
});

describe("per-form keys", () => {
  it("keeps two forms in one section apart and counts both on the section", async () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    const saved: string[] = [];
    render(
      <Host>
        <EditForm section="Details" label="Name" onSaved={(label) => saved.push(label)} />
        <EditForm section="Details" label="Email" onSaved={(label) => saved.push(label)} />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    await userEvent.type(screen.getByLabelText("Name"), "a");
    await userEvent.type(screen.getByLabelText("Email"), "b");
    expect(within(bar()).getByText("2 unsaved changes")).toBeInTheDocument();
    expect(value?.sectionPendingCounts.Details).toBe(2);
    await userEvent.click(within(bar()).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(bar()).toHaveAttribute("data-pending-bar", "closed"));
    expect(saved).toEqual(["Name", "Email"]);
  });

  it("shows how registerSection collides, which sources avoid", () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    function Legacy({ registration }: { registration: PendingSectionRegistration }) {
      const { registerSection } = usePendingChanges();
      useEffect(() => registerSection("Details", registration), [registerSection, registration]);
      return null;
    }
    const first = { count: 1, items: [{ key: "Name", value: "a" }] };
    const second = { count: 1, items: [{ key: "Email", value: "b" }] };
    render(
      <Host>
        <Legacy registration={first} />
        <Legacy registration={second} />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    // Same section name, so the second registration replaced the first.
    expect(value?.globalPendingItems).toEqual([{ section: "Details", key: "Email", value: "b" }]);
  });
});

describe("Save all", () => {
  it("saves each form in order and keeps a failed one on the bar", async () => {
    const saved: string[] = [];
    render(
      <Host>
        <EditForm label="One" onSaved={(label) => saved.push(label)} />
        <EditForm label="Two" fail />
        <EditForm label="Three" onSaved={(label) => saved.push(label)} />
      </Host>,
    );
    for (const label of ["One", "Two", "Three"]) {
      await userEvent.type(screen.getByLabelText(label), "x");
    }
    await userEvent.click(within(bar()).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(within(bar()).getByText("1 unsaved change")).toBeInTheDocument());
    expect(saved).toEqual(["One", "Three"]);
    expect(screen.getByLabelText("Two")).toHaveValue("x");
  });

  it("resolves saveAll false after a failure and shows saving while it runs", async () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    let release: () => void = () => undefined;
    const slow = new Promise<void>((resolve) => (release = resolve));
    render(
      <Host>
        <Source source={{ items: [{ key: "A", value: "1" }], save: () => slow }} />
        <Source source={{ items: [{ key: "B", value: "2" }], save: () => Promise.reject(new Error("no")) }} />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    let result: Promise<boolean> | undefined;
    act(() => {
      result = value!.saveAll();
    });
    await waitFor(() => expect(value?.saving).toBe(true));
    await act(async () => release());
    await expect(result).resolves.toBe(false);
    expect(value?.saving).toBe(false);
  });

  it("discards every form", async () => {
    render(
      <Host>
        <EditForm label="One" />
        <EditForm label="Two" />
      </Host>,
    );
    await userEvent.type(screen.getByLabelText("One"), "x");
    await userEvent.type(screen.getByLabelText("Two"), "y");
    await userEvent.click(within(bar()).getByRole("button", { name: "Cancel" }));
    expect(screen.getByLabelText("One")).toHaveValue("");
    expect(screen.getByLabelText("Two")).toHaveValue("");
  });
});

describe("blocked", () => {
  it("shows the reason on Save, saves nothing, and still discards", async () => {
    const saved: string[] = [];
    render(
      <Host>
        <EditForm label="Mark" blocked="Mark is over the maximum" onSaved={(label) => saved.push(label)} />
        <EditForm label="Note" onSaved={(label) => saved.push(label)} />
      </Host>,
    );
    await userEvent.type(screen.getByLabelText("Mark"), "12");
    await userEvent.type(screen.getByLabelText("Note"), "ok");
    expect(within(bar()).queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(within(bar()).getByRole("button", { name: "Save changes" }));
    expect(within(bar()).getByRole("alert")).toHaveTextContent("Mark is over the maximum");
    expect(saved).toEqual([]);
    await userEvent.click(within(bar()).getByRole("button", { name: "Cancel" }));
    expect(screen.getByLabelText("Mark")).toHaveValue("");
  });

  it("resolves saveAll false without calling a save", async () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    const save = vi.fn();
    render(
      <Host>
        <Source source={{ items: [{ key: "A", value: "1" }], save, blocked: "Not yet" }} />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    expect(value?.blocked).toBe("Not yet");
    await act(async () => expect(await value!.saveAll()).toBe(false));
    expect(save).not.toHaveBeenCalled();
  });
});

describe("selection actions mode", () => {
  function Selection({ ids, onDelete }: { ids: string[]; onDelete: (ids: string[]) => void }) {
    usePendingChangesSource({
      items: ids.map((id) => ({ key: id, value: "Selected" })),
      countLabel: `${ids.length} people selected`,
      discard: () => undefined,
      actions: [
        definePendingBarAction({
          id: "delete",
          label: "Delete",
          variant: "destructive",
          // A fresh closure each render; the bar must run the latest one.
          onRun: () => onDelete(ids),
        }),
      ],
    });
    return null;
  }

  it("shows the actions with Clear Selection when nothing is unsaved", async () => {
    const onDelete = vi.fn();
    render(
      <Host>
        <Selection ids={["ann", "bao"]} onDelete={onDelete} />
      </Host>,
    );
    expect(within(bar()).getByText("2 people selected")).toBeInTheDocument();
    expect(within(bar()).getByRole("button", { name: "Clear Selection" })).toBeInTheDocument();
    expect(within(bar()).queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
    await userEvent.click(within(bar()).getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(["ann", "bao"]);
  });

  it("gives the bar to edits while any form has them", async () => {
    render(
      <Host>
        <Selection ids={["ann"]} onDelete={() => undefined} />
        <EditForm label="Name" />
      </Host>,
    );
    expect(within(bar()).getByText("1 people selected")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Name"), "x");
    expect(within(bar()).queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    expect(within(bar()).getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText("Name"));
    expect(within(bar()).getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("leaves a selection out of the section counts", () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    render(
      <Host>
        <Source
          source={{
            section: "People",
            items: [{ key: "ann", value: "Selected" }],
            actions: [definePendingBarAction({ id: "x", label: "X", onRun: () => undefined })],
          }}
        />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    expect(value?.mode).toBe("selection");
    expect(value?.sectionPendingCounts.People).toBeUndefined();
  });
});

describe("registerSection (unchanged)", () => {
  it("keeps the section fields and puts the section on the merged bar", async () => {
    let value: ReturnType<typeof usePendingChanges> | undefined;
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const registration: PendingSectionRegistration = {
      count: 2,
      items: [{ key: "Rate", value: "100" }],
      onSave,
      onCancel,
      keyLabel: "Field",
    };
    function Legacy() {
      const { registerSection, unregisterSection } = usePendingChanges();
      useEffect(() => {
        registerSection("Rates", registration);
        return () => unregisterSection("Rates");
      }, [registerSection, unregisterSection]);
      return null;
    }
    render(
      <Host>
        <Legacy />
        <Source source={{ section: "Notes", items: [{ key: "Note", value: "hi" }], save: () => undefined }} />
        <Probe onValue={(next) => (value = next)} />
      </Host>,
    );
    expect(value?.globalPendingCount).toBe(2);
    expect(value?.globalPendingItems).toEqual([{ section: "Rates", key: "Rate", value: "100" }]);
    expect(value?.activeSection).toBe("Rates");
    expect(value?.activeSectionKeyLabel).toBe("Field");
    expect(value?.sectionPendingCounts).toEqual({ Rates: 2, Notes: 1 });
    expect(value?.pendingCount).toBe(3);
    await act(async () => {
      await value!.handleSaveActiveSection();
    });
    expect(onSave).toHaveBeenCalledTimes(1);
    await userEvent.click(within(bar()).getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledTimes(2);
    await userEvent.click(within(bar()).getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
