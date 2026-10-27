import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PendingChangesBar, { definePendingBarAction } from "../PendingChangesBar";
import SimpleDataTable from "../SimpleDataTable";
import { I18nProvider } from "@/context/I18nContext";

// Radix's menu asks for pointer-capture APIs jsdom does not implement.
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

describe("PendingChangesBar", () => {
  it("keeps the Save path when no actions are given", async () => {
    const onSave = vi.fn();
    render(
      <I18nProvider>
        <PendingChangesBar pendingCount={2} onSave={onSave} onCancel={() => undefined} />
      </I18nProvider>,
    );
    expect(screen.getByText("2 unsaved changes")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("runs a confirmed action with the prepared value", async () => {
    const onRun = vi.fn(async () => undefined);
    const send = definePendingBarAction({
      id: "send",
      label: "Send to parents",
      onRun,
      confirm: {
        title: "Send messages?",
        prepare: async () => ({ recipients: 3, blockers: 0 }),
        description: (prepared) => `${prepared.recipients} parents will get it.`,
        confirmLabel: (prepared) => `Send ${prepared.recipients}`,
        canConfirm: (prepared) => prepared.blockers === 0,
      },
    });
    render(
      <I18nProvider>
        <PendingChangesBar
          pendingCount={3}
          countLabel="3 assessments selected"
          cancelLabel="Clear"
          onCancel={() => undefined}
          actions={[send]}
        />
      </I18nProvider>,
    );
    expect(screen.getByText("3 assessments selected")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Send to parents" }));
    expect(await screen.findByText("3 parents will get it.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Send 3" }));
    expect(onRun).toHaveBeenCalledWith({ recipients: 3, blockers: 0 });
    await waitFor(() => expect(screen.queryByText("Send messages?")).not.toBeInTheDocument());
  });

  it("blocks confirm when canConfirm says no, and retries a failed prepare", async () => {
    const prepare = vi
      .fn<() => Promise<{ blockers: number }>>()
      .mockRejectedValueOnce(new Error("Server unavailable"))
      .mockResolvedValueOnce({ blockers: 2 });
    render(
      <I18nProvider>
        <PendingChangesBar
          pendingCount={1}
          actions={[
            definePendingBarAction({
              id: "send",
              label: "Send",
              onRun: () => undefined,
              confirm: {
                title: "Send?",
                confirmLabel: "Send now",
                prepare,
                canConfirm: (prepared) => prepared.blockers === 0,
              },
            }),
          ]}
        />
      </I18nProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Server unavailable")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Send now" })).toBeDisabled(),
    );
    expect(prepare).toHaveBeenCalledTimes(2);
  });
});

describe("SimpleDataTable selection", () => {
  it("ticks a row and the page from the header", async () => {
    const rows = [{ id: "a" }, { id: "b" }];
    const onChange = vi.fn();
    render(
      <I18nProvider>
        <SimpleDataTable
          columns={[{ id: "id", header: "Id", render: (row) => row.id }]}
          rows={rows}
          rowKey={(row) => row.id}
          page={0}
          pageSize={10}
          onPageChange={() => undefined}
          onPageSizeChange={() => undefined}
          selection={{ selected: [rows[0]], onChange }}
        />
      </I18nProvider>,
    );
    const header = screen.getByRole("checkbox", { name: "Select every row on this page" });
    expect(header).toHaveAttribute("data-state", "indeterminate");
    await userEvent.click(header);
    expect(onChange).toHaveBeenLastCalledWith(rows);
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
