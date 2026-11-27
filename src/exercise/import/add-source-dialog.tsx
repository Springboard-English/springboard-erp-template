import { useEffect, useState } from "react";
import { Sparkles, Upload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../exports";
import { Button } from "../../exports";
import { Label } from "../../exports";
import { Textarea } from "../../exports";
import { useStableI18n } from "./i18n";

export interface AddedSource {
  file: File | null;
  text: string;
  note: string;
}

// Read another file into the review already open, so a paper split across
// several scans — or a second paper's parts — lands in the same import. The
// questions it finds are ADDED to the review; nothing already there changes.
// A form of its own because the review's action bar stays one row.
export function AddSourceDialog({
  open,
  onOpenChange,
  defaultNote,
  onRead,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The import's note, offered again: it usually holds for every file. */
  defaultNote: string;
  onRead: (source: AddedSource) => void;
}) {
  const { t } = useStableI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [note, setNote] = useState(defaultNote);

  // A fresh form each time it opens; the last file is already in the review.
  useEffect(() => {
    if (!open) return;
    setFile(null);
    setText("");
    setNote(defaultNote);
  }, [open, defaultNote]);

  const canRead = file !== null || text.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("exercise.import.addSource.title", "Add another file")}</DialogTitle>
          <DialogDescription>
            {t(
              "exercise.import.addSource.description",
              "Its questions are added after the ones already here. Nothing you have reviewed changes.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed bg-muted/40 p-6 text-center transition-colors hover:border-rose-300">
            <Upload className="size-5 text-rose-700" />
            <span className="text-sm font-bold text-foreground">
              {t("exercise.import.addSource.upload", "Upload a PDF or an image")}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {file
                ? t("exercise.import.addSource.selected", "Selected: {name}", { name: file.name })
                : t("exercise.import.addSource.orPasteBelow", "or paste text below")}
            </span>
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t("exercise.import.addSource.pastePlaceholder", "…or paste the questions here")}
            className="min-h-24 rounded-2xl border-2 p-3"
          />

          <div className="space-y-1.5">
            <Label htmlFor="add-source-note">
              {t("exercise.import.addSource.noteLabel", "Note for the AI (optional)")}
            </Label>
            <Textarea
              id="add-source-note"
              value={note}
              maxLength={2000}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("exercise.import.addSource.notePlaceholder", "e.g. The answer key is on the last page.")}
              className="min-h-16 rounded-2xl border-2 p-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("exercise.import.addSource.cancel", "Cancel")}
          </Button>
          <Button disabled={!canRead} onClick={() => onRead({ file, text, note })}>
            <Sparkles className="size-4" />
            {t("exercise.import.addSource.read", "Read with AI")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
