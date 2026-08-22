import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

/**
 * The canonical form of a tag: trimmed and lowercased.
 *
 * It has to match `normalize_tags` in the API (`app/base/domain/tags.py`)
 * exactly. The server stores tags this way and filters with a JSONB containment
 * test, so a tag only ever matches its exact stored string — a chip reading
 * "Reading" that was saved as "reading" would look right and match nothing.
 * Normalizing here rather than only on the server means the chip the user sees
 * is the value that will be sent.
 */
export function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase();
}

export function normalizeTags(raw: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const item of raw) {
    const tag = normalizeTag(item);
    if (tag) {
      seen.add(tag);
    }
  }
  return [...seen].sort();
}

export interface TagInputProps {
  value: readonly string[];
  onValueChange: (next: string[]) => void;
  /** Tags already in use elsewhere, offered as you type. */
  suggestions?: readonly string[];
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Refuse to add more than this many. Matches the API's MAX_TAGS. */
  maxTags?: number;
  /** Matches the API's MAX_TAG_LENGTH; longer input is rejected on commit. */
  maxTagLength?: number;
  className?: string;
  'aria-label'?: string;
}

const DEFAULT_MAX_TAGS = 32;
const DEFAULT_MAX_TAG_LENGTH = 48;
const MAX_VISIBLE_SUGGESTIONS = 8;

/**
 * A chip editor for a list of free-form tags.
 *
 * Enter or comma commits what is typed; Backspace on an empty field removes the
 * last chip; the X on a chip removes it. Suggestions are filtered as you type
 * and are a convenience, not a constraint — the whole point of these tags is
 * that a teacher can invent one.
 */
export function TagInput({
  value,
  onValueChange,
  suggestions = [],
  id,
  placeholder,
  disabled = false,
  maxTags = DEFAULT_MAX_TAGS,
  maxTagLength = DEFAULT_MAX_TAG_LENGTH,
  className,
  'aria-label': ariaLabel,
}: TagInputProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = useMemo(() => [...value], [value]);
  const atLimit = tags.length >= maxTags;

  const matchingSuggestions = useMemo(() => {
    const needle = normalizeTag(draft);
    const chosen = new Set(tags);
    return suggestions
      .filter((suggestion) => !chosen.has(suggestion))
      .filter((suggestion) => (needle ? suggestion.includes(needle) : true))
      .slice(0, MAX_VISIBLE_SUGGESTIONS);
  }, [draft, suggestions, tags]);

  const commit = (raw: string) => {
    const tag = normalizeTag(raw);
    setDraft('');
    if (!tag || tag.length > maxTagLength || atLimit || tags.includes(tag)) {
      return;
    }
    onValueChange(normalizeTags([...tags, tag]));
  };

  const remove = (tag: string) => {
    onValueChange(tags.filter((existing) => existing !== tag));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      // Enter would submit the surrounding form, and a comma is how people
      // already separate tags by hand.
      event.preventDefault();
      commit(draft);
      return;
    }
    if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      event.preventDefault();
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-xs transition',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground"
          >
            {tag}
            {!disabled ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  remove(tag);
                }}
                className="cursor-pointer text-muted-foreground transition hover:text-foreground"
                aria-label={t('tagInput.remove', 'Remove {tag}', { tag })}
              >
                <X className="size-3" />
              </button>
            ) : null}
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          value={draft}
          disabled={disabled || atLimit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          // Losing focus with something typed should keep it, not silently
          // discard it — the commonest way to lose a tag is to click Save next.
          onBlur={() => commit(draft)}
          placeholder={tags.length === 0 ? (placeholder ?? t('tagInput.placeholder')) : ''}
          aria-label={ariaLabel ?? t('tagInput.label')}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      {matchingSuggestions.length > 0 && !disabled && !atLimit ? (
        <div className="flex flex-wrap gap-1">
          {matchingSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(event) => {
                // mousedown, not click: the input's onBlur fires first
                // otherwise and commits the half-typed draft over the pick.
                event.preventDefault();
                commit(suggestion);
              }}
              className="cursor-pointer rounded border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground transition hover:border-solid hover:bg-accent hover:text-accent-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      {atLimit ? (
        <p className="text-xs text-muted-foreground">
          {t('tagInput.limit', 'At most {max} tags.', { max: String(maxTags) })}
        </p>
      ) : null}
    </div>
  );
}
