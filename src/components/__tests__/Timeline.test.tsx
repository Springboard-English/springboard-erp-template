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
