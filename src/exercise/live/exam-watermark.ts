// The live paper's forensic mark: faint horizontal rules across the whole
// runner, drawn as dots and dashes that spell the attempt's code in Morse, so a
// screenshot of the paper that turns up later can be traced to its sitting.
//
// The code is the participant key's first 8 hex digits, so a person can read
// the rules by eye and look the attempt up. `traceWatermark` does it by machine:
// told which attempts to look for (a session's participants), it scores each by
// correlation, which survives far more damage than reading the dashes back.
//
// Dependency-free on purpose, so the trace CLI can import this file directly.

/**
 * One Morse unit (a dot, or the gap inside a letter) in CSS pixels, and a
 * rule's thickness. 3 × 1 px read exactly from a screenshot but not from one a
 * chat app had resized and recompressed.
 */
export const WATERMARK_UNIT = 4;
export const WATERMARK_RULE = 2;
/** CSS pixels between rules. */
export const WATERMARK_ROW = 24;
/**
 * The rules are waves, two families crossing like the guilloche behind a bank
 * transfer receipt: `y + A·sin(2πx/P)` and its mirror. P divides every tile, so
 * the waves join across tiles.
 */
export const WATERMARK_WAVE_AMPLITUDE = 10;
export const WATERMARK_WAVE_PERIOD = 192;
/** Message lengths are padded to a whole number of wave periods. */
const UNITS_PER_WAVE = WATERMARK_WAVE_PERIOD / WATERMARK_UNIT;

/** How far a rule's wave sits above or below its line at `x` CSS px: one family at `phase`, its mirror at `phase + π`. */
export function waveOffset(x: number, phase = 0): number {
  return WATERMARK_WAVE_AMPLITUDE * Math.sin((2 * Math.PI * x) / WATERMARK_WAVE_PERIOD + phase);
}
/** Each rule starts a quarter of the message on from the one above, so the dashes don't stack into columns. */
export const WATERMARK_STAGGER = 4;
/** How dark a rule is: ~5 levels of 255 on Leap's page and cards. */
export const WATERMARK_ALPHA = 0.02;

const MORSE: Record<string, string> = {
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
};

