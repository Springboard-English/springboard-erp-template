import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { MessageCircleWarning } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useI18n } from "@/context/I18nContext";
import AnnotationEditor from "./AnnotationEditor";
import CaptureBar from "./CaptureBar";
import ReportDialog, { MAX_REPORT_EVIDENCE, type ReportProblemCategory } from "./ReportDialog";

/** Turns on "Report a problem" for an app. The app decides who may report through `enabled`. */
export interface ReportProblemConfig {
  /** The app's name as it appears in the report's context, e.g. "lms" or "erp-hrm". */
  app: string;
  /** The Area preselected in the form. Defaults to "lms" for the LMS and "process" elsewhere. */
  defaultCategory?: ReportProblemCategory;
  /** False hides every entry point (for example, for anyone but employees). Defaults to true. */
  enabled?: boolean;
}

/** What `useReportProblem` hands an entry point. */
export interface ReportProblemContextValue {
  app: string;
  /** Opens the report form. */
  open: () => void;
}

/**
 * The flow is three phases, not one dialog. `capturing` renders nothing but the
 * floating bar so the app stays usable while the reporter goes to the screen
 * that shows the problem.
 */
type Phase = "idle" | "form" | "capturing" | "annotating";

const ReportProblemContext = createContext<ReportProblemContextValue | null>(null);

/** The Area a report starts on when the app names none. */
export function defaultReportCategory(app: string): ReportProblemCategory {
  return app === "lms" ? "lms" : "process";
}

/** The report's context line: "<app> · <current path>". */
export function reportContextLabel(app: string, pathname: string): string {
  return `${app} · ${pathname || "/"}`;
}

export interface ReportProblemProviderProps extends ReportProblemConfig {
  children?: ReactNode;
}

/**
 * Owns the report flow (form, screenshot mode, mark-up) and lets any
 * `ReportProblemButton` or `useReportProblem().open` below start it.
 * `DashboardLayout` mounts one itself when given `reportProblem`; mount this
 * directly only in a shell that is not `DashboardLayout`. Needs a router above.
 */
export function ReportProblemProvider({
  app,
  defaultCategory,
  enabled = true,
  children,
}: ReportProblemProviderProps) {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [pendingCapture, setPendingCapture] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);

  const open = useCallback(() => setPhase("form"), []);
  const closeAll = useCallback(() => {
    setPhase("idle");
    setPendingCapture(null);
    setEvidence([]);
  }, []);

  const value = useMemo<ReportProblemContextValue | null>(
    () => (enabled ? { app, open } : null),
    [app, enabled, open],
  );

  return (
    <ReportProblemContext.Provider value={value}>
      {children}
      {enabled ? (
        <>
          {phase === "capturing" ? (
            <CaptureBar
              onCaptured={(dataUrl) => {
                setPendingCapture(dataUrl);
                setPhase("annotating");
              }}
              onCancel={() => setPhase("form")}
            />
          ) : null}

          {phase === "annotating" && pendingCapture ? (
            <AnnotationEditor
              image={pendingCapture}
              onCancel={() => {
                setPendingCapture(null);
                setPhase("form");
              }}
              onSave={(edited) => {
                setEvidence((previous) =>
                  previous.length >= MAX_REPORT_EVIDENCE ? previous : [...previous, edited],
                );
                setPendingCapture(null);
                setPhase("form");
              }}
            />
          ) : null}

          <ReportDialog
            open={phase === "form"}
            onClose={closeAll}
            contextLabel={reportContextLabel(app, location.pathname)}
            defaultCategory={defaultCategory ?? defaultReportCategory(app)}
            evidence={evidence}
            onEvidenceChange={setEvidence}
            onRequestCapture={() => setPhase("capturing")}
          />
        </>
      ) : null}
    </ReportProblemContext.Provider>
  );
}

/** The nearest report flow, or null when none is mounted or it is disabled. */
export function useReportProblem(): ReportProblemContextValue | null {
  return useContext(ReportProblemContext);
}

export type ReportProblemButtonProps = Omit<ComponentProps<typeof Button>, "children" | "onClick">;

/**
 * The header's "Report a problem": a ghost icon button, like `GuideIconButton`.
 * Renders nothing outside an enabled `ReportProblemProvider`.
 */
export function ReportProblemButton({
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: ReportProblemButtonProps) {
  const { t } = useI18n();
  const report = useReportProblem();
  if (!report) return null;
  const label = t("report.open");
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
      aria-label={label}
      title={label}
      onClick={report.open}
      {...props}
    >
      <MessageCircleWarning className="size-4" aria-hidden="true" />
    </Button>
  );
}

export interface ReportProblemMenuButtonProps extends ReportProblemButtonProps {
  /** Runs before the form opens, e.g. to close the menu the button sits in. */
  onBeforeOpen?: () => void;
}

/**
 * The phone menu's "Report a problem": a full-width outline button with its
 * label. Renders nothing outside an enabled `ReportProblemProvider`.
 */
export function ReportProblemMenuButton({
  className,
  variant = "outline",
  onBeforeOpen,
  ...props
}: ReportProblemMenuButtonProps) {
  const { t } = useI18n();
  const report = useReportProblem();
  if (!report) return null;
  return (
    <Button
      type="button"
      variant={variant}
      className={cn("w-full", className)}
      onClick={() => {
        onBeforeOpen?.();
        report.open();
      }}
      {...props}
    >
      <MessageCircleWarning className="size-4" aria-hidden="true" />
      {t("report.open")}
    </Button>
  );
}
