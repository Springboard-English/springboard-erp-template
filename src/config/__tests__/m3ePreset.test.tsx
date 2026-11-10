import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { configureUIPreset } from "@/config/uiPreset";
import { m3eUIPreset } from "@/config/m3ePreset";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

describe("m3eUIPreset", () => {
    afterEach(() => configureUIPreset({}));

    it("turns the filled button into a pill that tightens on press", () => {
        configureUIPreset(m3eUIPreset);
        render(<Button>Save</Button>);
        const cls = screen.getByRole("button", { name: "Save" }).className.split(" ");
        expect(cls).toContain("rounded-full");
        expect(cls).toContain("active:rounded-md");
        expect(cls).toContain("text-on-primary");
        // The primitive's own corner and transition give way to the preset's.
        expect(cls).not.toContain("rounded-md");
        expect(cls).not.toContain("transition-all");
    });

    it("keeps a caller's className above the preset", () => {
        configureUIPreset(m3eUIPreset);
        render(<Button className="rounded-none">Flat</Button>);
        const cls = screen.getByRole("button", { name: "Flat" }).className.split(" ");
        expect(cls).toContain("rounded-none");
        expect(cls).not.toContain("rounded-full");
    });

    it("keeps the suite's touch floor on every button", () => {
        configureUIPreset(m3eUIPreset);
        render(<Button size="sm">Small</Button>);
        expect(screen.getByRole("button", { name: "Small" }).className).toContain("min-h-11");
    });

    it("draws the M3 checkbox, switch and tabs", () => {
        configureUIPreset(m3eUIPreset);
        render(
            <>
                <Checkbox aria-label="Pick" />
                <Switch aria-label="On" />
                <Tabs defaultValue="a">
                    <TabsList>
                        <TabsTrigger value="a">A</TabsTrigger>
                    </TabsList>
                </Tabs>
            </>,
        );
        const box = screen.getByRole("checkbox", { name: "Pick" }).className.split(" ");
        expect(box).toContain("size-[18px]");
        expect(box).not.toContain("size-[26px]");
        expect(screen.getByRole("switch", { name: "On" }).className).toContain("data-[size=default]:w-13");
        expect(screen.getByRole("tab", { name: "A" }).className).toContain("data-active:bg-secondary-container");
    });

    it("leaves the primitives alone without the preset", () => {
        render(<Button>Plain</Button>);
        const cls = screen.getByRole("button", { name: "Plain" }).className.split(" ");
        expect(cls).toContain("rounded-md");
        expect(cls).not.toContain("rounded-full");
    });
});
