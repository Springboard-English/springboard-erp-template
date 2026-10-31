import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, CircleHelp, Paperclip, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/context/I18nContext";
import type {
  FeedbackTicketPriority as TicketPriority,
  FeedbackTicketReportType as ReportType,
} from "../../api_calls/feedbackTickets";
import type { FormSchema, FormValues } from "../forms/schema";
import { SchemaFormDialog } from "../forms/SchemaFormDialog";
import { useSchemaForm } from "../forms/useSchemaForm";
import { submitReport } from "./submitReport";

/** An "Area" a reporter can pick. `feature` is not one: a feature request is a report type. */
export type ReportProblemCategory = "lms" | "access_login" | "process" | "content_data";

/** The most screenshots and attachments one report carries. */
export const MAX_REPORT_EVIDENCE = 5;
/** The API's per-file limit for a ticket attachment. */
export const MAX_REPORT_ATTACHMENT_BYTES = 10 * 1024 * 1024;
/** The image types the attachment picker accepts. */
export const REPORT_ATTACHMENT_TYPES = ["image/png", "image/jpeg"] as const;

/** The dialog tab that holds the screenshots. */
const EVIDENCE_TAB = 1;

/** Whether a picked file may be attached: a PNG or JPEG of at most 10 MB. */
export function isAcceptedReportAttachment(file: Pick<File, "type" | "size">): boolean {
  return (
    (REPORT_ATTACHMENT_TYPES as readonly string[]).includes(file.type) &&
    file.size > 0 &&
    file.size <= MAX_REPORT_ATTACHMENT_BYTES
  );
}

/** The last eight characters of a ticket key, as shown to the reporter. */
function shortReportRef(id: string): string {
  return id.length <= 8 ? id : id.slice(-8);
}

/** Reads a picked file into a data URL. */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("The file could not be read."));
    reader.readAsDataURL(file);
  });
}

const REPORT_TYPES: Array<{ value: ReportType; key: string }> = [
  { value: "bug", key: "report.typeBug" },
  { value: "feature", key: "report.typeFeature" },
  { value: "other", key: "report.typeOther" },
];

const PRIORITIES: Array<{ value: TicketPriority; key: string }> = [
  { value: "high", key: "report.priorityHigh" },
  { value: "medium", key: "report.priorityMedium" },
  { value: "low", key: "report.priorityLow" },
];

const CATEGORIES: Array<{ value: ReportProblemCategory; key: string }> = [
  { value: "lms", key: "report.categoryLms" },
  { value: "access_login", key: "report.categoryAccess" },
  { value: "process", key: "report.categoryProcess" },
  { value: "content_data", key: "report.categoryContent" },
];

export interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  /** Where it is reported from, shown in the header and appended to the description. */
  contextLabel: string;
  /** The Area preselected each time the form opens. */
  defaultCategory?: ReportProblemCategory;
  evidence: string[];
  onEvidenceChange: (next: string[]) => void;
  /** Hides the dialog for screenshot mode; the caller draws the capture bar. */
  onRequestCapture: () => void;
}

/**
 * The report form on the shared schema dialog: type, Area, priority, summary
 * and details on one tab, up to five screenshots on the next. Sending uploads
 * the screenshots, files the ticket and shows its reference.
 */
