import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/context/I18nContext";
import type { FormSchema } from "../schema";
import { SchemaFormDialog } from "../SchemaFormDialog";
import { useSchemaForm } from "../useSchemaForm";

const SCHEMA: FormSchema = {
    sections: [{ id: "work", title: "Work" }, { id: "review", tab: "Review" }],
    fields: [
        {
            name: "work_items",
            label: "Classes",
            type: "list",
            section: "work",
            required: true,
            columns: [
                { name: "class_name", label: "Class", type: "text", required: true },
                { name: "sessions", label: "Sessions", type: "number", required: true },
                { name: "unit_price", label: "Rate", type: "money", required: true },
                { name: "amount", label: "Amount", type: "formula", expr: "sessions * unit_price", format: "money" },
            ],
            totals: [{ column: "amount", into: "total_amount" }],
        },
        {
            name: "conclusion",
            label: "Conclusion",
            type: "choice",
            section: "review",
            required: true,
            options: [{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }],
        },
        { name: "remarks", label: "Remarks", type: "text", section: "review", showIf: "conclusion == 'fail'", required: true },
    ],
};

/** The dialog as an app mounts it: the hook in the component, the schema stable. */
function Harness({ onSubmit }: { onSubmit: (values: unknown) => void }) {
    const form = useSchemaForm(SCHEMA);
    return (
        <SchemaFormDialog
            open
            title="Send"
            form={form}
            outputMode="print"
            submitLabel="Send"
            extraTabs={[{ label: "Signers", content: <p>Signer rows</p> }]}
            onClose={() => undefined}
            onSubmit={onSubmit}
        />
    );
}

describe("SchemaFormDialog", () => {
    it("lists what is missing, then sends the printed values once complete", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(
            <I18nProvider>
                <Harness onSubmit={onSubmit} />
            </I18nProvider>,
        );

        // One tab per section tab, then the extra one.
        for (const label of ["Details", "Review", "Signers"]) {
            expect(screen.getByRole("button", { name: new RegExp(`^${label}`) })).toBeTruthy();
        }

        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/Still needed: Classes \(1: Class\), Classes \(1: Sessions\), Classes \(1: Rate\), Conclusion\./)).toBeTruthy();

        await user.type(screen.getAllByLabelText("Classes 1 Class")[0], "IELTS");
        await user.type(screen.getAllByLabelText("Classes 1 Sessions")[0], "8");
        await user.type(screen.getAllByLabelText("Classes 1 Rate")[0], "150000");
        expect(screen.getAllByLabelText("Classes 1 Amount")[0].textContent).toBe("1.200.000");
        expect(screen.getAllByLabelText("Classes 1 Rate")[0]).toHaveProperty("value", "150.000");

        await user.click(screen.getByRole("button", { name: /^Review/ }));
        await user.click(screen.getByRole("radio", { name: "Fail" }));
        // Remarks appear only for a fail, and are then required.
        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getByText("Still needed: Remarks.")).toBeTruthy();
        await user.type(screen.getByLabelText("Remarks"), "Late twice");
        await user.click(screen.getByRole("button", { name: "Send" }));

        expect(onSubmit).toHaveBeenCalledWith({
            work_items: [{ class_name: "IELTS", sessions: "8", unit_price: "150.000", amount: "1.200.000" }],
            total_amount: "1.200.000",
            conclusion: "fail",
            remarks: "Late twice",
        });
    });
});
