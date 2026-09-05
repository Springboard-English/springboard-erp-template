import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Filter state that survives leaving and returning to a view.
 *
 * Backed by sessionStorage only. An earlier version also mirrored every field
 * into the URL query string, which is what the older lms/erp-crm tables do —
 * that was dropped deliberately. Keeping the two in sync meant per-field
 * encoding, precedence rules between URL and storage, and batching writes so
 * that filters applied in the same tick did not clobber each other's params.
 * The cost grew with every new filter and bought little: a filtered view is
 * working state, not something people link to.
 *
 * Per-tab lifetime is the right one here — filters come back while you are
 * working, and start clean in a new tab.
 */

const STORAGE_PREFIX = "view_filters";

export type FilterValue = string | number | boolean;

/**
 * A literal default (`""`, `0`, `false`) would otherwise pin the state to that
 * literal type, so widen it back to the base primitive — the state is a filter
 * value, not a constant.
 */
type Widen<T extends FilterValue> = T extends string
  ? string
  : T extends number
    ? number
    : boolean;

function storageKey(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

function readScope(scope: string): Record<string, FilterValue> {
  try {
    const raw = sessionStorage.getItem(storageKey(scope));
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, FilterValue>;
  } catch {
    // A malformed or unavailable store must never break the view.
    return {};
  }
}

function writeScopeValue(scope: string, key: string, value: FilterValue): void {
  try {
    const next = { ...readScope(scope), [key]: value };
    sessionStorage.setItem(storageKey(scope), JSON.stringify(next));
  } catch {
    // Private-mode or quota failures are non-fatal; the view still works, it
    // just will not remember.
  }
}

/** Drop every persisted filter for a scope — for "reset filters" actions. */
export function clearPersistedFilters(scope: string): void {
  try {
    sessionStorage.removeItem(storageKey(scope));
  } catch {
    // Ignore — nothing to clean up if storage is unavailable.
  }
}

function resolveInitial<T extends FilterValue>(
  scope: string,
  key: string,
  defaultValue: T,
): T {
  const stored = readScope(scope)[key];
  // Guard the type as well as the presence: a stored value written before a
  // filter changed shape must not be handed back as the wrong primitive.
  if (stored !== undefined && typeof stored === typeof defaultValue) {
    return stored as T;
  }

  return defaultValue;
}

/**
 * `useState` for a single filter field, persisted per `scope`.
 *
 * `scope` must distinguish separate instances of the same view — include the
 * view's mode and whether it is embedded, so the dashboard panel and the
 * standalone page keep their own filters.
 */
export function usePersistentFilter<T extends FilterValue>(
  scope: string,
  key: string,
  defaultValue: T,
): [Widen<T>, Dispatch<SetStateAction<Widen<T>>>] {
  type Value = Widen<T>;

  const [value, setValue] = useState<Value>(
    () => resolveInitial(scope, key, defaultValue) as unknown as Value,
  );

  // Mirrors the state so a functional update can be resolved *synchronously*.
  // Writing from inside a `setValue` updater would be wrong on two counts:
  // React defers updaters to the render phase, and it may run them twice under
  // StrictMode — so the writes would be both late and duplicated.
  const valueRef = useRef(value);
  valueRef.current = value;

  const setPersistentValue = useCallback<Dispatch<SetStateAction<Value>>>(
    (next) => {
      const resolved =
        typeof next === "function"
          ? (next as (current: Value) => Value)(valueRef.current)
          : next;

      valueRef.current = resolved;
      setValue(resolved);
      writeScopeValue(scope, key, resolved);
    },
    [key, scope],
  );

  return [value, setPersistentValue];
}

/**
 * As `usePersistentFilter`, but for a field whose type is a union of string
 * literals (`"all" | "true" | "false"` and friends).
 *
 * The plain hook widens a literal default to `string`, which such a field
 * cannot accept. Passing the permitted values keeps the narrow type *and*
 * validates what comes back out of storage — so a value persisted before the
 * options changed is discarded rather than restored as an illegal member.
 */
export function usePersistentEnumFilter<T extends string>(
  scope: string,
  key: string,
  defaultValue: T,
  allowed: readonly T[],
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = readScope(scope)[key];
    return typeof stored === "string" && (allowed as readonly string[]).includes(stored)
      ? (stored as T)
      : defaultValue;
  });

  const valueRef = useRef(value);
  valueRef.current = value;

  const setPersistentValue = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const resolved =
        typeof next === "function"
          ? (next as (current: T) => T)(valueRef.current)
          : next;

      valueRef.current = resolved;
      setValue(resolved);
      writeScopeValue(scope, key, resolved);
    },
    [key, scope],
  );

  return [value, setPersistentValue];
}

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * A filter backed by a `SearchableSelect`, persisting the **label** as well as
 * the key.
 *
 * The select needs a `{ value, label }` pair to render anything other than its
 * placeholder, and a label cannot be derived from a key without another network
 * round trip. Persisting only the key therefore restored the filter — the query
 * really was filtered — while the panel showed "All employees", which reads as
 * *no filter applied*. Worse than losing the filter, because it is untrue.
 *
 * Returns the same four values the call sites already used, so the JSX is
 * unchanged; only the two `useState`/`usePersistentFilter` declarations collapse
 * into one call.
 */
export function usePersistentOptionFilter(
  scope: string,
  key: string,
): [
  string,
  (next: string) => void,
  FilterOption | undefined,
  (option: FilterOption | null) => void,
] {
  const [value, setValueRaw] = usePersistentFilter(scope, key, "");
  const [label, setLabel] = usePersistentFilter(scope, `${key}__label`, "");

  const setValue = useCallback(
    (next: string) => {
      setValueRaw(next);
      // A key without its label would render as the placeholder, so drop the
      // stale label rather than leave the two disagreeing.
      if (!next) {
        setLabel("");
      }
    },
    [setLabel, setValueRaw],
  );

  const setOption = useCallback(
    (option: FilterOption | null) => {
      if (!option?.value) {
        setValueRaw("");
        setLabel("");
        return;
      }
      setValueRaw(option.value);
      setLabel(option.label);
    },
    [setLabel, setValueRaw],
  );

  const option = value && label ? { value, label } : undefined;

  return [value, setValue, option, setOption];
}
