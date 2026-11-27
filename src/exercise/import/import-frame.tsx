import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { StudentShell } from "../index";

/**
 * Every screen of the AI import that isn't a question page (the source, the
 * read, the choice, the save and the end), drawn in the runner's own frame:
 * the same top bar with the import's steps in its centre and the six-segment
 * bar at its foot, and a bottom bar holding Back on the left and the step's
 * main action on the right. The review's `RunnerEditor` uses the same frame,
 * so nothing moves as the import goes from one step to the next.
 */
export function ImportFrame({
  steps,
  stepsBar,
  onExit,
  back,
  primary,
  pageKey,
  children,
}: {
  steps: ReactNode;
  stepsBar: ReactNode;
  onExit: () => void;
  /** The bottom bar's left: Back or Cancel. */
  back?: ReactNode;
  /** The bottom bar's right: the step's main action. */
  primary?: ReactNode;
  /** Changes with the screen, so the page reopens at its top. */
  pageKey: string;
  children: ReactNode;
}) {
  return createPortal(
    // Over the teacher page, at the runner's layer.
    <div className="fixed inset-0 z-[55] flex flex-col bg-background">
      <div className="min-h-0 flex-1">
        <StudentShell
          fill
          hideLogo
          current={0}
          total={0}
          onExit={onExit}
          heading={steps}
          progress={stepsBar}
          scrollKey={pageKey}
          footer={
            back || primary ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center">{back}</div>
                <div className="flex min-w-0 items-center justify-end">{primary}</div>
              </div>
            ) : undefined
          }
        >
          {children}
        </StudentShell>
      </div>
    </div>,
    document.body,
  );
}
