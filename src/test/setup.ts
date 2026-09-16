import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only registers its own cleanup when Vitest runs with globals,
// which this package does not. Without this, each render is left in the document
// and the second test in a file queries a DOM holding both.
afterEach(cleanup);

// jsdom has no `matchMedia`, and this package's own layout components ask for
// one on mount — `useIsMobile` is the reason. Stubbing it to "no match" keeps a
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

// Same story for `ResizeObserver`: `SimpleDataTable` measures its own footer to
// size the scroll area. Nothing under test depends on the measurement.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
