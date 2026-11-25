import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../../exports";

/** A question-shaped placeholder card; `label` adds a spinner line above it. */
export function DetailSkeleton({ label }: { label?: ReactNode }) {
  return (
    <div className="space-y-5" aria-busy="true">
      <Card className="border shadow-sm">
        <CardContent className="space-y-4 p-6">
          {label ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-lav-700">
              <Loader2 className="size-4 animate-spin" />
              {label}
            </div>
          ) : null}
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-9 rounded-xl bg-muted" />
              <div className="h-9 rounded-xl bg-muted" />
              <div className="h-9 rounded-xl bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
