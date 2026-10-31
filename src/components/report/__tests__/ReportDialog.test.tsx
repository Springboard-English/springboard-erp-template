import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { submitReportMock } = vi.hoisted(() => ({ submitReportMock: vi.fn() }));

vi.mock("../submitReport", () => ({ submitReport: submitReportMock }));

import { I18nProvider } from "@/context/I18nContext";
import ReportDialog, { isAcceptedReportAttachment, type ReportDialogProps } from "../ReportDialog";

const EN_HELP_BODY =
  "Use this form to report a bug, request a feature, or share other feedback. Screenshot mode lets you navigate to the broken screen and capture it.";

// Radix's popover and select ask for pointer-capture APIs jsdom does not implement.
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

beforeEach(() => submitReportMock.mockReset());

/** Renders an open dialog in the given locale. */
function renderDialog(props: Partial<ReportDialogProps> = {}, locale: "en" | "vi" = "en") {
  return render(
    <I18nProvider locale={locale}>
      <ReportDialog
        open
        onClose={() => {}}
        contextLabel="erp-hrm · /employees"
        evidence={[]}
        onEvidenceChange={() => {}}
        onRequestCapture={() => {}}
        {...props}
      />
    </I18nProvider>,
  );
}

describe("ReportDialog", () => {
  it("files the report and shows its reference and the follow-up notice", async () => {
    const user = userEvent.setup();
    submitReportMock.mockResolvedValueOnce({ id: "7c9e6efe-9e1b-48e3-83e9-b7146883c1d0" });
    renderDialog({ defaultCategory: "content_data", evidence: ["data:image/png;base64,AA=="] });

    expect(screen.getByText("Reported from erp-hrm · /employees")).toBeInTheDocument();
    const send = screen.getByRole("button", { name: "Send report" });
    await user.click(send);
    expect(screen.getByText("Still needed: Summary, Details.")).toBeInTheDocument();
    expect(submitReportMock).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Summary"), "Save fails");
    await user.type(screen.getByLabelText("Details"), "Nothing happens on Save.");
    await user.click(screen.getByRole("radio", { name: "High" }));
    await user.click(send);

    expect(submitReportMock).toHaveBeenCalledWith({
      reportType: "bug",
      summary: "Save fails",
      description: "Nothing happens on Save.",
      category: "content_data",
      priority: "high",
      contextLabel: "erp-hrm · /employees",
      evidence: ["data:image/png;base64,AA=="],
    });
    expect(await screen.findByText("Report Sent")).toBeInTheDocument();
    expect(screen.getByText("#6883c1d0")).toBeInTheDocument();
    expect(
      screen.getByText("You'll get a notification here with a link to follow the ticket."),
    ).toBeInTheDocument();
  });

  it("keeps the form and shows the error when sending fails", async () => {
    const user = userEvent.setup();
    submitReportMock.mockRejectedValueOnce(new Error("Failed to send the report"));
    renderDialog();

    await user.type(screen.getByLabelText("Summary"), "x");
    await user.type(screen.getByLabelText("Details"), "y");
    await user.click(screen.getByRole("button", { name: "Send report" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Failed to send the report");
    expect(screen.getByLabelText("Summary")).toHaveValue("x");
  });

  it("comes back from screenshot mode on the screenshots tab, keeping what was typed", async () => {
    const user = userEvent.setup();
    const onRequestCapture = vi.fn();
    const props: ReportDialogProps = {
      open: true,
      onClose: () => {},
      contextLabel: "lms · /",
      evidence: [],
      onEvidenceChange: () => {},
      onRequestCapture,
    };
    const tree = (open: boolean) => (
      <I18nProvider locale="en">
        <ReportDialog {...props} open={open} />
      </I18nProvider>
    );
    const { rerender } = render(tree(true));

    await user.type(screen.getByLabelText("Summary"), "Broken");
    await user.click(screen.getByRole("button", { name: "Screenshots and attachments" }));
    await user.click(screen.getByRole("button", { name: "Screenshot mode" }));
    expect(onRequestCapture).toHaveBeenCalledOnce();

    rerender(tree(false));
    rerender(tree(true));
    expect(screen.getByRole("button", { name: "Screenshot mode" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByLabelText("Summary")).toHaveValue("Broken");
  });

  it("reveals the help text and hides it on a second click", async () => {
    const user = userEvent.setup();
    renderDialog();

    const trigger = screen.getByRole("button", { name: "About this form" });
    await user.click(trigger);
    expect(await screen.findByText(EN_HELP_BODY)).toBeInTheDocument();
    await user.click(trigger);
    await waitFor(() => expect(screen.queryByText(EN_HELP_BODY)).not.toBeInTheDocument());
  });

  it("speaks Vietnamese in the vi locale", () => {
    renderDialog({}, "vi");
    expect(screen.getByRole("button", { name: "Giới thiệu biểu mẫu này" })).toBeInTheDocument();
    expect(screen.getByText("Báo cáo từ erp-hrm · /employees")).toBeInTheDocument();
  });
});

describe("isAcceptedReportAttachment", () => {
  it("takes PNG and JPEG up to 10 MB only", () => {
    expect(isAcceptedReportAttachment({ type: "image/png", size: 1024 })).toBe(true);
    expect(isAcceptedReportAttachment({ type: "image/jpeg", size: 10 * 1024 * 1024 })).toBe(true);
    expect(isAcceptedReportAttachment({ type: "image/jpeg", size: 10 * 1024 * 1024 + 1 })).toBe(false);
    expect(isAcceptedReportAttachment({ type: "image/gif", size: 1024 })).toBe(false);
    expect(isAcceptedReportAttachment({ type: "image/png", size: 0 })).toBe(false);
  });
});
