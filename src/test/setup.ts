import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Shipped as `/test-setup` for the apps' suites as well as this package's own.
//
// Testing Library only registers its own cleanup when Vitest runs with globals,
// which neither this package nor the apps do. Without this, each render is left
// in the document and the second test in a file queries a DOM holding both.
afterEach(cleanup);

// A `// @vitest-environment node` test loads this file too, with no DOM to stub.
if (typeof window !== "undefined") {
  // jsdom has no `matchMedia`, and the layout components ask for one on mount —
  // `useIsMobile` is the reason, and `useServerList` also reads it to decide
  // which of a list's two surfaces fetches. Stubbing it to "no match" keeps a
  // rendered table on the desktop branch, which is the one worth asserting
  // against; a test that wants the mobile branch overrides it itself.
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  // Same story for `ResizeObserver`: `SimpleDataTable` measures its own footer
  // to size the scroll area. Nothing under test depends on the measurement.
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }

  // Radix primitives call these while opening a Select; jsdom has none of them.
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
