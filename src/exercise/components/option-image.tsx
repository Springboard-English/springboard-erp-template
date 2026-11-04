import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { ImageOff, ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { useI18n } from "../../context/I18nContext";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";

// A question whose choices carry pictures stacks them one per row on a phone, where
// a picture needs the full width to be legible, and lays them out A, B, C across one
// row from `sm` up; each choice is a tile with its letter on top.
export const PICTURED_ROW = "grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))]";
export const PICTURED_TILE = "flex-col items-center px-2 text-center hover:-translate-y-0.5";

// The enlarge control sits inside the choice (a <label> or a <button>), and React
// bubbles events from the portalled dialog through the component tree, so every
// click and key inside it stops here rather than picking the choice.
const stop = (event: SyntheticEvent) => event.stopPropagation();

/**
 * A choice's picture, with a magnifier that opens it full size. `url` is a signed
 * URL that expires hours after the paper was read, so a failed load says so
 * instead of showing a broken image. Not draggable: dragging an image out of the
 * runner would carry the paper.
 */
export function OptionImage({
  url,
  alt,
  className,
}: {
  url: string;
  alt: string;
  className?: string;
}) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  if (failed) {
    return (
      <span
        className={cn(
          "flex h-24 w-32 items-center justify-center gap-1 rounded-[9px] bg-muted text-xs text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="size-4" />
        {t("exercise.renderer.imageUnavailable", "Image unavailable")}
      </span>
    );
  }
  const open = (event: SyntheticEvent) => {
    event.preventDefault();
    stop(event);
    setEnlarged(true);
  };
  return (
    <span className="relative inline-block max-w-full">
      <img
        src={url}
        alt={alt}
        draggable={false}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("max-h-64 max-w-full rounded-[9px] object-contain sm:max-h-40", className)}
      />
      <span onClick={stop} onKeyDown={stop}>
        {/* A span, not a <button>: the multi-select choice is itself a button. */}
        <span
          role="button"
          tabIndex={0}
          aria-label={t("exercise.renderer.enlarge", "Enlarge {alt}", { alt })}
          onClick={open}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") open(event);
          }}
          className={cn(touchHitArea, "absolute right-1 top-1 grid size-7 cursor-zoom-in place-items-center rounded-full bg-card/90 text-foreground shadow-sm hover:bg-card")}
        >
          <ZoomIn className="size-4" />
        </span>
        <Dialog open={enlarged} onOpenChange={setEnlarged}>
          <DialogContent className="sm:max-w-3xl">
            <DialogTitle className="sr-only">{alt}</DialogTitle>
            <img
              src={url}
              alt={alt}
              draggable={false}
              className="max-h-[80vh] w-full rounded-[9px] object-contain"
            />
          </DialogContent>
        </Dialog>
      </span>
    </span>
  );
}