export default function ReportDialog({
  open,
  onClose,
  contextLabel,
  defaultCategory = "process",
  evidence,
  onEvidenceChange,
  onRequestCapture,
}: ReportDialogProps) {
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  // Set before screenshot mode, so the dialog comes back on the capture just taken.
  const [initialTab, setInitialTab] = useState(0);

  const options = (items: Array<{ value: string; key: string }>) =>
    items.map((item) => ({ value: item.value, label: t(item.key) }));
  // Keyed on the locale: `t` is a new function each render, and a new schema clears the form.
  const schema = useMemo<FormSchema>(
    () => ({
      columns: 3,
      sections: [{ id: "report" }],
      fields: [
        {
          name: "reportType",
          label: t("report.typeLabel"),
          type: "choice",
          required: true,
          options: options(REPORT_TYPES),
          span: "full",
        },
        {
          name: "category",
          label: t("report.categoryLabel"),
          type: "choice",
          display: "select",
          required: true,
          options: options(CATEGORIES),
        },
        {
          name: "priority",
          label: t("report.priorityLabel"),
          type: "choice",
          required: true,
          options: options(PRIORITIES),
          span: 2,
        },
        {
          name: "summary",
          label: t("report.summaryLabel"),
          type: "text",
          required: true,
          maxLength: 200,
          placeholder: t("report.summaryPlaceholder"),
          span: "full",
        },
        {
          name: "description",
          label: t("report.descriptionLabel"),
          type: "longText",
          required: true,
          rows: 7,
          maxLength: 10000,
          placeholder: t("report.descriptionPlaceholder"),
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );
  const initial = useMemo<FormValues>(
    () => ({ reportType: "bug", category: defaultCategory, priority: "medium" }),
    [defaultCategory],
  );
  const form = useSchemaForm(schema, { initial });

  const reset = useCallback(() => {
    form.reset();
    setError(null);
    setInitialTab(0);
  }, [form]);

  const acceptFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const room = MAX_REPORT_EVIDENCE - evidence.length;
      if (room <= 0) return;
      const all = Array.from(files);
      const accepted = all.filter(isAcceptedReportAttachment);
      if (accepted.length < all.length) {
        setError(t("report.attachInvalid"));
      }
      const picked = accepted.slice(0, room);
      if (picked.length === 0) return;
      try {
        const read = await Promise.all(picked.map(readFileAsDataUrl));
        onEvidenceChange([...evidence, ...read]);
      } catch {
        setError(t("report.attachFailed"));
      }
    },
    [evidence, onEvidenceChange, t],
  );

  const handleClose = useCallback(() => {
    if (submitting) return;
    reset();
    setSubmittedRef(null);
    onClose();
  }, [onClose, reset, submitting]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await submitReport({
          reportType: values.reportType as ReportType,
          summary: String(values.summary).trim(),
          description: String(values.description).trim(),
          category: values.category as ReportProblemCategory,
          priority: values.priority as TicketPriority,
          contextLabel,
          evidence,
        });
        reset();
        setSubmittedRef(result.id);
      } catch (cause) {
        setError(cause instanceof Error && cause.message ? cause.message : t("report.submitFailed"));
      } finally {
        setSubmitting(false);
      }
    },
    [contextLabel, evidence, reset, t],
  );

  if (submittedRef) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent className="sm:max-w-[32rem]">
          <DialogHeader>
            <DialogTitle>{t("report.sentTitle")}</DialogTitle>
            <DialogDescription>{t("report.sentBody")}</DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 space-y-1 text-sm text-foreground">
              <p>
                {t("report.sentReference")}{" "}
                <span className="font-mono font-semibold">#{shortReportRef(submittedRef)}</span>
              </p>
              <p className="text-muted-foreground">{t("report.sentFollowUp")}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleClose}>
              {t("report.done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const full = evidence.length >= MAX_REPORT_EVIDENCE;

  const guidance = (
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm leading-relaxed text-muted-foreground">{t("report.guidance")}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t("report.helpAria")}
            title={t("report.helpAria")}
            className={cn(
              touchHitArea,
              "shrink-0 rounded-xs text-muted-foreground opacity-70 transition-opacity hover:opacity-100",
            )}
          >
            <CircleHelp className="size-4" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 text-sm">
          <p className="font-medium text-foreground">{t("report.helpTitle")}</p>
          <p className="mt-1 text-muted-foreground">{t("report.helpBody")}</p>
        </PopoverContent>
      </Popover>
    </div>
  );

  const evidenceTab = (
    <div className="grid gap-3 py-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {t("report.evidenceCount", undefined, { count: evidence.length, max: MAX_REPORT_EVIDENCE })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => {
              setInitialTab(EVIDENCE_TAB);
              onRequestCapture();
            }}
            disabled={full}
          >
            <Camera className="size-4" />
            {t("report.screenshotMode")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => fileInputRef.current?.click()}
            disabled={full}
          >
            <Paperclip className="size-4" />
            {t("report.attach")}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={REPORT_ATTACHMENT_TYPES.join(",")}
          multiple
          // Hidden, not sr-only: an off-screen full-width input stretched past the dialog.
          className="hidden"
          data-testid="report-attachment-input"
          disabled={full}
          onChange={(event) => {
            void acceptFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      {evidence.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground">
          {t("report.evidenceEmpty")}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {evidence.map((item, index) => (
            <div key={`evidence-${index}`} className="relative">
              <img
                src={item}
                alt={t("report.evidenceAlt", undefined, { index: index + 1 })}
                className="h-20 w-28 rounded-lg border border-border/70 object-cover"
              />
              <button
                type="button"
                aria-label={t("report.removeEvidence")}
                onClick={() => onEvidenceChange(evidence.filter((_, i) => i !== index))}
                className={cn(
                  touchHitArea,
                  "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-destructive",
                )}
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SchemaFormDialog
      open={open}
      title={t("report.title")}
      description={t("report.context", undefined, { context: contextLabel })}
      form={form}
      head={guidance}
      extraTabs={[
        { label: t("report.evidenceLabel"), content: evidenceTab, complete: evidence.length > 0 },
      ]}
      initialTab={initialTab}
      submitLabel={submitting ? t("report.sending") : t("report.submit")}
      saving={submitting}
      error={error}
      onClose={handleClose}
      onSubmit={(values) => void handleSubmit(values)}
    />
  );
}