function fnvHex(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** The 8 hex digits the rules spell: the key's own, or a hash of a key that has none. */
export function watermarkCode(key: string): string {
  const hex = key.replace(/[^0-9a-f]/gi, "");
  return (hex.length >= 8 ? hex.slice(0, 8) : fnvHex(key)).toUpperCase();
}

/**
 * The code in Morse units, 1 lit and 0 dark: a dot is 1 unit, a dash 3, with
 * 1 between the marks of a letter, 3 between letters and 7 before it repeats.
 */
export function watermarkUnits(key: string): Uint8Array {
  const units: number[] = [];
  for (const char of watermarkCode(key)) {
    for (const mark of MORSE[char]) {
      for (let i = 0; i < (mark === "-" ? 3 : 1); i += 1) units.push(1);
      units.push(0);
    }
    units.push(0, 0);
  }
  units.push(0, 0, 0, 0);
  // The gap before the repeat is stretched to a whole number of waves, so a
  // tile of the message is also a tile of the wave.
  while (units.length % UNITS_PER_WAVE) units.push(0);
  return Uint8Array.from(units);
}

/** How many units a rule is shifted by: its row within the stagger, times a quarter of the message. */
export function rowShift(row: number, length: number): number {
  return Math.round(((((row % WATERMARK_STAGGER) + WATERMARK_STAGGER) % WATERMARK_STAGGER) * length) / WATERMARK_STAGGER);
}

/** A greyscale image, one 0–255 value per pixel, row-major. */
export interface GrayImage {
  width: number;
  height: number;
  data: Float32Array;
}

export interface TraceMatch {
  key: string;
  /** The rules carry this attempt's code: same length, and at most 6% of units misread. */
  matched: boolean;
  /** Fraction of units that disagree at the best alignment; null where the length differs. */
  mismatch: number | null;
}

export interface TraceResult {
  /** The 8 hex digits read off the rules, or null where a misread unit broke the Morse. */
  code: string | null;
  /** Candidates, closest first. */
  matches: TraceMatch[];
  /** Image pixels per CSS pixel the rules were found at. */
  scale: number;
}

/**
 * How many units may be misread. A chat app's resized JPEG misread 1 in 100;
 * the closest of 200 random keys to a clean read was 18% off.
 */
const MAX_MISMATCH = 0.06;

const FROM_MORSE = Object.fromEntries(Object.entries(MORSE).map(([char, marks]) => [marks, char]));

/**
 * Reads a folded rule back into its code: the cycle is cut at its longest dark
 * run (the gap before the message repeats), then lit runs of 1 are dots and
 * longer ones dashes, dark runs of 2+ end a letter. Null if it doesn't spell 8
 * hex digits.
 */
export function readMorse(lit: ArrayLike<number>): string | null {
  const L = lit.length;
  let start = -1;
  let longest = 0;
  for (let i = 0; i < L; i += 1) {
    if (lit[i] || !lit[(i + L - 1) % L]) continue;
    let run = 0;
    while (run < L && !lit[(i + run) % L]) run += 1;
    if (run > longest) {
      longest = run;
      start = (i + run) % L;
    }
  }
  if (start < 0) return null;
  let code = "";
  let marks = "";
  let i = 0;
  while (i < L) {
    const on = lit[(start + i) % L];
    let run = 0;
    while (i + run < L && lit[(start + i + run) % L] === on) run += 1;
    if (on) marks += run === 1 ? "." : "-";
    else if (run >= 2) {
      const char = FROM_MORSE[marks];
      if (!char) return null;
      code += char;
      marks = "";
    }
    i += run;
  }
  return code.length === 8 ? code : null;
}

/** Each rule's pixels summed per unit along it, for one sub-unit phase, so a fold reads units, not pixels. */
interface UnitRows {
  sums: Float64Array[];
  counts: Float64Array[];
}

function unitRows(hp: Float32Array, w: number, rules: Rules, fx: number): UnitRows {
  const unitPx = WATERMARK_UNIT * rules.scale;
  const h = hp.length / w;
  const n = Math.ceil(w / unitPx) + 1;
  const bend = Int32Array.from({ length: w }, (_, x) => Math.round(rules.scale * waveOffset(x / rules.scale, rules.phase)));
  const sums: Float64Array[] = [];
  const counts: Float64Array[] = [];
  for (const lines of rules.rows) {
    const s = new Float64Array(n);
    const c = new Float64Array(n);
    for (const base of lines) {
      for (let x = 0; x < w; x += 1) {
        const y = base + bend[x];
        if (y < 0 || y >= h) continue;
        const v = hp[y * w + x];
        if (v !== v) continue;
        const u = Math.floor(x / unitPx + fx);
        s[u] += v;
        c[u] += 1;
      }
    }
    sums.push(s);
    counts.push(c);
  }
  return { sums, counts };
}

/** The rules folded at one message length: each unit's mean, for one stagger alignment. */
function foldRules(rows: UnitRows, L: number, k0: number): Float64Array {
  const sums = new Float64Array(L);
  const counts = new Float64Array(L);
  rows.sums.forEach((s, k) => {
    const c = rows.counts[k];
    const shift = rowShift(k + k0, L);
    for (let u = 0, b = (((-shift) % L) + L) % L; u < s.length; u += 1, b = b + 1 === L ? 0 : b + 1) {
      sums[b] += s[u];
      counts[b] += c[u];
    }
  });
  const bins = new Float64Array(L);
  for (let i = 0; i < L; i += 1) bins[i] = counts[i] ? sums[i] / counts[i] : 0;
  return bins;
}

/** Splits folded units into lit and dark where the two groups are furthest apart for their size (Otsu). */
function threshold(bins: Float64Array): Uint8Array {
  const sorted = [...bins].sort((a, b) => a - b);
  const total = sorted.reduce((a, b) => a + b, 0);
  let cut = sorted[0];
  let bestBetween = -1;
  let below = 0;
  for (let i = 1; i < sorted.length; i += 1) {
    below += sorted[i - 1];
    const n0 = i;
    const n1 = sorted.length - i;
    const between = n0 * n1 * (below / n0 - (total - below) / n1) ** 2;
    if (between > bestBetween) {
      bestBetween = between;
      cut = (sorted[i] + sorted[i - 1]) / 2;
    }
  }
  // Lit units are darker (positive), but dark mode flips the sign. Morse
  // settles it: no mark is longer than a 3-unit dash, while the gap before the
  // message repeats is 7, so the side holding a run past 3 is the dark one.
  const lit = Uint8Array.from(bins, (v) => (v > cut ? 1 : 0));
  const L = lit.length;
  let longest = 0;
  for (let i = 0; i < L; i += 1) {
    let run = 0;
    while (run < L && lit[(i + run) % L]) run += 1;
    longest = Math.max(longest, run);
  }
  return longest > 3 ? Uint8Array.from(lit, (v) => 1 - v) : lit;
}

interface Read {
  /** The message length the rules fold cleanest at, in units. */
  length: number;
  /** Each unit lit (1) or dark (0), in the rules' own rotation. */
  lit: Uint8Array;
  /** The read Morse, where every unit parsed. */
  code: string | null;
}

/**
 * Tries every message length the code can have (8 letters of 4–22 units, plus
 * the repeat gap, padded to whole waves) and reads the one that folds cleanest.
 */
function readRules(hp: Float32Array, w: number, rules: Rules): Read | null {
  let best: { contrast: number; bins: Float64Array } | null = null;
  const phases = [0, 1 / 3, 2 / 3].map((fx) => unitRows(hp, w, rules, fx));
  const shortest = Math.ceil((8 * 4 + 4) / UNITS_PER_WAVE) * UNITS_PER_WAVE;
  for (let L = shortest; L <= 8 * 22 + 4 + UNITS_PER_WAVE; L += UNITS_PER_WAVE) {
    for (let k0 = 0; k0 < WATERMARK_STAGGER; k0 += 1) {
      for (const rows of phases) {
        const bins = foldRules(rows, L, k0);
        const mean = bins.reduce((a, b) => a + b, 0) / L;
        const contrast = bins.reduce((a, b) => a + (b - mean) ** 2, 0) / L;
        if (!best || contrast > best.contrast) best = { contrast, bins };
      }
    }
  }
  if (!best) return null;
  const lit = threshold(best.bins);
  // Noise folds into some pattern too, and at the shortest length a run of
  // dots reads as "EEEEEEEE". A real rule splits its units into two tight
  // groups, so a code is reported only if they sit well apart.
  const groups = [0, 1].map((side) => best.bins.filter((_, i) => lit[i] === side));
  const stats = groups.map((g) => {
    const mean = g.reduce((a, b) => a + b, 0) / (g.length || 1);
    return { mean, variance: g.reduce((a, b) => a + (b - mean) ** 2, 0) / (g.length || 1) };
  });
  const spread = Math.sqrt((stats[0].variance + stats[1].variance) / 2) || Number.EPSILON;
  const clean = groups.every((g) => g.length >= 2) && Math.abs(stats[1].mean - stats[0].mean) / spread >= 4;
  return { length: lit.length, lit, code: clean ? readMorse(lit) : null };
}

/** Fraction of units where the read and a code disagree, at the best rotation and either polarity. */
function mismatchOf(read: Read, units: Uint8Array): number | null {
  const L = read.length;
  if (units.length !== L) return null;
  let best = 1;
  for (let d = 0; d < L; d += 1) {
    let differ = 0;
    for (let i = 0; i < L; i += 1) differ += read.lit[(i + d) % L] === units[i] ? 0 : 1;
    best = Math.min(best, differ / L, 1 - differ / L);
  }
  return best;
}

/**
 * The image minus its local background, leaving the rules' small steps. Text
 * and edges are 50× stronger than the mark, so a pixel further than `clip` from
 * the background is dropped (NaN), and the background itself is averaged over
 * the pixels a first pass kept, or a word would darken the page around it.
 */
function highPass(img: GrayImage, radius: number, clip = 10): Float32Array {
  const { width: w, height: h, data } = img;
  const W = w + 1;
  const boxMean = (keep: Uint8Array | null) => {
    const sum = new Float64Array(W * (h + 1));
    const count = new Float64Array(W * (h + 1));
    for (let y = 0; y < h; y += 1) {
      let rs = 0;
      let rc = 0;
      for (let x = 0; x < w; x += 1) {
        if (!keep || keep[y * w + x]) {
          rs += data[y * w + x];
          rc += 1;
        }
        sum[(y + 1) * W + x + 1] = sum[y * W + x + 1] + rs;
        count[(y + 1) * W + x + 1] = count[y * W + x + 1] + rc;
      }
    }
    const mean = new Float32Array(w * h);
    for (let y = 0; y < h; y += 1) {
      const y0 = Math.max(0, y - radius);
      const y1 = Math.min(h, y + radius + 1);
      for (let x = 0; x < w; x += 1) {
        const x0 = Math.max(0, x - radius);
        const x1 = Math.min(w, x + radius + 1);
        const box = (a: Float64Array) => a[y1 * W + x1] - a[y0 * W + x1] - a[y1 * W + x0] + a[y0 * W + x0];
        const n = box(count);
        mean[y * w + x] = n ? box(sum) / n : Number.NaN;
      }
    }
    return mean;
  };
  const first = boxMean(null);
  const keep = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i += 1) keep[i] = Math.abs(data[i] - first[i]) <= clip ? 1 : 0;
  const background = boxMean(keep);
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    const v = data[i] - background[i];
    // Inverted: a rule is darker, so it reads positive.
    out[i] = Math.abs(v) <= clip ? -v : Number.NaN;
  }
  return out;
}

