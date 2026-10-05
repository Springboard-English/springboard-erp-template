// `/max`: the default build's metadata checks only a number's LENGTH, so
// `0131-3721` passed as valid. The API's `phonenumbers` checks the real ranges.
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

/**
 * The region a number without a `+` is read in. The API parses with the same
 * default (`app/base/domain/phone.py`), so the two agree on what is valid.
 */
export const DEFAULT_PHONE_REGION = 'VN';

function parse(value: string) {
  // The same characters `process_phone_number` strips before it parses, and
  // `00` read as `+` — Vietnam's international prefix, which the API honours.
  const trimmed = value.trim().replace(/[\s\-().]/g, '').replace(/^00/, '+');
  // Digits only: letters would be read as keypad digits, as the API refuses.
  if (!/^\+?[0-9]+$/.test(trimmed)) {
    return undefined;
  }
  // `extract: false`: by default the library pulls a number out of surrounding
  // text, so "0912345678 (so Zalo)" passed here and was a 422 at the API.
  const parsed = parsePhoneNumberFromString(trimmed, {
    defaultCountry: DEFAULT_PHONE_REGION,
    extract: false,
  });
  return parsed?.isValid() ? parsed : undefined;
}

/** Whether `value` is exactly one valid phone number, in any local form. */
export function isValidPhoneNumber(value: string): boolean {
  return parse(value) !== undefined;
}

/** `value` as E.164 (`+84912345678`), the form the API stores; null if invalid. */
export function toE164Phone(value: string): string | null {
  return parse(value)?.number ?? null;
}

/**
 * A stored number as a person reads it: national for Vietnam (`0912 345 678`),
 * international otherwise. Anything that does not parse is returned unchanged,
 * so a legacy value still shows.
 */
export function formatPhoneNumber(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const parsed = parse(value);
  if (!parsed) {
    return value;
  }
  return parsed.country === DEFAULT_PHONE_REGION
    ? parsed.formatNational()
    : parsed.formatInternational();
}
