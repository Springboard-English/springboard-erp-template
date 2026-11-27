import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
} from "../../exports";
import { useStableI18n } from "./i18n";
import { parseQuickKey } from "./quick-key";

/**
 * Paste or type a paper's answer key in one go ("1 A, 2 C, 3 sweeten"); the
 * host fills the matching questions, numbered as the review numbers them.
 * For a paper that printed no key, where each answer would otherwise be set
 * by hand. Saves with its own button, as a dialog does.
 */
export function QuickKeyDialog({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (text: string) => void;
}) {
  const { t } = useStableI18n();
  const [text, setText] = useState("");
  useEffect(() => {
    if (open) setText("");
  }, [open]);
  const count = parseQuickKey(text).length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("exercise.import.quickKey.title", "Paste the Answer Key")}</DialogTitle>
          <DialogDescription>
            {t(
              "exercise.import.quickKey.description",
              "One answer per question number, as the paper's key prints it: a letter for multiple choice, T, F or NG, or the word for a gap. Separate spellings with /.",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="quick-key">{t("exercise.import.quickKey.label", "Answer key")}</Label>
          <Textarea
            id="quick-key"
            rows={6}
            value={text}
            placeholder="1 A, 2 C, 3 NG, 4 sweeten"
            onChange={(event) => setText(event.target.value)}
          />
          <p className="text-xs font-semibold text-muted-foreground">
            {t("exercise.import.quickKey.found", "{n} answers found", { n: count })}
          </p>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("exercise.import.quickKey.cancel", "Cancel")}
          </Button>
          <Button disabled={count === 0} onClick={() => onApply(text)}>
            {t("exercise.import.quickKey.apply", "Fill Answers")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
