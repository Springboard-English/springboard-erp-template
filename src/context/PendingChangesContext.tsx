import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
// Relative: these types reach the published .d.ts, where `@/` does not resolve.
import type {
  AnyPendingBarAction,
  PendingChangeItem as PendingBarItem,
} from "../components/PendingChangesBar";

/**
 * One form's unsaved work, or one table's ticked rows, as it registers with
 * `usePendingChangesSource`. Each call is its own entry, so a section may hold
 * several forms; `section` only groups rows in the Review list.
 */
export interface PendingChangesSource {
  /** Groups this form's rows in the Review list and counts toward `sectionPendingCounts`. */
  section?: string;
  /** What is unsaved, one row each. Empty means nothing pending: the source is not registered. */
  items: PendingBarItem[];
  /** Persists everything in `items`. Report a failure yourself; a throw is caught and the rows stay up. */
  save?: () => void | Promise<void>;
  /** Puts the form back to what is stored, or clears the ticks. */
  discard?: () => void;
  saving?: boolean;
  /**
   * Why this cannot be saved yet. Save stays enabled and, when pressed, shows
   * this in the bar and saves nothing; Discard still works.
   */
  blocked?: string | null;
  /**
   * Selection actions mode: ticked rows waiting for these buttons instead of
   * Save. Shown only while no source has unsaved edits; `items` name the rows.
   */
  actions?: readonly AnyPendingBarAction[];
  /** Replaces "N unsaved changes" in actions mode, e.g. "3 people selected". */
  countLabel?: string;
  /** The bar's labels, used only while this is the one source on the bar. */
  saveLabel?: string;
  cancelLabel?: string;
  keyLabel?: string;
  valueLabel?: string;
}

/** What the bar shows: the edits of every source, or one selection when nothing is unsaved. */
export type PendingChangesMode = "idle" | "edit" | "selection";

export interface PendingChangeItem {
  section: string;
  key: string;
  value: string;
}

export interface PendingSectionRegistration {
  count: number;
  items: Array<{ key: string; value: string }>;
  onSave?: () => void | Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
  disabled?: boolean;
  keyLabel?: string;
  valueLabel?: string;
}

function areRegistrationItemsEqual(
  left: Array<{ key: string; value: string }>,
  right: Array<{ key: string; value: string }>,
): boolean {
  if (left.length !== right.length) {
    return false;
  }
  for (let index = 0; index < left.length; index += 1) {
    if (
      left[index]?.key !== right[index]?.key
      || left[index]?.value !== right[index]?.value
    ) {
      return false;
    }
  }
  return true;
}

function areRegistrationsEqual(
  left: PendingSectionRegistration | undefined,
  right: PendingSectionRegistration,
): boolean {
  if (!left) {
    return false;
  }
  return left.count === right.count
    && left.saving === right.saving
    && left.disabled === right.disabled
    && left.keyLabel === right.keyLabel
    && left.valueLabel === right.valueLabel
    && left.onSave === right.onSave
    && left.onCancel === right.onCancel
    && areRegistrationItemsEqual(left.items, right.items);
}

export interface PendingChangesContextValue {
  globalPendingCount: number;
  globalPendingItems: PendingChangeItem[];
  sectionPendingCounts: Record<string, number>;
  activeSection: string | null;
  activeSectionPendingCount: number;
  activeSectionSaving: boolean;
  activeSectionDisabled: boolean;
  activeSectionKeyLabel: string;
  activeSectionValueLabel: string;
  setActiveSection: (section: string | null) => void;
  registerSection: (
    section: string,
    registration: PendingSectionRegistration,
  ) => void;
  unregisterSection: (section: string) => void;
  handleSaveActiveSection: () => void | Promise<void>;
  handleCancelActiveSection: () => void;
  // The merged bar below covers sources and `registerSection` sections alike.
  // The `global*`/`activeSection*` fields above still read sections only.
  /** Edit, selection, or nothing on the bar. */
  mode: PendingChangesMode;
  /** The bar's count: every listed source's rows (a section's `count`). */
  pendingCount: number;
  /** The bar's Review rows, each with its source's `section`. */
  pendingItems: PendingBarItem[];
  /** True while Save all runs or any listed source is saving. */
  saving: boolean;
  /** The first listed source's `blocked`, or null. */
  blocked: string | null;
  /** True when a listed `registerSection` section is `disabled`. */
  disabled: boolean;
  /** The selection's buttons in selection mode, else undefined. */
  actions: readonly AnyPendingBarAction[] | undefined;
  countLabel: string | undefined;
  /** Labels of the one listed source, when there is exactly one. */
  soleSource: Pick<PendingChangesSource, "saveLabel" | "cancelLabel" | "keyLabel" | "valueLabel"> | null;
  /**
   * Saves every source with edits in registration order, one after another.
   * Resolves false, saving nothing, when one is blocked, and false after
   * trying them all when one threw.
   */
  saveAll: () => Promise<boolean>;
  /** Discards every listed source: all edits, or the selection. */
  discardAll: () => void;
}