/**
 * Per pixel row, the mean of what survived the high pass (0 where little did),
 * read along a wave of the given scale and phase rather than straight across,
 * so one family's rules line up into sharp rows. No wave: straight across.
 */
function rowProfile(
  hp: Float32Array,
  w: number,
  h: number,
  wave?: { scale: number; phase: number },
  stride = 1,
): Float64Array {
  const bend = Int32Array.from({ length: w }, (_, x) =>
    wave ? Math.round(wave.scale * waveOffset(x / wave.scale, wave.phase)) : 0,
  );
  const profile = new Float64Array(h);
  for (let y = 0; y < h; y += 1) {
    let sum = 0;
    let n = 0;
    for (let x = 0; x < w; x += stride) {
      const yy = y + bend[x];
      if (yy < 0 || yy >= h) continue;
      const v = hp[yy * w + x];
      if (v === v) {
        sum += v;
        n += 1;
      }
    }
    profile[y] = n > (w / stride) * 0.1 ? sum / n : 0;
  }
  return profile;
}

/** Row profiles of vertical strips `width` px wide: within one, a wave is nearly level. */
function stripProfiles(hp: Float32Array, w: number, h: number, width = 8): Float64Array[] {
  const strips: Float64Array[] = [];
  for (let x0 = 0; x0 + width <= w; x0 += width) {
    const profile = new Float64Array(h);
    for (let y = 0; y < h; y += 1) {
      let sum = 0;
      let n = 0;
      for (let x = x0; x < x0 + width; x += 1) {
        const v = hp[y * w + x];
        if (v === v) {
          sum += v;
          n += 1;
        }
      }
      profile[y] = n > width / 2 ? sum / n : 0;
    }
    strips.push(profile);
  }
  return strips;
}

