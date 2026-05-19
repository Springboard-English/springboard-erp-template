import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
}

const PendingChangesContext = createContext<PendingChangesContextValue | undefined>(
  undefined,
);

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

  const value = useMemo<PendingChangesContextValue>(
    () => ({
      globalPendingCount,
      globalPendingItems,
      sectionPendingCounts,
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
    }),
    [
      resolvedActiveSection,
      activeSectionRegistration,
      globalPendingCount,
      globalPendingItems,
      sectionPendingCounts,
      handleCancelActiveSection,
      handleSaveActiveSection,
      registerSection,
      unregisterSection,
    ],
  );

  return (
    <PendingChangesContext.Provider value={value}>
      {children}
    </PendingChangesContext.Provider>
  );
}

export function usePendingChanges() {
  const context = useContext(PendingChangesContext);
  if (!context) {
    throw new Error("usePendingChanges must be used within a PendingChangesProvider");
  }
  return context;
}
