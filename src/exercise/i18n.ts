import type { useI18n } from "../context/I18nContext";

/** The translator the exercise code takes; English lives inline at each call as the fallback. */
export type Translate = ReturnType<typeof useI18n>["t"];

/** Translates a fixed English value (a skill, a question type); unknown values show as they are. */
export function valueLabel(t: Translate, value: string): string {
  return t(`exercise.value.${value}`, value);
}
