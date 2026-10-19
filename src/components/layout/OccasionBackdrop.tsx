import { useMemo, type ReactElement } from "react";
import { currentOccasion, type Occasion } from "@/utils/occasion";

/** A seeded generator, so the scene is the same on every render and reload. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How far, in CSS pixels, the scenes are drawn; the layer clips the rest. */
const WIDE = 4080;

const PETALS =["oklch(0.72 0.16 5)", "oklch(0.8 0.11 45)", "oklch(0.76 0.13 345)", "oklch(0.84 0.08 20)"];
const CANOPIES = ["oklch(0.72 0.13 150)", "oklch(0.8 0.13 95)", "oklch(0.7 0.1 230)", "oklch(0.76 0.12 125)"];

function Flower({ x, y, size, rotate, colour }: { x: number; y: number; size: number; rotate: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx={0} cy={-9} rx={6} ry={10} fill={colour} transform={`rotate(${angle})`} />
      ))}
      <circle r={4.5} fill="oklch(0.88 0.12 85)" />
    </g>
  );
}

function Tree({ x, base, height, colour }: { x: number; base: number; height: number; colour: string }) {
  const r = height * 0.32;
  const top = base - height;
  return (
    <g>
      <rect x={x - height * 0.035} y={top + r} width={height * 0.07} height={height - r} rx={2} fill="oklch(0.62 0.06 60)" />
      <circle cx={x} cy={top + r} r={r} fill={colour} />
      <circle cx={x - r * 0.7} cy={top + r * 1.45} r={r * 0.75} fill={colour} />
      <circle cx={x + r * 0.7} cy={top + r * 1.45} r={r * 0.75} fill={colour} />
    </g>
  );
}

/** 20/10: blossoms strung along the top, a cluster in the lower corner, petals drifting between. */
function WomensDay() {
  const scene = useMemo(() => {
    const random = seeded(2010);
    const garland = Array.from({ length: WIDE / 34 }, (_, i) => ({
      x: i * 34 + random() * 20,
      y: 6 + random() * 44,
      size: 0.5 + random() * 0.6,
      rotate: random() * 72,
      colour: PETALS[Math.floor(random() * PETALS.length)],
    }));
    const cluster = Array.from({ length: 14 }, () => ({
      x: 300 - random() * 260,
      y: 300 - random() * 240,
      size: 0.8 + random() * 1.2,
      rotate: random() * 72,
      colour: PETALS[Math.floor(random() * PETALS.length)],
    }));
    const petals = Array.from({ length: WIDE / 48 }, () => ({
      x: random() * WIDE,
      y: 60 + random() * 200,
      rotate: random() * 180,
      colour: PETALS[Math.floor(random() * PETALS.length)],
    }));
    return { garland, cluster, petals };
  }, []);
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.85_0.09_10/0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,oklch(0.88_0.07_45/0.35),transparent_55%)]" />
      <svg className="absolute left-0 top-0 h-[260px] w-full" aria-hidden="true">
        {scene.petals.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={3} ry={6} fill={p.colour} opacity={0.7} transform={`rotate(${p.rotate} ${p.x} ${p.y})`} />
        ))}
        {scene.garland.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </svg>
      <svg className="absolute bottom-0 right-0 h-[220px] w-[220px]" viewBox="0 0 300 300" aria-hidden="true">
        {scene.cluster.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </svg>
    </>
  );
}

/** 20/11: a row of trees along the bottom, leaves falling from a sky-to-gold wash. */
function TeachersDay() {
  const scene = useMemo(() => {
    const random = seeded(2011);
    const trees = Array.from({ length: WIDE / 48 }, (_, i) => ({
      x: i * 48 + random() * 30,
      base: 180,
      height: 50 + random() * 110,
      colour: CANOPIES[Math.floor(random() * CANOPIES.length)],
    })).sort((a, b) => b.height - a.height);
    const leaves = Array.from({ length: WIDE / 40 }, () => ({
      x: random() * WIDE,
      y: random() * 200,
      rotate: random() * 180,
      colour: CANOPIES[Math.floor(random() * CANOPIES.length)],
    }));
    return { trees, leaves };
  }, []);
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.86_0.06_235/0.4),transparent_35%,transparent_70%,oklch(0.9_0.08_90/0.4))]" />
      <svg className="absolute left-0 top-0 h-[200px] w-full" aria-hidden="true">
        {scene.leaves.map((l, i) => (
          <path
            key={i}
            d="M0 -8 Q6 0 0 8 Q-6 0 0 -8Z"
            fill={l.colour}
            opacity={0.75}
            transform={`translate(${l.x} ${l.y}) rotate(${l.rotate})`}
          />
        ))}
      </svg>
      <svg className="absolute bottom-0 left-0 h-[180px] w-full" aria-hidden="true">
        {scene.trees.map((t, i) => (
          <Tree key={i} {...t} />
        ))}
      </svg>
    </>
  );
}

const SCENES: Record<Occasion, () => ReactElement> = {
  "womens-day": WomensDay,
  "teachers-day": TeachersDay,
};

/**
 * The scene DashboardLayout draws behind every page on an occasion
 * (utils/occasion.ts), and nothing on any other day. Faint, behind the
 * content, and never in the way of a click.
 */
export default function OccasionBackdrop() {
  const occasion = useMemo(() => currentOccasion(new Date(), window.location.search), []);
  if (!occasion) return null;
  const Scene = SCENES[occasion];
  return (
    <div
      aria-hidden="true"
      data-occasion={occasion}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-45 dark:opacity-35"
    >
      <Scene />
    </div>
  );
}
