import type { ReactNode } from "react";
import { DetailPulse } from "../../exports";

import { StudentShell } from "./student-shell";
import { DetailSkeleton } from "./detail-skeleton";

/**
 * The exam chrome around a skeleton paper, while the questions are fetched —
 * so the runner and the preview open straight into their real frame rather
 * than a bare loading line. `children` sits above the skeleton (a banner).
 */
export function PendingPaper({
  onExit,
  children,
}: {
  onExit?: () => void;
  children?: ReactNode;
}) {
  return (
    <StudentShell
      current={0}
      total={1}
      onExit={onExit}
      heading={<DetailPulse className="w-48" />}
      footer={
        <div className="flex items-center justify-between gap-3">
          <DetailPulse className="h-9 w-24 rounded-xl" />
          <DetailPulse className="h-9 w-24 rounded-xl" />
        </div>
      }
    >
      {children}
      <div className="mx-auto max-w-3xl">
        <DetailSkeleton />
      </div>
    </StudentShell>
  );
}
