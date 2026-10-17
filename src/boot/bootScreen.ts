// The React side of the boot screen that `springboardBoot()` paints into an
// app's index.html (public/boot.css, boot.js). It is plain DOM: the screen is
// not React's, it sits over React's root until something here lets it go.
// With no plugin there is no #sb-boot, and every function is a no-op.

const LEAVE_MS = 700;

function bootElement(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.getElementById("sb-boot");
}

/** Whether the boot screen is still up (and not already leaving). */
export function isBootScreenShowing(): boolean {
  const boot = bootElement();
  return !!boot && !boot.classList.contains("sbb-leaving");
}

/**
 * Keeps the boot screen up past boot.js's failsafe while some work is under
 * way (the OIDC callback's code exchange). Returns the release.
 */
export function holdBootScreen(): () => void {
  const boot = bootElement();
  if (!boot) return () => undefined;
  boot.dataset.holds = String(Number(boot.dataset.holds ?? 0) + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    boot.dataset.holds = String(Math.max(0, Number(boot.dataset.holds ?? 1) - 1));
  };
}

/**
 * Takes the boot screen down: the card lifts away and the backdrop fades
 * (boot.css), or it simply goes when `animate` is false.
 */
export function dismissBootScreen({ animate = true }: { animate?: boolean } = {}): void {
  const boot = bootElement();
  if (!boot) return;
  if (!animate) {
    boot.remove();
    return;
  }
  if (boot.classList.contains("sbb-leaving")) return;
  boot.classList.add("sbb-leaving");
  window.setTimeout(() => boot.remove(), LEAVE_MS);
}
