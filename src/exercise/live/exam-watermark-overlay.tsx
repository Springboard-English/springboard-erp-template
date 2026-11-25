import { useEffect, useMemo } from "react";

import {
  WATERMARK_ALPHA,
  WATERMARK_ROW,
  WATERMARK_RULE,
  WATERMARK_STAGGER,
  WATERMARK_UNIT,
  rowShift,
  watermarkUnits,
  waveOffset,
} from "./exam-watermark";
import { isAppleTouchDevice, readDeviceFacts } from "./device-support";

/** The path of one lit run of a rule: its wave from unit `from` to unit `to`, 1 px at a time. */
function runPath(from: number, to: number, line: number, phase: number): string {
  const points: string[] = [];
  for (let x = from * WATERMARK_UNIT; x <= to * WATERMARK_UNIT; x += 1) {
    points.push(`${x} ${(line + waveOffset(x, phase)).toFixed(2)}`);
  }
  return `M${points.join("L")}`;
}

/**
 * One tile of the guilloche: a rule per row in each of two mirrored wave
 * families, each rule a quarter of the message on from the one above.
 */
function guillocheTile(key: string, colour: string): { image: string; size: string } {
  const units = watermarkUnits(key);
  const L = units.length;
  const width = L * WATERMARK_UNIT;
  const height = WATERMARK_STAGGER * WATERMARK_ROW;
  const paths: string[] = [];
  for (const phase of [0, Math.PI]) {
    // One rule either side as well: a wave pokes past the tile's top and
    // bottom, and the neighbouring tile's rule has to draw that part.
    for (let row = -1; row <= WATERMARK_STAGGER; row += 1) {
      const shift = rowShift(row, L);
      const line = row * WATERMARK_ROW + WATERMARK_RULE / 2;
      // A dash cut by the tile's right edge runs past it (clipped) and starts
      // the next tile again at 0, so the two halves join.
      let start = -1;
      for (let u = 0; u <= L; u += 1) {
        const lit = u < L && units[(((u - shift) % L) + L) % L] === 1;
        if (lit && start < 0) start = u;
        if (!lit && start >= 0) {
          paths.push(runPath(start, u, line, phase));
          start = -1;
        }
      }
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<path d="${paths.join("")}" fill="none" stroke="${colour}" stroke-width="${WATERMARK_RULE}" stroke-linecap="butt"/></svg>`;
  return { image: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, size: `${width}px ${height}px` };
}

/**
 * The live paper's watermark: a faint guilloche, like the one behind a bank
 * transfer receipt, whose dots and dashes spell this attempt's code in Morse
 * (lib/exam-watermark.ts), so a screenshot of the paper traces back to the
 * sitting. It sits behind the text: the page and every card-coloured surface
 * draw it as a background anchored to the viewport (index.css), so it runs on
 * unbroken from one surface to the next. iOS ignores a fixed background, which
 * would break the waves at every card, so there it is a layer over the paper.
 */
export function ExamWatermark({ participantKey }: { participantKey: string }) {
  const tiles = useMemo(
    () => ({
      light: guillocheTile(participantKey, `rgba(0,0,0,${WATERMARK_ALPHA})`),
      dark: guillocheTile(participantKey, `rgba(255,255,255,${WATERMARK_ALPHA})`),
    }),
    [participantKey],
  );
  const overlay = useMemo(() => isAppleTouchDevice(readDeviceFacts()), []);

  useEffect(() => {
    if (overlay) return;
    const root = document.documentElement;
    root.style.setProperty("--exam-watermark-light", tiles.light.image);
    root.style.setProperty("--exam-watermark-dark", tiles.dark.image);
    root.style.setProperty("--exam-watermark-size", tiles.light.size);
    root.setAttribute("data-exam-watermark", "");
    return () => {
      root.removeAttribute("data-exam-watermark");
      for (const name of ["--exam-watermark-light", "--exam-watermark-dark", "--exam-watermark-size"]) {
        root.style.removeProperty(name);
      }
    };
  }, [overlay, tiles]);

  if (!overlay) return null;
  return (
    <div aria-hidden data-exam-watermark className="pointer-events-none fixed inset-0 z-[45] select-none print:hidden">
      <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: tiles.light.image, backgroundSize: tiles.light.size }} />
      <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: tiles.dark.image, backgroundSize: tiles.dark.size }} />
    </div>
  );
}
