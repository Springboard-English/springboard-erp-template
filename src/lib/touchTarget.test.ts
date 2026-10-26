import { describe, expect, it } from "vitest";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonTarget } from "./touchTarget";

const SIZES = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;

describe("button touch targets", () => {
  it.each(SIZES)("size %s carries the 44px touch and 36px desktop floor", (size) => {
    const classes = buttonVariants({ size }).split(" ");
    for (const token of buttonTarget.split(" ")) {
      expect(classes).toContain(token);
    }
  });

  it("keeps the floor when a caller sets a smaller height", () => {
    const classes = cn(buttonVariants({ size: "icon" }), "h-8 w-8").split(" ");
    expect(classes).toContain("min-h-11");
    expect(classes).toContain("md:pointer-fine:min-h-9");
  });

  it("gives every rung but lg the same desktop height", () => {
    for (const size of SIZES) {
      const classes = buttonVariants({ size }).split(" ");
      const desktop = size === "lg" || size === "icon-lg" ? ["md:h-10", "md:size-10"] : ["md:h-9", "md:size-9"];
      expect(classes.some((token) => desktop.includes(token))).toBe(true);
    }
  });
});
