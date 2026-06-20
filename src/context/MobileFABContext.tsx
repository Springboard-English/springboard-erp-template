import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { cn } from "../lib/utils";

export interface MobileFABConfig {
  onClick: () => void;
  label?: string;
}

export interface MobileFABContextValue {
  fab: MobileFABConfig | null;
  setFAB: (fab: MobileFABConfig | null) => void;
}

const MobileFABContext = createContext<MobileFABContextValue>({
  fab: null,
  setFAB: () => {},
});

export function MobileFABProvider({ children }: { children: ReactNode }) {
  const [fab, setFABState] = useState<MobileFABConfig | null>(null);
  const setFAB = useCallback(
    (nextFAB: MobileFABConfig | null) => setFABState(nextFAB),
    [],
  );

  return (
    <MobileFABContext.Provider value={{ fab, setFAB }}>
      {children}
    </MobileFABContext.Provider>
  );
}

export function useMobileFABContext() {
  return useContext(MobileFABContext);
}

export function useMobileFAB(onClick: (() => void) | null, label?: string) {
  const { setFAB } = useContext(MobileFABContext);
  const onClickRef = useRef<(() => void) | null>(null);
  onClickRef.current = onClick;
  const enabled = Boolean(onClick);

  useEffect(() => {
    if (!enabled) {
      setFAB(null);
      return;
    }

    const stableHandler = () => onClickRef.current?.();
    setFAB({ onClick: stableHandler, label });
    return () => setFAB(null);
  }, [enabled, label, setFAB]);
}

export interface MobileFloatingActionButtonProps {
  className?: string;
  icon?: ReactNode;
}

export function MobileFloatingActionButton({
  className,
  icon,
}: MobileFloatingActionButtonProps) {
  const { fab } = useMobileFABContext();
  const { t } = useI18n();

  if (!fab) {
    return null;
  }

  return (
    <button
      type="button"
      className={cn(
        "fixed bottom-20 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 md:hidden",
        className,
      )}
      onClick={fab.onClick}
      aria-label={fab.label ?? t("common.create")}
    >
      {icon ?? <Plus className="size-6" />}
    </button>
  );
}
