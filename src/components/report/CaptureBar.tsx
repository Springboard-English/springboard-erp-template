import { useCallback, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { captureViewport } from "./capture";

export interface CaptureBarProps {
  onCaptured: (dataUrl: string) => void;
  onCancel: () => void;
}

/**
 * The floating bar of screenshot mode. Only this bar is drawn, so the app
 * underneath stays usable while the reporter goes to the screen with the
 * problem; Capture grabs the visible page.
 */
export default function CaptureBar({ onCaptured, onCancel }: CaptureBarProps) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await captureViewport();
      onCaptured(result.dataUrl);
    } catch {
      setError(t("report.captureFailed"));
    } finally {
      setBusy(false);
    }
  }, [onCaptured, t]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xl">
        <span className="min-w-0 text-sm font-medium text-foreground">
          {error ?? t("report.captureBarHint")}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" onClick={() => void capture()} disabled={busy}>
            <Camera className="size-4" />
            {busy ? t("report.capturing") : t("report.captureNow")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={busy}>
            <X className="size-4" />
            {t("report.captureCancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