/**
 * The profile minus its running median over ±`radius` rows: keeps a thin rule
 * and drops a step, such as the 5 levels between the cream page and a white
 * card, whose edges repeat down a page of cards and would outshine the rules.
 */
function thinLines(profile: Float64Array, radius: number): Float64Array {
  const out = new Float64Array(profile.length);
  const window: number[] = [];
  for (let y = 0; y < profile.length; y += 1) {
    window.length = 0;
    for (let d = -radius; d <= radius; d += 1) {
      const v = profile[y + d];
      if (v !== undefined) window.push(v);
    }
    window.sort((a, b) => a - b);
    out[y] = profile[y] - window[window.length >> 1];
  }
  return out;
}

/** How strongly the profile repeats every `period` rows (one DFT bin). */
function periodicity(profile: Float64Array, period: number): number {
  let re = 0;
  let im = 0;
  for (let y = 0; y < profile.length; y += 1) {
    const a = (2 * Math.PI * y) / period;
    re += profile[y] * Math.cos(a);
    im += profile[y] * Math.sin(a);
  }
  return Math.hypot(re, im);
}

interface Rules {
  scale: number;
  /** The wave's phase at x = 0, in radians. */
  phase: number;
  /** Each rule's pixel rows where its wave crosses its line, top first. */
  rows: number[][];
}

