export interface CaptureResult {
  dataUrl: string;
  width: number;
  height: number;
}

const MAX_EDGE = 1800;
const QUALITY_SCALE = 1;

/** The page's background colour, or a plain light/dark one when the body is transparent. */
function usableBackground(): string {
  if (typeof window === "undefined") return "#ffffff";
  const value = getComputedStyle(document.body).backgroundColor;
  if (!value || value === "rgba(0, 0, 0, 0)" || value === "transparent") {
    return document.documentElement.classList.contains("dark") ? "#181b1f" : "#ffffff";
  }
  return value;
}

/** Captures what is visible of the page's `<main>` (or the body) as a PNG data URL. */
export async function captureViewport(): Promise<CaptureResult> {
  // Dynamic: the renderer touches the DOM, and the barrel must import cleanly in Node.
  const { domToPng } = await import("modern-screenshot");
  const target = document.querySelector("main") ?? document.body;
  const rect = target.getBoundingClientRect();
  const dataUrl = await domToPng(target as HTMLElement, {
    width: Math.max(1, Math.round(Math.min(rect.width, window.innerWidth))),
    height: Math.max(1, Math.round(Math.min(rect.height, window.innerHeight))),
    scale: QUALITY_SCALE,
    backgroundColor: usableBackground(),
    maximumCanvasSize: MAX_EDGE,
  });

  const dimensions = await readDimensions(dataUrl);
  return { dataUrl, ...dimensions };
}

/** The pixel size of an image data URL. */
function readDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => reject(new Error("The captured image could not be read."));
    image.src = dataUrl;
  });
}
