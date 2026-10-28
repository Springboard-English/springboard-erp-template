import { useCallback, useId, useMemo, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/I18nContext";
import type {
  FeedbackTicketPriority as TicketPriority,
  FeedbackTicketReportType as ReportType,
} from "../../api_calls/feedbackTickets";
import { submitReport } from "./submitReport";

/** An "Area" a reporter can pick. `feature` is not one: a feature request is a report type. */
export type ReportProblemCategory = "lms" | "access_login" | "process" | "content_data";

/** The most screenshots and attachments one report carries. */
export const MAX_REPORT_EVIDENCE = 5;
/** The API's per-file limit for a ticket attachment. */
export const MAX_REPORT_ATTACHMENT_BYTES = 10 * 1024 * 1024;
/** The image types the attachment picker accepts. */
export const REPORT_ATTACHMENT_TYPES = ["image/png", "image/jpeg"] as const;

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
 * The report form: type, Area, priority, summary, details and up to five
 * screenshots. Sending uploads the screenshots, files the ticket and shows its
 * reference.
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
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const idPrefix = useId();
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [category, setCategory] = useState<ReportProblemCategory>(defaultCategory);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => summary.trim().length > 0 && description.trim().length > 0 && !submitting,
    [summary, description, submitting],
  );

  const reset = useCallback(() => {
    setReportType("bug");
    setPriority("medium");
    setCategory(defaultCategory);
    setSummary("");
    setDescription("");
    setError(null);
  }, [defaultCategory]);

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

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitReport({
        reportType,
        summary: summary.trim(),
        description: description.trim(),
        category,
        priority,
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
  }, [canSubmit, category, contextLabel, description, evidence, priority, reportType, reset, summary, t]);

  const full = evidence.length >= MAX_REPORT_EVIDENCE;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      {submittedRef ? (
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
      ) : (
        <DialogContent className="max-h-[88dvh] overflow-y-auto overflow-x-hidden sm:max-w-[60rem]">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t("report.helpAria")}
                title={t("report.helpAria")}
                className={cn(
                  touchHitArea,
                  "absolute right-12 top-4 rounded-xs text-muted-foreground opacity-70 transition-opacity hover:opacity-100",
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

          <DialogHeader>
            <DialogTitle>{t("report.title")}</DialogTitle>
            <DialogDescription className="break-words">
              {t("report.context", undefined, { context: contextLabel })}
            </DialogDescription>
          </DialogHeader>

          {/* minmax(0,…) on phones too: an auto track grows to its widest unwrappable row and pushes past the dialog. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">{t("report.typeLabel")}</legend>
                <RadioGroup
                  value={reportType}
                  onValueChange={(value) => setReportType(value as ReportType)}
                  className="space-y-3"
                >
                  {REPORT_TYPES.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} id={`${idPrefix}-type-${option.value}`} />
                      <Label htmlFor={`${idPrefix}-type-${option.value}`} className="cursor-pointer font-normal">
                        {t(option.key)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-category`}>{t("report.categoryLabel")}</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ReportProblemCategory)}>
                  <SelectTrigger id={`${idPrefix}-category`} className="w-full max-w-[16rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">{t("report.priorityLabel")}</legend>
                <RadioGroup
                  value={priority}
                  onValueChange={(value) => setPriority(value as TicketPriority)}
                  className="space-y-3"
                >
                  {PRIORITIES.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} id={`${idPrefix}-priority-${option.value}`} />
                      <Label htmlFor={`${idPrefix}-priority-${option.value}`} className="cursor-pointer font-normal">
                        {t(option.key)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>

            <div className="min-w-0 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{t("report.guidance")}</p>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-summary`}>{t("report.summaryLabel")}</Label>
                <Input
                  id={`${idPrefix}-summary`}
                  value={summary}
                  maxLength={200}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder={t("report.summaryPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-description`}>{t("report.descriptionLabel")}</Label>
                <Textarea
                  id={`${idPrefix}-description`}
                  value={description}
                  rows={7}
                  maxLength={10000}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("report.descriptionPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label className="whitespace-nowrap">
                    {t("report.evidenceLabel")}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {t("report.evidenceCount", undefined, {
                        count: evidence.length,
                        max: MAX_REPORT_EVIDENCE,
                      })}
                    </span>
                  </Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="whitespace-nowrap"
                      onClick={onRequestCapture}
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
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              {t("report.cancel")}
            </Button>
            <Button type="button" onClick={() => void handleSubmit()} disabled={!canSubmit}>
              {submitting ? t("report.sending") : t("report.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