/** Where the rules sit at a given period, along a wave of `phase`: the darkest phase, every period down. */
function locateRules(profile: Float64Array, period: number, phase: number): Rules {
  const bins = Math.max(4, Math.round(period * 2));
  const sums = new Float64Array(bins);
  const counts = new Float64Array(bins);
  for (let y = 0; y < profile.length; y += 1) {
    const b = Math.floor(((y % period) / period) * bins) % bins;
    sums[b] += profile[y];
    counts[b] += 1;
  }
  let best = 0;
  for (let b = 1; b < bins; b += 1) {
    if (Math.abs(sums[b] / (counts[b] || 1)) > Math.abs(sums[best] / (counts[best] || 1))) best = b;
  }
  const scale = period / WATERMARK_ROW;
  const centre = ((best + 0.5) / bins) * period;
  const half = Math.max(0.5, (scale * WATERMARK_RULE) / 2);
  const rows: number[][] = [];
  for (let c = centre; c < profile.length; c += period) {
    const lines: number[] = [];
    for (let y = Math.round(c - half); y <= Math.round(c + half - 0.01); y += 1) {
      if (y >= 0 && y < profile.length) lines.push(y);
    }
    if (lines.length) rows.push(lines);
  }
  return { scale, phase, rows };
}

/**
 * Reads the rules in an image and says which of `candidates` (participant keys)
 * they belong to. Finds the rules' spacing from the image's row profile, folds
 * them at the message length that comes out cleanest, and compares that unit by
 * unit with each candidate's code. A resized or recompressed copy misreads a
 * few units, which breaks the Morse but not the match, so a candidate matches
 * on length plus at most `MAX_MISMATCH` of its units wrong.
 */
