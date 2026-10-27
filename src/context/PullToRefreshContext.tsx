import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export type RefreshHandler = () => unknown;

interface PullToRefreshContextValue {
  register: (handler: RefreshHandler) => () => void;
}

const PullToRefreshContext = createContext<PullToRefreshContextValue | null>(null);

const MAX_PULL = 120;
const TRIGGER_AT = 64;
const HOLD_AT = 48;

/**
 * Lets a page register its refresh so a downward pull from the top of the page
 * runs it on a touch screen. `DashboardLayout` mounts one; without a
 * registered handler a pull does nothing and the browser keeps its own.
 */
export function PullToRefreshProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<RefreshHandler | null>(null);
  const [enabled, setEnabled] = useState(false);

  const register = useCallback((handler: RefreshHandler) => {
    handlerRef.current = handler;
    setEnabled(true);
    return () => {
      if (handlerRef.current !== handler) return;
      handlerRef.current = null;
      setEnabled(false);
    };
  }, []);

  const value = useMemo(() => ({ register }), [register]);

  return (
    <PullToRefreshContext.Provider value={value}>
      {children}
      {enabled ? <PullIndicator handlerRef={handlerRef} /> : null}
    </PullToRefreshContext.Provider>
  );
}

/**
 * Registers this page's refresh for pull-to-refresh while the page is mounted.
 * Pass `null` to register nothing. A no-op outside a `PullToRefreshProvider`.
 */
export function usePullToRefresh(onRefresh: RefreshHandler | null) {
  const context = useContext(PullToRefreshContext);
  const latest = useRef(onRefresh);
  latest.current = onRefresh;
  const active = Boolean(onRefresh);

  useEffect(() => {
    if (!context || !active) return;
    return context.register(() => latest.current?.());
  }, [context, active]);
}

/** True when the touch started where nothing above it can still scroll up. */
function startsAtTop(target: EventTarget | null): boolean {
  if (window.scrollY > 0) return false;
  let node = target instanceof Element ? target : null;
  // A pull inside a dialog, sheet or popover belongs to that layer, not the page.
  if (node?.closest('[role="dialog"], [data-radix-popper-content-wrapper]')) {
    return false;
  }
  while (node && node !== document.body) {
    if (node.scrollTop > 0) return false;
    node = node.parentElement;
  }
  return true;
}

/** The pill that follows the finger down and spins while the refresh runs. */
function PullIndicator({
  handlerRef,
}: {
  handlerRef: MutableRefObject<RefreshHandler | null>;
}) {
  const { t } = useI18n();
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const distanceRef = useRef(0);
  const refreshingRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overscrollBehaviorY;
    // Stops the browser's own pull-to-reload, which would drop the in-memory session.
    root.style.overscrollBehaviorY = "contain";

    const move = (next: number) => {
      distanceRef.current = next;
      setDistance(next);
    };

    const onStart = (event: TouchEvent) => {
      if (refreshingRef.current || event.touches.length !== 1) return;
      startY.current = startsAtTop(event.target) ? event.touches[0].clientY : null;
    };

    const onMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      const dy = event.touches[0].clientY - startY.current;
      // Halved so the pill trails the finger, which reads as resistance.
      move(dy > 0 ? Math.min(dy * 0.5, MAX_PULL) : 0);
    };

    const onEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      if (distanceRef.current < TRIGGER_AT || !handlerRef.current) {
        move(0);
        return;
      }
      refreshingRef.current = true;
      setRefreshing(true);
      move(HOLD_AT);
      void Promise.resolve()
        .then(() => handlerRef.current?.())
        .catch(() => undefined)
        .finally(() => {
          refreshingRef.current = false;
          setRefreshing(false);
          move(0);
        });
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      root.style.overscrollBehaviorY = previous;
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [handlerRef]);

  if (distance === 0 && !refreshing) return null;

  const armed = distance >= TRIGGER_AT;
  const label = refreshing
    ? t("pullToRefresh.refreshing")
    : armed
      ? t("pullToRefresh.release")
      : t("pullToRefresh.pull");

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-[env(safe-area-inset-top)]",
        startY.current === null && "transition-transform duration-200",
      )}
      style={{ transform: `translateY(${distance - 32}px)` }}
    >
      <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md">
        <RefreshCw
          className={cn("size-4", refreshing && "animate-spin", armed && "text-primary")}
          style={refreshing ? undefined : { transform: `rotate(${distance * 3}deg)` }}
        />
        {label}
      </div>
    </div>
  );
}
