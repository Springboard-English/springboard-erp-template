import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/context/I18nContext";

import { RecordLink } from "../RecordLink";
import { optionFilterPreset, presetPersistedFilters } from "../../utils/viewFilterState";

/** Renders inside the template's i18n provider, which fills "{name}". */
function renderWithI18n(ui: ReactElement) {
    return render(<I18nProvider>{ui}</I18nProvider>);
}

describe("RecordLink", () => {
    it("links an in-app route after the name", () => {
        renderWithI18n(
            <MemoryRouter>
                <RecordLink label="Nguyễn Văn A" to="/sessions" />
            </MemoryRouter>,
        );
        const link = screen.getByRole("link", { name: "Open Nguyễn Văn A" });
        expect(link.getAttribute("href")).toBe("/sessions");
        expect(link.getAttribute("target")).toBeNull();
    });

    it("opens another app's URL in a new tab", () => {
        renderWithI18n(<RecordLink label="Student" href="https://erp.example/crm/students/1" />);
        const link = screen.getByRole("link", { name: "Open Student" });
        expect(link.getAttribute("target")).toBe("_blank");
    });

    it("runs the handler without opening the row it sits in", () => {
        const onOpen = vi.fn();
        const onRow = vi.fn();
        renderWithI18n(
            <div onClick={onRow}>
                <RecordLink label="Class" name="NEC 54" onOpen={onOpen} />
            </div>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Open NEC 54" }));
        expect(onOpen).toHaveBeenCalledOnce();
        expect(onRow).not.toHaveBeenCalled();
    });

    it("shows only the text without a target or a name", () => {
        const { container } = renderWithI18n(<RecordLink label="" to="/x" />);
        expect(container.textContent).toBe("-");
        expect(screen.queryByRole("link")).toBeNull();
    });
});

describe("presetPersistedFilters", () => {
    it("replaces the scope with the preset option filter", () => {
        sessionStorage.setItem("view_filters:list", JSON.stringify({ class: "old" }));
        presetPersistedFilters("list", {
            ...optionFilterPreset("mentor_d", { value: "k1", label: "Huyền" }),
            mentor: "k1",
        });
        expect(JSON.parse(sessionStorage.getItem("view_filters:list") ?? "{}")).toEqual({
            mentor_d: "k1",
            mentor_d__label: "Huyền",
            mentor: "k1",
        });
    });
});
