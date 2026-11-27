import { useState } from "react";
import { Plus, X } from "lucide-react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../exports";
import { RecordingFileButton, recordingFileHint, type UploadedRecording } from "./media-field";
import { useStableI18n } from "./i18n";

/** A recording added during an import: uploaded already, attached to its part or section at the save. */
export interface PendingRecording {
  id: string;
  upload: UploadedRecording;
  title: string;
  /** Where it goes: a part's or section's ref in the import, or `IMPORT_AUDIO_TEST` for the whole test. */
  placement: string;
}

/** The placement for a recording that belongs to the whole test, not one part. */
export const IMPORT_AUDIO_TEST = "__test__";

/** One place a recording can go, by ref, with the name the teacher knows it by. */
export interface AudioPlacement {
  value: string;
  label: string;
}

/**
 * The import runner's audio dialog: the recordings queued so far, each with
 * where it goes, and a form to add another. Files upload at once (so a long
 * listening file is done by the time the review is), but nothing is attached
 * until the import is saved and its parts and sections exist.
 */
export function ImportAudioPanel({
  recordings,
  placements,
  onChange,
}: {
  recordings: PendingRecording[];
  placements: AudioPlacement[];
  onChange: (next: PendingRecording[]) => void;
}) {
  const { t } = useStableI18n();
  const [upload, setUpload] = useState<UploadedRecording | null>(null);
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState(placements[0]?.value ?? IMPORT_AUDIO_TEST);
  const labelOf = new Map(placements.map((p) => [p.value, p.label]));

  function add() {
    if (!upload || !title.trim()) return;
    onChange([...recordings, { id: `${Date.now()}-${recordings.length}`, upload, title: title.trim(), placement }]);
    setUpload(null);
    setTitle("");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t(
          "exercise.import.importAudio.hint",
          "Add the paper's listening audio here. Each file uploads now and is attached to its part or section when you save the import.",
        )}
      </p>

      {recordings.length ? (
        <ul className="space-y-2">
          {recordings.map((rec) => (
            <li key={rec.id} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground">{rec.title}</span>
                <span className="block truncate text-xs font-semibold text-muted-foreground">
                  {labelOf.get(rec.placement) ?? t("exercise.import.importAudio.wholeTest", "The whole test")}
                </span>
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t("exercise.import.importAudio.remove", "Remove {title}", { title: rec.title })}
                onClick={() => {
                  URL.revokeObjectURL(rec.upload.localUrl);
                  onChange(recordings.filter((r) => r.id !== rec.id));
                }}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="space-y-3 rounded-xl border-2 border-dashed border-sky-300 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <RecordingFileButton
            label={
              upload
                ? t("exercise.import.recordings.chooseAnother", "Choose another file")
                : t("exercise.import.recordings.chooseFile", "Choose audio file")
            }
            variant={upload ? "outline" : "default"}
            onUploaded={(next) => {
              if (upload) URL.revokeObjectURL(upload.localUrl);
              setUpload(next);
              if (!title.trim()) setTitle(next.name);
            }}
          />
          <span className="text-xs font-semibold text-muted-foreground">{recordingFileHint(t)}</span>
        </div>
        {upload ? (
          <>
            {/* The teacher's own file, before it is saved — native controls are fine here. */}
            <audio src={upload.localUrl} controls preload="metadata" className="w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground">{t("exercise.import.recordings.fieldTitle", "Title")}</span>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground">{t("exercise.import.importAudio.placement", "Plays for")}</span>
                <Select value={placement} onValueChange={setPlacement}>
                  <SelectTrigger className="w-full" aria-label={t("exercise.import.importAudio.placement", "Plays for")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="button" disabled={!title.trim()} onClick={add}>
              <Plus className="size-4" />
              {t("exercise.import.importAudio.add", "Add recording")}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
