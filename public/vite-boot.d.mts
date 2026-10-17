import type { Plugin } from "vite";

/** Puts the boot screen into the app's index.html. See vite-boot.mjs. */
export declare function springboardBoot(options?: {
  /** The small caps line above "Springboard English", e.g. "HRM". */
  label?: string;
}): Plugin;
