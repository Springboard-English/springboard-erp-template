import { cn } from '@/lib/utils';

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
}

/**
 * The commit a deployed bundle was built from, rendered unobtrusively.
 *
 * Exists so a bug report can be tied to an exact build: without it the only way
 * to tell what is live is to fetch the bucket's `index.html`, read which hashed
 * chunk it points at, and grep that.
 */
export default function BuildTag({ commit, hidden = false, className }: BuildTagProps) {
  const trimmed = commit?.trim();
  if (hidden || !trimmed) {
    return null;
  }

  return (
    <p
      className={cn(
        'truncate font-mono text-[10px] leading-none text-muted-foreground/60',
        className,
      )}
      title={`Build ${trimmed}`}
      data-testid="build-tag"
    >
      {trimmed}
    </p>
  );
}