export function traceWatermark(
  img: GrayImage,
  candidates: string[],
  // `peaks`: a rule's spacing and its harmonics all show in the profile, and a
  // crop of a few rules can rank its own spacing 4th; read straight across, a
  // wave's rows smear, and a page of cards outranks them further, so 12 are read.
  { minScale = 0.4, maxScale = 4, peaks = 12 } = {},
): TraceResult {
  const hp = highPass(img, 6);
  const raw = rowProfile(hp, img.width, img.height);
  // Read straight across, a wave as tall as the spacing smears its rows away.
  // In a strip a few pixels wide it is nearly level, so the spacing is found
  // strip by strip, each strip's rows at its own height, and the powers summed.
  const strips = stripProfiles(hp, img.width, img.height);
  // A rule is `scale × WATERMARK_RULE` rows thick, so the median that keeps it is wider.
  const filtered = new Map<number, Float64Array[]>();
  const stripsFor = (period: number) => {
    const radius = Math.max(2, Math.ceil((1.5 * WATERMARK_RULE * period) / WATERMARK_ROW) + 1);
    if (!filtered.has(radius)) filtered.set(radius, strips.map((s) => thinLines(s, radius)));
    return filtered.get(radius)!;
  };
  const power = (period: number) => {
    const h = img.height;
    const cos = Float64Array.from({ length: h }, (_, y) => Math.cos((2 * Math.PI * y) / period));
    const sin = Float64Array.from({ length: h }, (_, y) => Math.sin((2 * Math.PI * y) / period));
    let total = 0;
    for (const s of stripsFor(period)) {
      let re = 0;
      let im = 0;
      for (let y = 0; y < h; y += 1) {
        re += s[y] * cos[y];
        im += s[y] * sin[y];
      }
      total += re * re + im * im;
    }
    return total;
  };
  // Coarse then fine: the spacing sets the scale, and an error of a fraction
  // of a percent drifts the dashes a unit across a laptop screenshot.
  const coarse: { period: number; power: number }[] = [];
  for (let p = WATERMARK_ROW * minScale; p <= WATERMARK_ROW * maxScale; p *= 1.005) {
    coarse.push({ period: p, power: power(p) });
  }
  const local = coarse.filter(
    (c, i) => (i === 0 || c.power >= coarse[i - 1].power) && (i === coarse.length - 1 || c.power >= coarse[i + 1].power),
  );
  local.sort((a, b) => b.power - a.power);
  const periods = local.slice(0, peaks).map(({ period }) => {
    let best = { period, power: 0 };
    for (let p = period * 0.995; p <= period * 1.005; p *= 1.0002) {
      const pw = power(p);
      if (pw > best.power) best = { period: p, power: pw };
    }
    return best.period;
  });
  const candidateUnits = candidates.map(watermarkUnits);
  // How good a reading is: its closest candidate, then whether it parsed.
  const rank = (r: { matches: TraceMatch[]; code: string | null }) => [r.matches[0]?.mismatch ?? 1, r.code ? 0 : 1];
  let best: TraceResult | null = null;
  for (const period of periods) {
    // Which way the waves run: read along each phase, and the one whose rows
    // come out sharpest is a family's own (its mirror is the other half-turn).
    const scale = period / WATERMARK_ROW;
    const radius = Math.max(2, Math.ceil((1.5 * WATERMARK_RULE * period) / WATERMARK_ROW) + 1);
    let along = { phase: 0, power: -1, profile: raw };
    // 64 phases keep the guess within a third of a rule of the wave; every 4th
    // column is enough to say which phase is sharpest.
    for (let i = 0; i < 64; i += 1) {
      const phase = (i / 64) * 2 * Math.PI;
      const profile = thinLines(rowProfile(hp, img.width, img.height, { scale, phase }, 4), radius);
      const power = periodicity(profile, period);
      if (power > along.power) along = { phase, power, profile };
    }
    const rules = locateRules(along.profile, period, along.phase);
    if (rules.rows.length < 2) continue;
    const read = readRules(hp, img.width, rules);
    if (!read) continue;
    const matches = candidates
      .map((key, i) => {
        const mismatch = mismatchOf(read, candidateUnits[i]);
        return { key, mismatch, matched: mismatch !== null && mismatch <= MAX_MISMATCH };
      })
      .sort((a, b) => (a.mismatch ?? 2) - (b.mismatch ?? 2));
    const result = { code: read.code, matches, scale: rules.scale };
    if (!best) best = result;
    else {
      const [a, b] = [rank(result), rank(best)];
      if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) best = result;
    }
  }
  return best ?? { code: null, matches: [], scale: 0 };
}
