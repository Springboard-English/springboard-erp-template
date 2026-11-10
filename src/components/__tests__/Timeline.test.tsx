import { fireEvent, render, screen } from "@testing-library/react";
import { Video } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { Timeline, TimelineEntry, TimelineGroup } from "../timeline/Timeline";

describe("Timeline", () => {
  it("marks each group with where it sits against today", () => {
    render(
      <Timeline>
        <TimelineGroup label="Yesterday" state="past">
          <TimelineEntry icon={Video} title="Session 6" />
        </TimelineGroup>
        <TimelineGroup label="Today" state="today" meta="2 to do">
          <TimelineEntry icon={Video} title="Session 7" />
        </TimelineGroup>
        <TimelineGroup label="Friday">
          <TimelineEntry icon={Video} title="Session 8" />
        </TimelineGroup>
      </Timeline>,
    );
    const groups = screen.getAllByRole("listitem").filter((item) => item.hasAttribute("data-state"));
    expect(groups.map((group) => group.getAttribute("data-state"))).toEqual(["past", "today", "upcoming"]);
    expect(screen.getByText("2 to do")).toBeInTheDocument();
  });

  it("gives a heading and an entry row the same button height as a floor, not a cap", () => {
    render(
      <Timeline>
        <TimelineGroup label="Today" state="today">
          <TimelineEntry icon={Video} title="Session 7" meta="90 min" />
        </TimelineGroup>
      </Timeline>,
    );
    // 44px on touch, 36px with a mouse; the entry's row sits inside its 1px border.
    expect(screen.getByRole("heading", { name: "Today" })).toHaveClass("min-h-11", "md:pointer-fine:min-h-9");
    const row = screen.getByText("Session 7").closest("li")?.firstElementChild;
    expect(row).toHaveClass("min-h-[2.625rem]", "md:pointer-fine:min-h-[2.125rem]");
    // Nothing cuts the content to fit: no fixed height and no truncation.
    expect(row?.className).not.toMatch(/(^|\s)h-\[|max-h-/);
    expect(screen.getByText("Session 7")).not.toHaveClass("truncate");
  });

  it("opens an entry from its row and lists what belongs to it underneath", () => {
    const onOpen = vi.fn();
    render(
      <Timeline>
        <TimelineGroup label="Today" state="today">
          <TimelineEntry icon={Video} title="Session 7" meta="90 min" onOpen={onOpen}>
            <TimelineEntry icon={Video} title="Essay 1" warn meta="Missing" />
          </TimelineEntry>
        </TimelineGroup>
      </Timeline>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Session 7/ }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    // The nested row is not a button: nothing to open.
    expect(screen.queryByRole("button", { name: /Essay 1/ })).toBeNull();
    expect(screen.getByText("Missing")).toHaveClass("text-destructive");
  });
});
