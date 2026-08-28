import { useCallback, useEffect, useMemo, useState } from 'react';

import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

import ChangelogDialog from './changelog/ChangelogDialog';
import WhatsNewNote from './changelog/WhatsNewNote';
import { changelogNoteId, readSeenNoteId, writeSeenNoteId } from './changelog/changelog';
import type { ChangelogCommit } from './changelog/types';

export interface BuildTagProps {
  /**
   * Short commit hash for the running bundle. Each app injects its own at build
   * time (see `resolveCommitHash` in the app's vite config) and passes it in.
   *
   * Taken as a prop rather than read from a global on purpose: a shared package
   * reaching for a `__COMMIT_HASH__` that the consumer may not have defined
   * would fail at runtime, and relying on a consumer's `define` to rewrite code
   * inside `node_modules` is implicit in a way that is painful to debug.
   */
  commit?: string | null;
  /** Hide entirely — for collapsed sidebars and other tight spots. */
  hidden?: boolean;
  className?: string;
  /**
   * The app's commit history, newest first, generated at build time by the
   * app's `scripts/generate-changelog.mjs`. When it is non-empty the tag
   * becomes a button that opens the history.
   *
   * Passed in rather than fetched: the history is a build artifact that ships
   * inside the bundle, so it is exactly the history of the bundle being run,
   * with no API call and nothing to get out of step.
   */
  changelog?: readonly ChangelogCommit[];
  /** Overrides the history dialog's heading. */
  changelogTitle?: string;
  /**
   * Raw markdown for a short, vital "what changed" note, shown once above the
   * tag and dismissed by any click. Each app keeps its own
   * `src/content/whats-new.md`; leave it empty when there is nothing to say.
   */
  note?: string | null;
  /**
   * localStorage key recording which note this browser has already seen.
   * Namespace it per app when two of them share an origin.
   */
  noteStorageKey?: string;
}

/**
 * The commit a deployed bundle was built from, rendered unobtrusively — and the
 * way into what changed.
 *
 * Exists so a bug report can be tied to an exact build: without it the only way
 * to tell what is live is to fetch the bucket's `index.html`, read which hashed
 * chunk it points at, and grep that. Given `changelog`, it also answers the
 * question everyone asks straight after reading a sha — what is different from
 * the build I had yesterday — by opening the history it was built from.
 */
export default function BuildTag({
  commit,
  hidden = false,
  className,
  changelog,
  changelogTitle,
  note,
  noteStorageKey = 'springboard:whats-new',
}: BuildTagProps) {
  const { t } = useI18n();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const trimmedNote = note?.trim() ?? '';
  const noteId = useMemo(() => (trimmedNote ? changelogNoteId(trimmedNote) : ''), [trimmedNote]);

  useEffect(() => {
    // Deliberately re-evaluated whenever the note's identity changes: a deploy
    // that rewrites the note gives the same browser a new id, and it shows once
    // more. Reading storage in an effect rather than in `useState`'s initialiser
    // keeps the first render identical everywhere.
    setNoteOpen(noteId ? readSeenNoteId(noteStorageKey) !== noteId : false);
  }, [noteId, noteStorageKey]);

  const dismissNote = useCallback(() => {
    setNoteOpen(false);
    if (noteId) {
      writeSeenNoteId(noteStorageKey, noteId);
    }
  }, [noteId, noteStorageKey]);

  const trimmed = commit?.trim();
  const commits = changelog ?? [];
  const interactive = commits.length > 0;
  const invisible = hidden || !trimmed;

  // Nothing to show and nothing to say — the common case on a collapsed sidebar.
  if (invisible && !noteOpen) {
    return null;
  }

  const tagClassName = cn(
    'truncate font-mono text-[10px] leading-none text-muted-foreground/60',
    className,
  );

  // Even with the tag hidden, a vital note still needs somewhere to point. An
  // sr-only anchor keeps it attached to the account panel without putting the
  // sha back into a sidebar that was collapsed to get rid of it.
  const anchor = invisible ? (
    <span className="sr-only" data-testid="build-tag-anchor" />
  ) : interactive ? (
    <button
      type="button"
      onClick={() => setHistoryOpen(true)}
      className={cn(
        tagClassName,
        'cursor-pointer underline decoration-dotted decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      )}
      title={t('changelog.open')}
      data-testid="build-tag"
    >
      {trimmed}
    </button>
  ) : (
    <p className={tagClassName} title={`Build ${trimmed}`} data-testid="build-tag">
      {trimmed}
    </p>
  );

  return (
    <>
      {trimmedNote ? (
        // Mounted whether or not it is open, so dismissing it animates out
        // rather than vanishing — and so the anchor element is not remounted
        // underneath the popover as it closes.
        <WhatsNewNote markdown={trimmedNote} open={noteOpen} onDismiss={dismissNote}>
          {anchor}
        </WhatsNewNote>
      ) : (
        anchor
      )}
      {interactive ? (
        <ChangelogDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          commits={commits}
          currentCommit={trimmed}
          title={changelogTitle}
        />
      ) : null}
    </>
  );
}
