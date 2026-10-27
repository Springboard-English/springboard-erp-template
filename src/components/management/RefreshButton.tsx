import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { type RefreshHandler } from "../../context/PullToRefreshContext";
import { cn } from "@/lib/utils";

export interface RefreshButtonProps {
  /** Reloads the page's data; a returned promise keeps the spinner going until it settles. */
  onRefresh: RefreshHandler;
  disabled?: boolean;
  className?: string;
}

/**
 * A list page's Refresh, shown from `md` up. Phones hide it: there the
 * layout's pull-to-refresh reloads every page, with nothing to wire.
 */
export default function RefreshButton({ onRefresh, disabled = false, className }: RefreshButtonProps) {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    void Promise.resolve()
      .then(onRefresh)
      .catch(() => undefined)
      .finally(() => setRunning(false));
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("max-md:hidden", className)}
      onClick={run}
      disabled={disabled || running}
    >
      <RefreshCw className={cn("size-4", running && "animate-spin")} />
      {t("common.refresh")}
    </Button>
  );
}
