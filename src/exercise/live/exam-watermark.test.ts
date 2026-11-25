import { describe, expect, it } from "vitest";

import {
  WATERMARK_ROW,
  WATERMARK_RULE,
  WATERMARK_UNIT,
  rowShift,
  traceWatermark,
  watermarkCode,
  watermarkUnits,
  waveOffset,
  type GrayImage,
} from "./exam-watermark";

// A deterministic stand-in for Math.random, so a failure reproduces.
function rng(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

/** A page-like image: cream page, white cards, dark text-sized blocks, all drawn at `scale` image px per CSS px. */
function paper(width: number, height: number, scale = 1, seed = 7): Float32Array {
  const rand = rng(seed);
  const data = new Float32Array(width * height).fill(250);
  for (let y = 40 * scale; y < height - 40 * scale; y += 180 * scale) {
    for (let yy = Math.round(y); yy < Math.min(height, y + 140 * scale); yy += 1) {
      for (let x = Math.round(60 * scale); x < width - 60 * scale; x += 1) data[yy * width + x] = 255;
    }
  }
  for (let n = 0; n < (width * height) / (900 * scale * scale); n += 1) {
    const x0 = Math.floor(rand() * width);
    const y0 = Math.floor(rand() * height);
    const bw = Math.round((4 + Math.floor(rand() * 10)) * scale);
    const bh = Math.round((8 + Math.floor(rand() * 8)) * scale);
    for (let y = y0; y < Math.min(height, y0 + bh); y += 1) {
      for (let x = x0; x < Math.min(width, x0 + bw); x += 1) data[y * width + x] = 60;
    }
  }
  return data;
}

/** Draws the attempt's two wave families over the image at `scale` image px per CSS px, as ExamWatermark does. */
function mark(img: GrayImage, key: string, scale: number, offset = 0, amplitude = 5, noise = 1.5): GrayImage {
  const units = watermarkUnits(key);
  const L = units.length;
  const rand = rng(11);
  const data = new Float32Array(img.data);
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      const cx = (x + offset) / scale;
      const lit = [0, Math.PI].some((phase) => {
        const along = (y + offset) / scale - waveOffset(cx, phase);
        const row = Math.floor(along / WATERMARK_ROW);
        if (along - row * WATERMARK_ROW >= WATERMARK_RULE) return false;
        return units[(((Math.floor(cx / WATERMARK_UNIT) - rowShift(row, L)) % L) + L) % L] === 1;
      });
      const v = data[y * img.width + x] * (lit ? 1 - amplitude / 255 : 1);
      data[y * img.width + x] = v + (rand() - 0.5) * 2 * noise;
    }
  }
  return { ...img, data };
}

const KEYS = Array.from({ length: 12 }, (_, i) => `${(0x6f1c2e00 + i * 7919).toString(16)}-1b7a-4c1e-9a55-2d0c7e4b9f10`);

describe("watermarkCode", () => {
  it("spells the key's first 8 hex digits in Morse", () => {
    expect(watermarkCode("e5940b1f-02a6-422e-ac3c-a4859bfe181e")).toBe("E5940B1F");
    // "E" is one dot: 1 lit, 1 gap, then 2 more to end the letter.
    expect([...watermarkUnits("e5940b1f").slice(0, 4)]).toEqual([1, 0, 0, 0]);
  });

  it("hashes a key with too few hex digits rather than spelling nothing", () => {
    expect(watermarkCode("guest")).toMatch(/^[0-9A-F]{8}$/);
  });
});

describe("traceWatermark", () => {
  const blank: GrayImage = { width: 720, height: 540, data: paper(720, 540) };

  it("finds the attempt in a 1:1 screenshot", () => {
    const result = traceWatermark(mark(blank, KEYS[4], 1), KEYS, { minScale: 0.8, maxScale: 1.3 });
    expect(result.code).toBe(watermarkCode(KEYS[4]));
    expect(result.matches[0]).toMatchObject({ key: KEYS[4], matched: true });
    expect(result.matches.filter((m) => m.matched)).toHaveLength(1);
  });

  it("finds it in a high-density screenshot that was cropped off the rule grid", () => {
    // A phone screenshot: the page drawn at the same density as the rules.
    const phone: GrayImage = { width: 1080, height: 1200, data: paper(1080, 1200, 2.3) };
    const result = traceWatermark(mark(phone, KEYS[9], 2.3, 41), KEYS, { minScale: 1.9, maxScale: 2.6 });
    expect(result.matches[0]).toMatchObject({ key: KEYS[9], matched: true });
  }, 30_000); // a full scale sweep over 1.3 MP: ~4 s locally, past 5 s on the Cloud Build runner

  it("names nobody in an unmarked image", () => {
    const result = traceWatermark(blank, KEYS, { minScale: 0.8, maxScale: 2.6 });
    expect(result.code).toBeNull();
    expect(result.matches.some((m) => m.matched)).toBe(false);
  });
});
