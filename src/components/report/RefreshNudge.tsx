import { useEffect, useState } from "react";
import { MessageCircleWarning, X } from "lucide-react";
import { Button } from "../ui/button";
import { useI18n } from "@/context/I18nContext";
import {
  isRefreshNudgeDue,
  markRefreshNudgeShown,
  recordDocumentReload,
  subscribeToRefreshes,
} from "@/utils/refreshActivity";

export interface RefreshNudgeProps {
  /** Opens the report form. */
  onReport: () => void;
  /** False holds the nudge back, for example while the report form is open. */
  allowed: boolean;
}

/**
 * Invites someone refreshing again and again to report a bug. Non-modal and
 * takes no focus, so it interrupts nothing; it stays until answered or until
 * the next reload. `ReportProblemProvider` mounts it, so whoever cannot report
 * never sees it.
 */
export default function RefreshNudge({ onReport, allowed }: RefreshNudgeProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    const check = () => {
      if (!isRefreshNudgeDue()) return;
      // Marked when shown, not when answered: an ignored nudge must not return.
      markRefreshNudgeShown();
      setVisible(true);
    };
    // Reached for a shell without `OidcBoot`; a no-op once it has run.
    recordDocumentReload();
    check();
    return subscribeToRefreshes(check);
  }, [allowed]);

  if (!visible || !allowed) return null;

  return (
    <div
      role="status"
      data-testid="refresh-nudge"
      // Phones clear the bottom bar; below the pending bar's z-[55] so it never covers Save.
      className="fixed inset-x-3 bottom-[calc(4rem+0.75rem+env(safe-area-inset-bottom))] z-50 md:inset-x-auto md:bottom-6 md:right-6 md:w-80"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{t("report.nudge.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("report.nudge.body")}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="-mr-1 -mt-1 shrink-0 rounded-full"
            aria-label={t("report.nudge.dismiss")}
            title={t("report.nudge.dismiss")}
            onClick={() => setVisible(false)}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            setVisible(false);
            onReport();
          }}
        >
          <MessageCircleWarning className="size-4" aria-hidden="true" />
          {t("report.nudge.action")}
        </Button>
      </div>
    </div>
  );
}
