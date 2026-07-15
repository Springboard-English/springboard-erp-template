import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { ENGLISH_MESSAGES, VIETNAMESE_MESSAGES, type TemplateI18nKey } from "@/i18n/messages";

export type TemplateMessages = Partial<Record<TemplateI18nKey | string, string>>;
export type TemplateLocaleResources = Record<string, TemplateMessages>;

type TranslationValues = Record<string, string | number>;

const BUILT_IN_MESSAGES_BY_LOCALE: TemplateLocaleResources = {
  en: ENGLISH_MESSAGES,
  vi: VIETNAMESE_MESSAGES,
};

function createI18nInstance(locale: string, messagesByLocale?: TemplateLocaleResources) {
  const instance = createInstance();
  const localeKeys = Array.from(new Set([
    ...Object.keys(BUILT_IN_MESSAGES_BY_LOCALE),
    ...Object.keys(messagesByLocale ?? {}),
    locale,
  ]));
  const resources = localeKeys.reduce<Record<string, { translation: TemplateMessages }>>((acc, resourceLocale) => {
    acc[resourceLocale] = {
      translation: {
        ...ENGLISH_MESSAGES,
        ...(BUILT_IN_MESSAGES_BY_LOCALE[resourceLocale] ?? {}),
        ...(messagesByLocale?.[resourceLocale] ?? {}),
      },
    };
    return acc;
  }, {});

  if (!resources[locale]) {
    resources[locale] = {
      translation: {
        ...ENGLISH_MESSAGES,
        ...(BUILT_IN_MESSAGES_BY_LOCALE[locale] ?? {}),
      },
    };
  }

  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      // Messages author placeholders with single braces ("{page}") rather than
      // i18next's default double braces, so match that here — otherwise values
      // never interpolate and the raw "{page}" template leaks into the UI.
      prefix: "{",
      suffix: "}",
    },
    resources,
  });

  return instance;
}

type I18nContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
};

const TemplateI18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
  defaultLocale = "en",
  messages,
  messagesByLocale,
  storageKey,
}: {
  children: ReactNode;
  locale?: string;
  messages?: TemplateMessages;
  defaultLocale?: string;
  messagesByLocale?: TemplateLocaleResources;
  storageKey?: string;
}) {
  const initialLocale = locale ?? (
    typeof window !== "undefined" && storageKey
      ? window.localStorage.getItem(storageKey)?.trim() || defaultLocale
      : defaultLocale
  );
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const resolvedMessagesByLocale = useMemo<TemplateLocaleResources>(
    () => messagesByLocale ?? { [activeLocale]: messages ?? {} },
    [activeLocale, messages, messagesByLocale],
  );
  const availableLocales = useMemo(
    () => Object.keys(resolvedMessagesByLocale).sort((left, right) => (left === "en" ? -1 : right === "en" ? 1 : left.localeCompare(right))),
    [resolvedMessagesByLocale],
  );

  useEffect(() => {
    if (locale) {
      setActiveLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = activeLocale;
    }

    if (typeof window !== "undefined" && storageKey) {
      window.localStorage.setItem(storageKey, activeLocale);
    }
  }, [activeLocale, storageKey]);

  const instance = useMemo(
    () => createI18nInstance(activeLocale, resolvedMessagesByLocale),
    [activeLocale, resolvedMessagesByLocale],
  );
  const contextValue = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      setLocale: setActiveLocale,
      availableLocales,
    }),
    [activeLocale, availableLocales],
  );

  return (
    <TemplateI18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={instance}>{children}</I18nextProvider>
    </TemplateI18nContext.Provider>
  );
}

export function useI18n() {
  const { t: rawT, i18n } = useTranslation();
  const contextValue = useContext(TemplateI18nContext);

  const t = (key: TemplateI18nKey | string, fallback?: string, values?: TranslationValues) =>
    rawT(key, {
      ...values,
      defaultValue: ENGLISH_MESSAGES[key as TemplateI18nKey] ?? fallback ?? key,
    });

  return {
    locale: contextValue?.locale ?? i18n.language ?? "en",
    setLocale: contextValue?.setLocale ?? (() => undefined),
    availableLocales: contextValue?.availableLocales ?? [i18n.language ?? "en"],
    t,
  };
}
