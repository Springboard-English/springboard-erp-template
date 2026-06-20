import { useMemo, type ReactNode } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { ENGLISH_MESSAGES, type TemplateI18nKey } from "@/i18n/messages";

export type TemplateMessages = Partial<Record<TemplateI18nKey | string, string>>;

type TranslationValues = Record<string, string | number>;

function createI18nInstance(locale: string, messages?: TemplateMessages) {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: ENGLISH_MESSAGES,
      },
      [locale]: {
        translation: locale === "en"
          ? { ...ENGLISH_MESSAGES, ...messages }
          : (messages ?? {}),
      },
    },
  });

  return instance;
}

export function I18nProvider({
  children,
  locale = "en",
  messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: TemplateMessages;
}) {
  const instance = useMemo(
    () => createI18nInstance(locale, messages),
    [locale, messages],
  );

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}

export function useI18n() {
  const { t: rawT, i18n } = useTranslation();

  const t = (key: TemplateI18nKey | string, fallback?: string, values?: TranslationValues) =>
    rawT(key, {
      ...values,
      defaultValue: ENGLISH_MESSAGES[key as TemplateI18nKey] ?? fallback ?? key,
    });

  return {
    locale: i18n.language || "en",
    t,
  };
}
