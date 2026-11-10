import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DetailFieldsTable } from "../DetailLayout";

describe("DetailFieldsTable", () => {
    it("names an inline editor after its row's label", () => {
        render(<DetailFieldsTable rows={[{ label: "Phone", value: <input defaultValue="0901" /> }]} />);
        expect(screen.getByRole("textbox", { name: "Phone" })).toBeInTheDocument();
    });

    it("keeps a name the editor already has", () => {
        render(
            <DetailFieldsTable rows={[{ label: "Phone", value: <input aria-label="Parent phone" defaultValue="" /> }]} />,
        );
        expect(screen.getByRole("textbox", { name: "Parent phone" })).toBeInTheDocument();
    });
});
