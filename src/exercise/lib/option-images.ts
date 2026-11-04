/**
 * Images on a question's choices.
 *
 * An option stores `image_key` — the image's SHA-256 and extension, the name
 * the API stored it under in the PRIVATE media bucket. A key alone shows
 * nothing: every response carrying the question lists a signed URL per key in
 * `image_urls`, and the mapper folds it onto the option as `image_url` so a
 * renderer reads one field. `image_url` is display-only and expires, so it is
 * stripped again before any save (the API refuses an unknown option key).
 */

type Content = Record<string, unknown>;

function mapOptions(content: Content, map: (option: Record<string, unknown>) => Record<string, unknown>): Content {
  const options = content.options;
  if (!Array.isArray(options)) return content;
  return {
    ...content,
    options: options.map((option) =>
      option && typeof option === "object" ? map(option as Record<string, unknown>) : option,
    ),
  };
}

/** Whether any choice has a picture; such a question lays its choices out in one row. */
export function hasOptionImages<T extends { image_key?: string; image_url?: string }>(options: readonly T[]): boolean {
  return options.some((option) => Boolean(option.image_key || option.image_url));
}

/** Put each option's signed URL beside its key. */
export function withImageUrls(
  content: Content,
  urls: Record<string, string> | null | undefined,
): Content {
  if (!urls) return content;
  return mapOptions(content, (option) => {
    const url = typeof option.image_key === "string" ? urls[option.image_key] : undefined;
    return url ? { ...option, image_url: url } : option;
  });
}

/** The content as the API stores it: no expiring URLs, no empty key. */
export function withoutImageUrls(content: Content): Content {
  return mapOptions(content, (option) => {
    const rest = { ...option };
    delete rest.image_url;
    if (!rest.image_key) delete rest.image_key;
    return rest;
  });
}