// The live runner's translator and locale helpers. English lives inline at each
// `t()` call; Vietnamese is in `../messages.ts`.

import { useI18n } from "../../context/I18nContext";

export { type Translate, valueLabel } from "../i18n";

/** The live runner's translator, the template's own `useI18n`. */
export const useStableI18n = useI18n;


/** The BCP 47 tag for dates and numbers, from the page language the provider keeps on `<html>`. */
export function dateLocale(): string {
  return globalThis.document?.documentElement.lang.toLowerCase().startsWith("vi") ? "vi-VN" : "en-GB";
}
