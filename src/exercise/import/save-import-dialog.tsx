import { TagInput } from "../../exports";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour-anchor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../exports";
import { Input } from "../../exports";
import { Label } from "../../exports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../exports";
import { Button } from "../../exports";
import {
  TestScopeFields,
  scopeToCreateBody,
  type TestScope,
} from "./test-scope-fields";
import type { Test } from "./api";
import { useStableI18n } from "./i18n";
import type { ImportMode } from "./config";

// Where an AI import lands: an existing test, or a new test (which needs a name
// and a scope) — or, in exercise mode, the library alone. Asked in a dialog, at
// the moment Save is pressed.
//
// The two modes are not two presets of one form; each forbids what the other is
// for (see `ImportMode`). A test import may not stop at the library, because a
// paper nobody can sit is not the thing that import was started to make. An
// exercise import may not join a test, and must be tagged, because a loose
// question has no paper around it to be found by later — the tag IS its filing.
//
// Not inline in the review's action bar: that bar is a one-row strip by design
// (the review's whole layout gives the question the screen), and a new test's
// name and scope pickers would push extra rows into it, keeping the filing
// question in the teacher's eyeline while they check questions. Filing a test
// is a decision made once, at the end; a dialog is where a decision made once
// belongs, and it can afford to say what the choice means.
//
// The sentinels are the caller's (`ai-extract.tsx` maps them onto its save), so
// this component stays a form over the value it is handed.
export const IMPORT_NO_TEST = "__none__";
export const IMPORT_NEW_TEST = "__new__";
/** The save form's id, for a submit button outside it (the runner's bottom bar). */
export const SAVE_IMPORT_FORM = "save-import-form";

/**
 * Is the form complete enough to save?
 *
 * Covers the tags as well as the destination, because in exercise mode a tag is
 * not decoration on the save — it is the only thing that will make the question
 * findable, so an untagged exercise import is as incomplete as a new test with
 * no name.
 */
export function importSaveReady({
  mode,
  testKey,
  newTestName,
  newTestScope,
  tags,
}: {
  mode: ImportMode;
  testKey: string;
  newTestName: string;
  newTestScope: TestScope | null;
  tags: string[];
}): boolean {
  // A library import needs a scope for the same reason it needs a tag, and it
  // is the more load-bearing of the two. A test import gets its parts' reach
  // from the test; a library import has no test, so without a scope every part
  // it writes is readable by its author and nobody else.
  if (mode === "exercises") {
    return tags.length > 0 && scopeToCreateBody(newTestScope) !== null;
  }
  // A test import must land in a test. `Library only` is not offered, but the
  // sentinel is still the screen's initial state, so refuse it here too.
  if (testKey === IMPORT_NO_TEST) return false;
  if (testKey !== IMPORT_NEW_TEST) return true;
  return newTestName.trim().length > 0 && scopeToCreateBody(newTestScope) !== null;
}