/** Registers and drops sources; stable, so a registering form never re-renders because of it. */
interface PendingChangesRegistry {
  register: (id: string, source: PendingChangesSource) => void;
  unregister: (id: string) => void;
}

const PendingChangesContext = createContext<PendingChangesContextValue | undefined>(
  undefined,
);
const PendingChangesRegistryContext = createContext<PendingChangesRegistry | null>(null);

function areItemListsEqual(left: readonly PendingBarItem[], right: readonly PendingBarItem[]): boolean {
  return left.length === right.length
    && left.every((item, index) =>
      item.key === right[index]?.key
      && item.value === right[index]?.value
      && item.section === right[index]?.section);
}

function areActionListsEqual(
  left: readonly AnyPendingBarAction[] | undefined,
  right: readonly AnyPendingBarAction[] | undefined,
): boolean {
  if (!left || !right) return left === right;
  return left.length === right.length
    && left.every((action, index) => {
      const other = right[index];
      return action.id === other?.id
        && action.label === other.label
        && action.variant === other.variant
        && action.disabled === other.disabled
        && action.overflow === other.overflow
        && Boolean(action.confirm) === Boolean(other.confirm);
    });
}

/** Whether two registrations of a source draw the same bar; callbacks are ignored. */
function areSourcesEqual(left: PendingChangesSource | undefined, right: PendingChangesSource): boolean {
  if (!left) return false;
  return left.section === right.section
    && left.saving === right.saving
    && (left.blocked ?? null) === (right.blocked ?? null)
    && left.countLabel === right.countLabel
    && left.saveLabel === right.saveLabel
    && left.cancelLabel === right.cancelLabel
    && left.keyLabel === right.keyLabel
    && left.valueLabel === right.valueLabel
    && areItemListsEqual(left.items, right.items)
    && areActionListsEqual(left.actions, right.actions);
}

/** One entry on the merged bar: a source, or a `registerSection` section adapted to one. */
interface BarEntry {
  /** Reads the source's latest registration, so a save never runs a stale closure. */
  latest: () => PendingChangesSource;
  source: PendingChangesSource;
  count: number;
  disabled: boolean;
}

/**
 * Holds every form's unsaved work for one bar per window. Forms register with
 * `usePendingChangesSource` (per call; Save all, blocked, selection actions)
 * or the older `registerSection` (per section name). Render
 * `GlobalPendingChangesBar` inside it to draw the merged bar.
 */
