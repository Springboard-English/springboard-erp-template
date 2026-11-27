import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../exports";
import { useStableI18n } from "./i18n";

/** One choice in the Add dialog: what it makes, in a line, and what it does. */
export interface AddChoice {
  key: string;
  icon?: ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
  /** Shown below the main choices, quieter (recordings). */
  secondary?: boolean;
}

/**
 * The foot of the editor's question list: one Add button opening a dialog of
 * large rows. Choosing one closes the dialog, calls `onDone`, then runs it.
 */
export function AddToTestDialog({ choices, onDone }: { choices: AddChoice[]; onDone: () => void }) {
  const { t } = useStableI18n();
  const [open, setOpen] = useState(false);
  const main = choices.filter((choice) => !choice.secondary);
  const rest = choices.filter((choice) => choice.secondary);

  const row = (choice: AddChoice) => (
    <button
      key={choice.key}
      type="button"
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => {
        setOpen(false);
        onDone();
        choice.onSelect();
      }}
    >
      {choice.icon ? <span className="shrink-0 text-muted-foreground">{choice.icon}</span> : null}
      <span className="min-w-0">
        <span className="block text-sm font-extrabold text-foreground">{choice.title}</span>
        <span className="block text-xs font-medium text-muted-foreground">{choice.description}</span>
      </span>
    </button>
  );

  return (
    <>
      <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        {t("exercise.import.addToTest.button", "Add")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("exercise.import.addToTest.title", "Add to this test")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">{main.map(row)}</div>
          {rest.length ? <div className="space-y-2 border-t border-border pt-3">{rest.map(row)}</div> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