export function SaveImportDialog({
  open,
  onOpenChange,
  mode,
  tests,
  testKey,
  onTestKeyChange,
  newTestName,
  onNewTestNameChange,
  newTestScope,
  onNewTestScopeChange,
  tags,
  onTagsChange,
  tagSuggestions,
  questionCount,
  ordered,
  onConfirm,
  asPage = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which import this is filing — it decides the whole shape of the form. */
  mode: ImportMode;
  tests: Test[];
  testKey: string;
  onTestKeyChange: (key: string) => void;
  newTestName: string;
  onNewTestNameChange: (name: string) => void;
  newTestScope: TestScope | null;
  onNewTestScopeChange: (scope: TestScope | null) => void;
  /**
   * Tags applied to EVERY question this save writes.
   *
   * Per-import rather than per-question: a paper is imported as a unit and is
   * described as one ("Cambridge B2, unit 7"), and the review screen's whole
   * layout argument is that the question should dominate — thirty tag editors
   * in the rail would fight that. A question that needs its own tag gets it
   * afterwards, on its library page.
   *
   * Required in exercise mode, optional in test mode — see `importSaveReady`.
   */
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  tagSuggestions: string[];
  /** How many questions the save will write. */
  questionCount: number;
  /** Whether the teacher set an explicit order in the reorder view. */
  ordered: boolean;
  onConfirm: () => void;
  /** The import's last page in the runner, not a dialog; its submit sits in the runner's bottom bar. */
  asPage?: boolean;
}) {
  const { t } = useStableI18n();
  const toLibrary = mode === "exercises";
  const creatingTest = !toLibrary && testKey === IMPORT_NEW_TEST;
  const ready = importSaveReady({ mode, testKey, newTestName, newTestScope, tags });

  const titleText =
            questionCount === 1
              ? toLibrary
                ? t("exercise.import.saveImport.titleOneLibrary", "Save 1 question to your library")
                : t("exercise.import.saveImport.titleOne", "Save 1 question")
              : toLibrary
                ? t("exercise.import.saveImport.titleOtherLibrary", "Save {n} questions to your library", {
                    n: questionCount,
                  })
                : t("exercise.import.saveImport.titleOther", "Save {n} questions", { n: questionCount });
  const descText =
            toLibrary
              ? t(
                  "exercise.import.saveImport.descriptionLibrary",
                  "These join your library on their own, with no test around them — so tag them now. A tag is how you will find them again when you build a paper out of them.",
                )
              : t(
                  "exercise.import.saveImport.descriptionTest",
                  "Every question joins your library. Choose which test it also joins — that is what gives it a place in a paper students sit.",
                );

  const form = (
        <form
          id={SAVE_IMPORT_FORM}
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) onConfirm();
          }}
        >
          {/* No destination picker in exercise mode: the destination is the
              whole reason that mode exists, so there is nothing to choose. And
              in test mode `Library only` is absent rather than disabled — an
              import started from the tests list is a paper being turned into a
              test, and stopping at the library leaves the teacher with a test
              they think they made and students can't sit. That route still
              exists; it is the exercise import, reached from its own button. */}
          {toLibrary ? null : (
            <div className="grid gap-2">
              <Label htmlFor="save-import-target">{t("exercise.import.saveImport.addTo", "Add to")}</Label>
              <Select value={testKey} onValueChange={onTestKeyChange}>
                <SelectTrigger id="save-import-target" className="w-full">
                  <SelectValue placeholder={t("exercise.import.saveImport.chooseTest", "Choose a test…")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={IMPORT_NEW_TEST}>
                    {t("exercise.import.saveImport.newTest", "A new test…")}
                  </SelectItem>
                  {tests.map((test) => (
                    <SelectItem key={test.appsheet_key} value={test.appsheet_key}>
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {creatingTest ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="save-import-name">{t("exercise.import.saveImport.testName", "Test name")}</Label>
                <Input
                  id="save-import-name"
                  value={newTestName}
                  onChange={(event) => onNewTestNameChange(event.target.value)}
                  placeholder={t("exercise.import.saveImport.testNamePlaceholder", "e.g. Reading Practice Test 8")}
                />
              </div>
              {/* A test's scope is its authorization parent, not filing
                  metadata — see test-scope-fields.tsx. */}
              <TestScopeFields
                scope={newTestScope}
                onChange={onNewTestScopeChange}
                idPrefix="save-import"
              />
            </>
          ) : null}

          {/* The same picker, doing the same job one level down: in test mode it
              parents the test, here it parents the PARTS this import creates.
              A library import has no test to inherit from, so this is the only
              thing that makes its passages readable by a colleague. */}
          {toLibrary ? (
            <div className="grid gap-2">
              <TestScopeFields
                scope={newTestScope}
                onChange={onNewTestScopeChange}
                idPrefix="save-import-library"
              />
              <p
                className={
                  scopeToCreateBody(newTestScope) === null
                    ? "text-xs font-semibold text-destructive"
                    : "text-xs font-semibold text-muted-foreground"
                }
              >
                {scopeToCreateBody(newTestScope) === null
                  ? t(
                      "exercise.import.saveImport.chooseScope",
                      "Choose who these belong to — without it nobody but you can open their passages.",
                    )
                  : t(
                      "exercise.import.saveImport.scopeChosen",
                      "Colleagues here can reuse these parts in their own papers.",
                    )}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="save-import-tags">
              {toLibrary
                ? t("exercise.import.saveImport.tags", "Tags")
                : t("exercise.import.saveImport.tagsOptional", "Tags (optional)")}
            </Label>
            <TagInput
              id="save-import-tags"
              value={tags}
              onValueChange={onTagsChange}
              suggestions={tagSuggestions}
              placeholder={t("exercise.import.saveImport.tagsPlaceholder", "e.g. b2, cambridge, unit-7")}
            />
            <p
              className={
                toLibrary && tags.length === 0
                  ? "text-xs font-semibold text-destructive"
                  : "text-xs font-semibold text-muted-foreground"
              }
            >
              {/* A NEW test takes the same tags (ai-extract.tsx `save`): they
                  describe the paper, and that test is the paper. An existing
                  test keeps its own, so the copy only says so when it applies. */}
              {toLibrary
                ? tags.length === 0
                  ? t(
                      "exercise.import.saveImport.tagsRequired",
                      "Add at least one tag — it is how these questions are found.",
                    )
                  : t("exercise.import.saveImport.tagsApplied", "Applied to every question in this import.")
                : creatingTest
                  ? t(
                      "exercise.import.saveImport.tagsAppliedNewTest",
                      "Applied to the new test and every question in this import. Optional.",
                    )
                  : t(
                      "exercise.import.saveImport.tagsAppliedOptional",
                      "Applied to every question in this import. Optional.",
                    )}
            </p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground">
            {toLibrary
              ? t(
                  "exercise.import.saveImport.libraryOnly",
                  "Saved to the library only. You can add them to a test later.",
                )
              : ordered
                ? t("exercise.import.saveImport.orderSet", "Added in the order you set.")
                : t("exercise.import.saveImport.orderRead", "Added in the order they were read from the paper.")}
          </p>

          {/* As a page, the runner's bottom bar holds Back and Save (`SAVE_IMPORT_FORM`). */}
          {asPage ? null : (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("exercise.import.saveImport.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={!ready}>
              {t("exercise.import.saveImport.saveCount", "Save {n}", { n: questionCount })}
            </Button>
          </DialogFooter>
          )}
        </form>
  );

  if (asPage) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-5">
        <div className="space-y-1.5" {...tourAnchorProps(TOUR_ANCHORS.importSave)}>
          <h2 className="text-lg font-extrabold text-foreground">{titleText}</h2>
          <p className="text-sm text-muted-foreground">{descText}</p>
        </div>
        {form}
      </div>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Taller than a short screen: it scrolls, so Save and Cancel stay reachable. */}
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descText}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