export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, PendingSectionRegistration>>(
    {},
  );
  const [persistedSectionPendingCounts, setPersistedSectionPendingCounts] = useState<
    Record<string, number>
  >({});

  const registerSection = useCallback(
    (section: string, registration: PendingSectionRegistration) => {
      const normalizedSection = section.trim();
      if (!normalizedSection) {
        return;
      }
      setPersistedSectionPendingCounts((current) => {
        const nextCount = registration.count;
        if (nextCount <= 0) {
          if (!(normalizedSection in current)) {
            return current;
          }
          const next = { ...current };
          delete next[normalizedSection];
          return next;
        }
        if (current[normalizedSection] === nextCount) {
          return current;
        }
        return {
          ...current,
          [normalizedSection]: nextCount,
        };
      });
      setSections((current) => {
        const existing = current[normalizedSection];
        if (areRegistrationsEqual(existing, registration)) {
          return current;
        }
        return {
          ...current,
          [normalizedSection]: registration,
        };
      });
    },
    [],
  );

  const unregisterSection = useCallback((section: string) => {
    const normalizedSection = section.trim();
    if (!normalizedSection) {
      return;
    }
    setSections((current) => {
      if (!(normalizedSection in current)) {
        return current;
      }
      const next = { ...current };
      delete next[normalizedSection];
      return next;
    });
  }, []);

  const globalPendingItems = useMemo(() => {
    return Object.entries(sections).flatMap(([section, registration]) =>
      registration.items.map((item) => ({
        section,
        key: item.key,
        value: item.value,
      })),
    );
  }, [sections]);

  const globalPendingCount = useMemo(
    () =>
      Object.values(sections).reduce(
        (total, registration) => total + registration.count,
        0,
      ),
    [sections],
  );
  const sectionPendingCounts = useMemo(() => {
    const liveSectionCounts = Object.entries(sections).reduce<Record<string, number>>(
      (result, [section, registration]) => {
        result[section] = registration.count;
        return result;
      },
      {},
    );

    return {
      ...persistedSectionPendingCounts,
      ...liveSectionCounts,
    };
  }, [persistedSectionPendingCounts, sections]);

  const fallbackSection = useMemo(
    () =>
      Object.entries(sections).find(([, registration]) => registration.count > 0)?.[0]
        ?? null,
    [sections],
  );
  const resolvedActiveSection = activeSection && sections[activeSection]
    ? activeSection
    : fallbackSection;
  const activeSectionRegistration = resolvedActiveSection
    ? sections[resolvedActiveSection] ?? null
    : null;

  const handleSaveActiveSection = useCallback(() => {
    if (!activeSectionRegistration?.onSave) {
      return;
    }
    return activeSectionRegistration.onSave();
  }, [activeSectionRegistration]);

  const handleCancelActiveSection = useCallback(() => {
    activeSectionRegistration?.onCancel?.();
  }, [activeSectionRegistration]);

  // Sources, keyed per call of `usePendingChangesSource`. State holds what the
  // bar draws and changes only when that does; the ref holds every latest
  // registration, so callbacks are current without a re-render per keystroke.
  const [sources, setSources] = useState<ReadonlyMap<string, PendingChangesSource>>(
    () => new Map(),
  );
  const latestSourcesRef = useRef(new Map<string, PendingChangesSource>());
  const [savingAll, setSavingAll] = useState(false);

  const registerSource = useCallback((id: string, source: PendingChangesSource) => {
    latestSourcesRef.current.set(id, source);
    setSources((current) => {
      if (areSourcesEqual(current.get(id), source)) return current;
      const next = new Map(current);
      next.set(id, source);
      return next;
    });
  }, []);
  const unregisterSource = useCallback((id: string) => {
    latestSourcesRef.current.delete(id);
    setSources((current) => {
      if (!current.has(id)) return current;
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }, []);
  const registry = useMemo<PendingChangesRegistry>(
    () => ({ register: registerSource, unregister: unregisterSource }),
    [registerSource, unregisterSource],
  );

  const entries = useMemo<BarEntry[]>(() => {
    const fromSections = Object.entries(sections)
      .filter(([, registration]) => registration.count > 0)
      .map(([section, registration]): BarEntry => {
        const source: PendingChangesSource = {
          section,
          items: registration.items.map((item) => ({ section, ...item })),
          save: registration.onSave,
          discard: registration.onCancel,
          saving: registration.saving,
          keyLabel: registration.keyLabel,
          valueLabel: registration.valueLabel,
        };
        return { latest: () => source, source, count: registration.count, disabled: Boolean(registration.disabled) };
      });
    const fromSources = Array.from(sources.entries()).map(([id, source]): BarEntry => ({
      latest: () => latestSourcesRef.current.get(id) ?? source,
      source,
      count: source.items.length,
      disabled: false,
    }));
    return [...fromSections, ...fromSources];
  }, [sections, sources]);

  // Edits win the bar; a selection's actions show only when nothing is unsaved.
  const { selection, listed, mode } = useMemo(() => {
    const edits = entries.filter((entry) => !entry.source.actions);
    const picked = edits.length ? null : (entries.find((entry) => entry.source.actions) ?? null);
    return {
      selection: picked,
      listed: picked ? [picked] : edits,
      mode: (picked ? "selection" : edits.length ? "edit" : "idle") as PendingChangesMode,
    };
  }, [entries]);
  const blocked = listed.map((entry) => entry.source.blocked).find(Boolean) ?? null;

  const saveAll = useCallback(async () => {
    if (mode !== "edit" || blocked) return false;
    let ok = true;
    setSavingAll(true);
    try {
      for (const entry of listed) {
        try {
          await entry.latest().save?.();
        } catch {
          // The form reports its own failure; its rows stay on the bar.
          ok = false;
        }
      }
    } finally {
      setSavingAll(false);
    }
    return ok;
  }, [blocked, listed, mode]);

  const discardAll = useCallback(() => {
    for (const entry of listed) entry.latest().discard?.();
  }, [listed]);

  // Each action runs the selection's latest callback, not the one first drawn.
  const selectionActions = useMemo(() => {
    if (!selection) return undefined;
    return selection.source.actions?.map((action) => ({
      ...action,
      onRun: (prepared: unknown) =>
        (selection.latest().actions?.find((candidate) => candidate.id === action.id) ?? action).onRun(prepared),
    }));
  }, [selection]);

  const merged = useMemo(() => {
    const sole = listed.length === 1 ? listed[0].source : null;
    return {
      mode,
      pendingCount: listed.reduce((total, entry) => total + entry.count, 0),
      pendingItems: listed.flatMap((entry) =>
        entry.source.items.map((item) => ({ section: entry.source.section, ...item })),
      ),
      saving: savingAll || listed.some((entry) => Boolean(entry.source.saving)),
      blocked,
      disabled: listed.some((entry) => entry.disabled),
      actions: selectionActions,
      countLabel: selection?.source.countLabel,
      soleSource: sole
        ? {
            saveLabel: sole.saveLabel,
            cancelLabel: sole.cancelLabel,
            keyLabel: sole.keyLabel,
            valueLabel: sole.valueLabel,
          }
        : null,
    };
  }, [blocked, listed, mode, savingAll, selection, selectionActions]);

  // A section's badge counts every form registered under its name.
  const sourceSectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sources.forEach((source) => {
      if (!source.section || source.actions) return;
      counts[source.section] = (counts[source.section] ?? 0) + source.items.length;
    });
    return counts;
  }, [sources]);
  const allSectionPendingCounts = useMemo(() => {
    if (Object.keys(sourceSectionCounts).length === 0) return sectionPendingCounts;
    const next = { ...sectionPendingCounts };
    Object.entries(sourceSectionCounts).forEach(([section, count]) => {
      next[section] = (sectionPendingCounts[section] ?? 0) + count;
    });
    return next;
  }, [sectionPendingCounts, sourceSectionCounts]);

  const value = useMemo<PendingChangesContextValue>(
    () => ({
      globalPendingCount,
      globalPendingItems,
      sectionPendingCounts: allSectionPendingCounts,
      activeSection: resolvedActiveSection,
      activeSectionPendingCount: activeSectionRegistration?.count ?? 0,
      activeSectionSaving: activeSectionRegistration?.saving ?? false,
      activeSectionDisabled: activeSectionRegistration?.disabled ?? false,
      activeSectionKeyLabel: activeSectionRegistration?.keyLabel ?? "Name",
      activeSectionValueLabel: activeSectionRegistration?.valueLabel ?? "Changed",
      setActiveSection,
      registerSection,
      unregisterSection,
      handleSaveActiveSection,
      handleCancelActiveSection,
      ...merged,
      saveAll,
      discardAll,
    }),
    [
      resolvedActiveSection,
      activeSectionRegistration,
      globalPendingCount,
      globalPendingItems,
      allSectionPendingCounts,
      merged,
      saveAll,
      discardAll,
      handleCancelActiveSection,
      handleSaveActiveSection,
      registerSection,
      unregisterSection,
    ],
  );

  return (
    <PendingChangesRegistryContext.Provider value={registry}>
      <PendingChangesContext.Provider value={value}>
        {children}
      </PendingChangesContext.Provider>
    </PendingChangesRegistryContext.Provider>
  );
}

/** The provider's state: the merged bar's values and the per-section registry. */
export function usePendingChanges() {
  const context = useContext(PendingChangesContext);
  if (!context) {
    throw new Error("usePendingChanges must be used within a PendingChangesProvider");
  }
  return context;
}

/**
 * Puts one form's unsaved work, or one table's ticked rows, on the shared bar.
 * Call it every render with the current state, or null when there is nothing;
 * a source with no `items` is dropped, so the bar goes the moment the form
 * matches what is stored. Each call is its own entry, so two forms in one
 * section never collide. Callbacks are read from the latest render.
 */
export function usePendingChangesSource(source: PendingChangesSource | null): void {
  const id = useId();
  const registry = useContext(PendingChangesRegistryContext);
  if (!registry) {
    throw new Error(
      "usePendingChangesSource must be used within a PendingChangesProvider; without one, unsaved work has no Save button.",
    );
  }
  const active = source && source.items.length > 0 ? source : null;
  // Every render: the provider keeps the latest callbacks and re-renders only when the bar changes.
  useEffect(() => {
    if (active) registry.register(id, active);
    else registry.unregister(id);
  });
  useEffect(() => () => registry.unregister(id), [registry, id]);
}
