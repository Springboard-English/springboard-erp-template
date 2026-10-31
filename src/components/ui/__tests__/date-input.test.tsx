import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";

/** A controlled date field that reports each value it receives. */
function Controlled({ initial, onValue, type = "date" }: { initial: string; onValue: (value: string) => void; type?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Input
      aria-label="Start"
      type={type}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onValue(event.target.value);
      }}
    />
  );
}

describe("Input date fields", () => {
  it("shows an ISO value day first", () => {
    render(<Controlled initial="2026-10-27" onValue={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Start" })).toHaveProperty("value", "27/10/2026");
  });

  it("reports ISO once the typed date is real, and not before", () => {
    const onValue = vi.fn();
    render(<Controlled initial="" onValue={onValue} />);
    const field = screen.getByRole("textbox", { name: "Start" });
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "31/02/2026" } });
    expect(onValue).not.toHaveBeenCalled();
    fireEvent.change(field, { target: { value: "28/02/2026" } });
    expect(onValue).toHaveBeenLastCalledWith("2026-02-28");
  });

  it("reads a date-time on a 24-hour clock", () => {
    render(<Controlled initial="2026-10-27T13:05" onValue={() => undefined} type="datetime-local" />);
    expect(screen.getByRole("textbox", { name: "Start" })).toHaveProperty("value", "27/10/2026 13:05");
  });
});
