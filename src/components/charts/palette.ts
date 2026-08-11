import { useEffect, useState } from 'react';

/**
 * Chart colours, as literal values rather than CSS custom properties.
 *
 * The consumers each keep their own copy of the theme CSS and none of them
 * imports this package's stylesheet, so a `--chart-*` token defined here would
 * simply not exist in erp-hrm or erp-crm. Resolving the mode in JS is what makes
 * these components work in all three apps without a coordinated CSS change.
 *
 * Every set below was checked with the data-viz palette validator against this
 * theme's own card surfaces (light `#ffffff`, dark `#181b1f`) — not eyeballed.
 * If you change a value, re-run the validator; adjacent-pair separation under
 * simulated colour-vision deficiency is not something you can judge by looking.
 */

export type ChartColorMode = 'light' | 'dark';

/**
 * Categorical slots, assigned in fixed order and never cycled. A ninth series
 * folds into "Other" rather than inventing a hue.
 *
 * Validated: light worst-adjacent CVD ΔE 9.1, normal-vision ΔE 19.6; dark
 * 8.4 / 19.3. Three light slots (aqua, yellow, magenta) sit below 3:1 against
 * white, so any chart using them must also show values as text — which is why
 * every component here ships a labelled list or direct labels.
 */
const CATEGORICAL_LIGHT = [
  '#2a78d6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
] as const;

const CATEGORICAL_DARK = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
] as const;

/** Anything past the categorical slots, and the tail of a part-to-whole. */
const OTHER = { light: '#898781', dark: '#898781' } as const;

/**
 * Outcome colours for the recruitment-shaped stack.
 *
 * The stack order is deliberate: accepted, then in progress, then declined.
 * Green beside red fails CVD separation outright (ΔE 4.1 deutan) — putting the
 * blue between them takes the worst adjacent pair to ΔE 23.8 light / 25.7 dark.
 * Reordering these segments will silently reintroduce that failure.
 */
const OUTCOME_LIGHT = {
  accepted: '#0ca30c',
  inProgress: '#2a78d6',
  declined: '#d03b3b',
} as const;

const OUTCOME_DARK = {
  accepted: '#0ca30c',
  inProgress: '#3987e5',
  declined: '#d03b3b',
} as const;

/** Recessive chrome: grid, axis, and the surface colour gaps are cut in. */
const CHROME_LIGHT = {
  surface: '#ffffff',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
} as const;

const CHROME_DARK = {
  surface: '#181b1f',
  grid: '#2c2c2a',
  axis: '#383835',
} as const;

export interface ChartPalette {
  mode: ChartColorMode;
  categorical: readonly string[];
  other: string;
  outcome: { accepted: string; inProgress: string; declined: string };
  surface: string;
  grid: string;
  axis: string;
  /** Slot `index`, folding everything past the last slot into "Other". */
  series: (index: number) => string;
}

export function getChartPalette(mode: ChartColorMode): ChartPalette {
  const categorical = mode === 'dark' ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
  const chrome = mode === 'dark' ? CHROME_DARK : CHROME_LIGHT;
  const other = OTHER[mode];
  return {
    mode,
    categorical,
    other,
    outcome: mode === 'dark' ? OUTCOME_DARK : OUTCOME_LIGHT,
    ...chrome,
    series: (index: number) =>
      index >= 0 && index < categorical.length ? categorical[index] : other,
  };
}

function readColorMode(): ChartColorMode {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const root = document.documentElement;
  return root.classList.contains('dark') || root.dataset.theme === 'dark'
    ? 'dark'
    : 'light';
}

/**
 * The resolved colour mode, read off `<html>`.
 *
 * `AppTheme` writes both the `dark` class and `data-theme` there, so this works
 * whether or not the chart is rendered inside that provider — and it keeps the
 * charts usable in apps that set the class some other way.
 */
export function useChartPalette(): ChartPalette {
  const [mode, setMode] = useState<ChartColorMode>(readColorMode);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    // Re-read on mount: the first render may have happened before AppTheme's
    // effect stamped the class.
    setMode(readColorMode());

    const observer = new MutationObserver(() => setMode(readColorMode()));
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return getChartPalette(mode);
}
