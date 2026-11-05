import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SimpleDataTable, { groupTableRows, type SimpleDataTableColumn } from "../SimpleDataTable";
import { I18nProvider } from "@/context/I18nContext";

type Row = { key: string };

const plain = (id: string): SimpleDataTableColumn<Row> => ({ id, header: id, render: (row) => `${id}-${row.key}` });

/** Renders a one-row table of the given columns. */
function renderTable(columns: SimpleDataTableColumn<Row>[]) {
    render(
        <I18nProvider>
            <SimpleDataTable
                columns={columns}
                rows={[{ key: "a" }]}
                rowKey={(row) => row.key}
                page={0}
                pageSize={10}
                onPageChange={() => undefined}
                onPageSizeChange={() => undefined}
            />
        </I18nProvider>,
    );
}

describe("SimpleDataTable header groups", () => {
    it("keeps one header row without groups", () => {
        renderTable([plain("a"), plain("b")]);
        expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(2);
    });

    it("merges neighbouring columns of a group and spans the others over both rows", () => {
        const group = { id: "s1", header: "Session 1" };
        renderTable([plain("name"), { ...plain("attendance"), group }, { ...plain("cam"), group }, plain("report")]);
        const [top, second] = within(screen.getByRole("table")).getAllByRole("row");
        expect(within(top).getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
            "name",
            "Session 1",
            "report",
        ]);
        expect(screen.getByText("Session 1")).toHaveAttribute("colspan", "2");
        expect(screen.getByText("name")).toHaveAttribute("rowspan", "2");
        expect(within(second).getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
            "attendance",
            "cam",
        ]);
    });

    it("gives separate groups separate cells even with the same header", () => {
        renderTable([
            { ...plain("a"), group: { id: "s1", header: "Same" } },
            { ...plain("b"), group: { id: "s2", header: "Same" } },
        ]);
        expect(screen.getAllByText("Same")).toHaveLength(2);
    });
});

describe("SimpleDataTable pinned columns", () => {
    it("pins the header and the cells at the given offset", () => {
        renderTable([{ ...plain("name"), stickyLeft: 40 }, plain("other")]);
        expect(screen.getByText("name")).toHaveStyle({ left: "40px" });
        expect(screen.getByText("name-a")).toHaveStyle({ left: "40px" });
        expect(screen.getByText("other-a").style.left).toBe("");
    });
});

describe("groupTableRows", () => {
    const rows = [
        { key: "1", topic: "b" },
        { key: "2", topic: "a" },
        { key: "3", topic: "b" },
    ];

    it("keeps first-appearance order without a compare", () => {
        const groups = groupTableRows(rows, (row) => row.topic);
        expect(groups.map((group) => [group.key, group.rows.map((row) => row.key)])).toEqual([
            ["b", ["1", "3"]],
            ["a", ["2"]],
        ]);
    });

    it("orders the groups by compare", () => {
        const groups = groupTableRows(rows, (row) => row.topic, (a, b) => a.localeCompare(b));
        expect(groups.map((group) => group.key)).toEqual(["a", "b"]);
    });
});

describe("SimpleDataTable row groups", () => {
    it("draws a header row spanning every column above each group", () => {
        render(
            <I18nProvider>
                <SimpleDataTable
                    columns={[plain("a"), plain("b")]}
                    rows={[{ key: "x" }, { key: "y" }, { key: "z" }]}
                    rowKey={(row) => row.key}
                    rowGroups={{ key: (row) => (row.key === "y" ? "second" : "first"), header: (key, members) => `${key} (${members.length})` }}
                    page={0}
                    pageSize={10}
                    onPageChange={() => undefined}
                    onPageSizeChange={() => undefined}
                />
            </I18nProvider>,
        );
        const bodyRows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
        expect(bodyRows.map((row) => row.textContent)).toEqual(["first (2)", "a-xb-x", "a-zb-z", "second (1)", "a-yb-y"]);
        expect(screen.getByText("first (2)")).toHaveAttribute("colspan", "2");
    });
});
