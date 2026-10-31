import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Crop, Pencil, Undo2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/context/I18nContext";

export type AnnotationTool = "draw" | "crop";

// Ink painted onto the screenshot's pixels, not UI chrome, so literal colours.
const BRUSH_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#111827"];
const BRUSH_WIDTH = 4;
const MIN_CROP = 12;

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AnnotationEditorProps {
  /** The screenshot, as a data URL. */
  image: string;
  onCancel: () => void;
  onSave: (edited: string, cropped: boolean) => void;
}

/** Draw on and crop a screenshot before it is attached to a report. Undo keeps the last 20 steps. */
export default function AnnotationEditor({ image, onCancel, onSave }: AnnotationEditorProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<AnnotationTool>("draw");
  const [color, setColor] = useState(BRUSH_COLORS[0]);
  const [drawing, setDrawing] = useState(false);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const cropStartRef = useRef<Point | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [history, setHistory] = useState<string[]>([]);

  const paintBase = useCallback(() => {
    const canvas = canvasRef.current;
    const source = imageRef.current;
    if (!canvas || !source) return;
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    setCanvasSize({ w: canvas.width, h: canvas.height });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(source, 0, 0);
  }, []);

  useEffect(() => {
    const source = new Image();
    source.onload = () => {
      imageRef.current = source;
      paintBase();
      setHistory([source.src]);
    };
    source.src = image;
  }, [image, paintBase]);

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL("image/png") : null;
  }, []);

  const pushHistory = useCallback(() => {
    const current = snapshot();
    setHistory((previous) => (current ? [...previous, current].slice(-20) : previous));
  }, [snapshot]);

  const restore = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const source = new Image();
    source.onload = () => {
      canvas.width = source.naturalWidth;
      canvas.height = source.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(source, 0, 0);
    };
    source.src = dataUrl;
  }, []);

  const undo = useCallback(() => {
    setHistory((previous) => {
      if (previous.length <= 1) return previous;
      const next = previous.slice(0, -1);
      restore(next[next.length - 1]);
      return next;
    });
  }, [restore]);

  const toCanvasCoords = useCallback((event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(event.pointerId);
      const point = toCanvasCoords(event);
      if (tool === "crop") {
        cropStartRef.current = point;
        setCropRect({ x: point.x, y: point.y, w: 0, h: 0 });
        return;
      }
      pushHistory();
      setDrawing(true);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = BRUSH_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    },
    [color, pushHistory, toCanvasCoords, tool],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = toCanvasCoords(event);
      const start = cropStartRef.current;
      if (tool === "crop" && start) {
        setCropRect({
          x: Math.min(start.x, point.x),
          y: Math.min(start.y, point.y),
          w: Math.abs(point.x - start.x),
          h: Math.abs(point.y - start.y),
        });
        return;
      }
      if (!drawing) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [drawing, toCanvasCoords, tool],
  );

  const handlePointerUp = useCallback(() => {
    setDrawing(false);
    cropStartRef.current = null;
  }, []);

  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cropRect || cropRect.w < MIN_CROP || cropRect.h < MIN_CROP) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cropped = ctx.getImageData(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
    canvas.width = Math.round(cropRect.w);
    canvas.height = Math.round(cropRect.h);
    setCanvasSize({ w: canvas.width, h: canvas.height });
    ctx.putImageData(cropped, 0, 0);
    setCropRect(null);
    setTool("draw");
    pushHistory();
  }, [cropRect, pushHistory]);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"), true);
  }, [onSave]);

  return (
    <Dialog open onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-h-[94dvh] overflow-hidden sm:max-w-[92rem]">
        <DialogHeader>
          <DialogTitle>{t("report.annotateTitle")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-h-[20rem] items-center justify-center overflow-auto rounded-xl border border-border/70 bg-muted/30 p-2">
            <div className="relative inline-flex">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={cn(
                  "max-h-[74dvh] w-auto max-w-full touch-none rounded-lg",
                  tool === "crop" ? "cursor-crosshair" : "cursor-pencil",
                )}
              />
              {cropRect && canvasSize.w > 0 && canvasSize.h > 0 ? (
                <div
                  aria-hidden="true"
                  // A marquee over the screenshot's own pixels: it must read on any image, whatever the theme.
                  className="pointer-events-none absolute border-2 border-dashed border-white [box-shadow:0_0_0_1px_rgba(0,0,0,0.85),0_0_0_9999px_rgba(0,0,0,0.4)]"
                  style={{
                    left: `${(cropRect.x / canvasSize.w) * 100}%`,
                    top: `${(cropRect.y / canvasSize.h) * 100}%`,
                    width: `${(cropRect.w / canvasSize.w) * 100}%`,
                    height: `${(cropRect.h / canvasSize.h) * 100}%`,
                  }}
                />
              ) : null}
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-4 md:w-52 md:flex-col md:flex-nowrap">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {t("report.tool")}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={tool === "draw" ? "default" : "outline"}
                  onClick={() => {
                    setTool("draw");
                    setCropRect(null);
                  }}
                >
                  <Pencil className="size-4" />
                  {t("report.toolDraw")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={tool === "crop" ? "default" : "outline"}
                  onClick={() => setTool("crop")}
                >
                  <Crop className="size-4" />
                  {t("report.toolCrop")}
                </Button>
              </div>
            </div>

            {tool === "draw" ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("report.colour")}
                </p>
                <div className="flex gap-3">
                  {BRUSH_COLORS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={t("report.pickColour", undefined, { value })}
                      aria-pressed={color === value}
                      onClick={() => setColor(value)}
                      className={cn(
                        touchHitArea,
                        "relative size-7 rounded-full border-2",
                        color === value ? "border-foreground" : "border-transparent",
                      )}
                      style={{ backgroundColor: value }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={applyCrop} disabled={!cropRect}>
                <Check className="size-4" />
                {t("report.applyCrop")}
              </Button>
            )}

            <Button type="button" size="sm" variant="outline" onClick={undo} disabled={history.length <= 1}>
              <Undo2 className="size-4" />
              {t("report.undo")}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="size-4" />
            {t("report.discard")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t("report.saveEvidence")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
