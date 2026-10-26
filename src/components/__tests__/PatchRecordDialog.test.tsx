import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PatchRecordDialog, { type PatchFieldConfig } from "../PatchRecordDialog";
import { I18nProvider } from "@/context/I18nContext";
import type { SearchableSelectLoadParams } from "@/components/ui/searchable-select";

// Radix's popover asks the trigger for pointer-capture APIs jsdom does not
// implement. Without these the menu never opens, and every assertion below
// fails for a reason that has nothing to do with the dialog.
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

const EMPLOYEES = Array.from({ length: 30 }, (_, index) => ({
  value: `emp-${index + 1}`,
  label: `Employee ${index + 1}`,
}));

/** The clear entry, from `patchRecord.placeholder` for a field labelled Employee. */
const CLEAR_ENTRY = "-- Employee --";

/** A loader that pages `EMPLOYEES` the way an inline endpoint would. */
function createLoader() {
  return vi.fn(async ({ query, cursor, pageSize }: SearchableSelectLoadParams) => {
    const matches = query.trim()
      ? EMPLOYEES.filter((option) =>
          option.label.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : EMPLOYEES;
    const start = cursor ? Number(cursor) : 0;
    const next = start + pageSize;
    return {
      options: matches.slice(start, next),
      nextCursor: next < matches.length ? String(next) : null,
    };
  });
}

/**
 * `I18nProvider` is not decoration: the single-brace `{label}` placeholders
 * only interpolate against the instance it creates, so without it every label
 * under test renders as the literal template.
 */
function renderDialog(field: PatchFieldConfig, onSubmit = vi.fn()) {
  render(
    <I18nProvider>
      <PatchRecordDialog
        open
        title="Edit task"
        fields={[field]}
        initialValues={{}}
        onClose={() => undefined}
        onSubmit={onSubmit}
      />
    </I18nProvider>,
  );

  // The field is the combobox's search box as well as its trigger.
  return screen.getByRole("combobox");
}

describe("PatchRecordDialog select fields", () => {
  it("pages a loadOptions field instead of demanding the whole list", async () => {
    const user = userEvent.setup();
    const loadOptions = createLoader();
    const trigger = renderDialog({
      key: "employeeKey",
      label: "Employee",
      type: "select",
      loadOptions,
    });

    await user.click(trigger);

    await waitFor(() => expect(loadOptions).toHaveBeenCalled());
    // The component's default page, not the endpoint's 200-row cap.
    expect(loadOptions.mock.calls[0]?.[0]).toMatchObject({
      cursor: null,
      pageSize: 25,
      query: "",
    });

    expect(await screen.findByRole("option", { name: "Employee 1" })).toBeInTheDocument();
    // Page one stops at 25; the 30th row is behind "Load more".
    expect(screen.queryByRole("option", { name: "Employee 30" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Load more" }));

    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));
    expect(loadOptions.mock.calls[1]?.[0]).toMatchObject({ cursor: "25" });
    expect(await screen.findByRole("option", { name: "Employee 30" })).toBeInTheDocument();
  });

  it("pins the clear entry to the unfiltered first page only", async () => {
    const user = userEvent.setup();
    const loadOptions = createLoader();
    const trigger = renderDialog({
      key: "employeeKey",
      label: "Employee",
      type: "select",
      loadOptions,
    });

    await user.click(trigger);
    // Listed once; the field shows it as its value, not as text.
    await waitFor(() => expect(screen.getAllByText(CLEAR_ENTRY)).toHaveLength(1));

    // A sentinel repeated on page two reads as a result.
    await user.click(screen.getByRole("button", { name: "Load more" }));
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));
    expect(screen.getAllByText(CLEAR_ENTRY)).toHaveLength(1);

    // And it must not survive a search that excludes it.
    await user.type(trigger, "Employee 3");
    await waitFor(() => expect(screen.queryByText(CLEAR_ENTRY)).not.toBeInTheDocument());
  });

  it("keeps the chosen label once the loaded pages are discarded", async () => {
    const user = userEvent.setup();
    const trigger = renderDialog({
      key: "employeeKey",
      label: "Employee",
      type: "select",
      loadOptions: createLoader(),
    });

    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Employee 2" }));

    // The popover is closed and its pages are gone; the field must still not
    // fall back to rendering `emp-2`.
    await waitFor(() => expect(trigger).toHaveValue("Employee 2"));
  });

  it("still takes a static option list for a genuinely finite choice", async () => {
    const user = userEvent.setup();
    const trigger = renderDialog({
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "done", label: "Done" },
      ],
    });

    await user.click(trigger);

    expect(await screen.findAllByRole("option", { name: "Open" })).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
  });

  it("submits the selected key, not the label", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const trigger = renderDialog(
      {
        key: "employeeKey",
        label: "Employee",
        type: "select",
        loadOptions: createLoader(),
      },
      onSubmit,
    );

    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Employee 2" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ employeeKey: "emp-2" }));
  });
});
